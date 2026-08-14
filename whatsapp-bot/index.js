// Agrikima WhatsApp bot host.
//
// A thin bridge: Baileys logs into WhatsApp (via a one-time QR scan) on a SPARE
// number, and every incoming message is forwarded to our existing CUSTOMER bot
// brain — the deployed /api/whatsapp/bridge endpoint — then the reply is sent
// back. That endpoint runs the same bot-core brain, conversation history, and
// escalation emails as the official Meta webhook; it's the temporary stand-in
// while the official WhatsApp Business API is blocked on Meta verification.
//
// The brain lives in the Next.js app and is NOT duplicated here, so it keeps
// improving on its own.
//
// IMPORTANT: this must run on an always-on host (a ~$5/mo VPS). Baileys keeps a
// persistent WebSocket WhatsApp session alive — there is NO browser/Chromium,
// which is why this replaced the old open-wa host (its headless Chrome kept
// timing out at the QR step on the VPS).
//
// Baileys is an unofficial WhatsApp client and breaks WhatsApp's terms of
// service: run it ONLY on a disposable spare number, never the main business
// line. Treat it as a temporary bridge until the official Meta WhatsApp Business
// API restriction is cleared.

import 'dotenv/config'
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import P from 'pino'

const CHAT_API_URL = process.env.CHAT_API_URL
const AGENT_CRON_SECRET = process.env.AGENT_CRON_SECRET
// Liveness ping. Derived from CHAT_API_URL so there's one URL to configure, but
// overridable for local testing. The watchdog cron emails staff if these stop.
const HEARTBEAT_URL =
  process.env.HEARTBEAT_URL || CHAT_API_URL?.replace(/\/bridge\/?$/, '/heartbeat')
const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000
// Comma-separated list of allowed WhatsApp numbers (digits only, e.g.
// "254712345678,254700111222"). Empty = reply to everyone (not recommended).
const ALLOWED_NUMBERS = (process.env.ALLOWED_NUMBERS || '')
  .split(',')
  .map((n) => n.replace(/\D/g, ''))
  .filter(Boolean)

if (!CHAT_API_URL || !AGENT_CRON_SECRET) {
  console.error(
    '[bot] Missing required env. Set CHAT_API_URL and AGENT_CRON_SECRET (see .env.example).'
  )
  process.exit(1)
}

// Forward one message to the customer brain and return its reply text.
// `phone` is the sender's number (digits); `name` is their WhatsApp display name.
async function askBrain(phone, name, message) {
  const res = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Same secret the cron jobs use — the bridge route checks this header.
      'x-cron-secret': AGENT_CRON_SECRET,
    },
    body: JSON.stringify({ phone, name, message }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`bridge API ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.reply
}

// Tell the app we're alive. Only ever called while the WhatsApp socket is open,
// so a missing beat means the bridge genuinely can't serve customers — not just
// that the process is running. Never throws: a monitoring blip must not disturb
// the bot.
async function sendHeartbeat(status) {
  if (!HEARTBEAT_URL) return
  try {
    const res = await fetch(HEARTBEAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': AGENT_CRON_SECRET,
      },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      console.warn(`[bot] Heartbeat rejected (${res.status}) — watchdog may report a false outage`)
    }
  } catch (err) {
    console.warn('[bot] Heartbeat failed:', err.message)
  }
}

function isAllowed(numberDigits) {
  if (ALLOWED_NUMBERS.length === 0) return true
  return ALLOWED_NUMBERS.includes(numberDigits)
}

// Pull plain text out of the various Baileys message shapes.
function extractText(msg) {
  const m = msg.message
  if (!m) return ''
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ''
  )
}

// Module-scoped so reconnects reuse one timer instead of stacking a new one per
// connect() call.
let heartbeatTimer = null

function startHeartbeat() {
  if (heartbeatTimer) return
  sendHeartbeat('connected')
  heartbeatTimer = setInterval(() => sendHeartbeat('connected'), HEARTBEAT_INTERVAL_MS)
  // Don't hold the event loop open just for the ping.
  heartbeatTimer.unref?.()
}

function stopHeartbeat() {
  if (!heartbeatTimer) return
  clearInterval(heartbeatTimer)
  heartbeatTimer = null
}

async function connect() {
  // Persist the session under ./auth_info so we only scan the QR once.
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    // We render the QR ourselves below for a reliable terminal display.
    printQRInTerminal: false,
    logger: P({ level: 'silent' }),
    // Identifies the linked-device entry shown on the phone.
    browser: ['Agrikima Bot', 'Chrome', '1.0.0'],
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('\n[bot] Scan this QR with the SPARE number:')
      console.log('      WhatsApp → Settings → Linked Devices → Link a Device\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log('[bot] Connected. Listening for messages…')
      startHeartbeat()
    }

    if (connection === 'close') {
      // Stop beating the moment we're off WhatsApp, so the watchdog notices even
      // if the process itself is perfectly healthy.
      stopHeartbeat()
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const loggedOut = statusCode === DisconnectReason.loggedOut
      console.log(
        `[bot] Connection closed (code ${statusCode ?? 'unknown'}).` +
          (loggedOut ? ' Logged out — delete auth_info and rescan.' : ' Reconnecting…')
      )
      if (!loggedOut) {
        connect().catch((err) => console.error('[bot] Reconnect failed:', err))
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const message of messages) {
      const jid = message.key?.remoteJid
      // Skip our own messages, groups, and status broadcasts.
      if (!jid || message.key?.fromMe) continue
      if (jid.endsWith('@g.us') || jid === 'status@broadcast') continue

      const body = extractText(message).trim()
      if (!body) continue

      const senderDigits = jid.split('@')[0].replace(/\D/g, '')
      if (!isAllowed(senderDigits)) {
        console.log(`[bot] Ignoring message from non-allowlisted ${jid}`)
        continue
      }

      console.log(`[bot] ← ${jid}: ${body.slice(0, 80)}`)

      try {
        await sock.sendPresenceUpdate('composing', jid)
        const reply = await askBrain(senderDigits, message.pushName || null, body)
        await sock.sendPresenceUpdate('paused', jid)
        await sock.sendMessage(jid, {
          text: reply || 'Sorry, I had no response for that.',
        })
        console.log(`[bot] → ${jid}: ${(reply || '').slice(0, 80)}`)
      } catch (err) {
        await sock.sendPresenceUpdate('paused', jid).catch(() => {})
        console.error(`[bot] Failed to handle message from ${jid}:`, err)
        await sock
          .sendMessage(jid, {
            text: 'Sorry — something went wrong reaching the assistant. Please try again shortly.',
          })
          .catch(() => {})
      }
    }
  })
}

connect().catch((err) => {
  console.error('[bot] Failed to start:', err)
  process.exit(1)
})
