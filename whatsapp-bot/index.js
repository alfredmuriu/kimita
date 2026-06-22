// Agrikima WhatsApp bot host.
//
// A thin bridge: open-wa logs into WhatsApp Web (via a one-time QR scan) on a
// SPARE number, and every incoming message is forwarded to our existing CUSTOMER
// bot brain — the deployed /api/whatsapp/bridge endpoint — then the reply is
// sent back. That endpoint runs the same bot-core brain, conversation history,
// and escalation emails as the official Meta webhook; it's the temporary
// stand-in while the official WhatsApp Business API is blocked on Meta
// verification.
//
// The brain lives in the Next.js app and is NOT duplicated here, so it keeps
// improving on its own.
//
// IMPORTANT: this must run on an always-on host (a ~$5/mo VPS). It cannot run on
// Vercel — open-wa keeps a persistent headless-browser WhatsApp session alive.
//
// open-wa breaks WhatsApp's terms of service: run it ONLY on a disposable spare
// number, never the main business line. Treat it as a temporary bridge until the
// official Meta WhatsApp Business API restriction is cleared.

import 'dotenv/config'
import { create } from '@open-wa/wa-automate'

const CHAT_API_URL = process.env.CHAT_API_URL
const AGENT_CRON_SECRET = process.env.AGENT_CRON_SECRET
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

function isAllowed(numberDigits) {
  if (ALLOWED_NUMBERS.length === 0) return true
  return ALLOWED_NUMBERS.includes(numberDigits)
}

function start(client) {
  console.log('[bot] Connected. Listening for messages…')

  client.onMessage(async (message) => {
    // Ignore group chats, status broadcasts, and non-text payloads.
    if (message.isGroupMsg) return
    if (message.from === 'status@broadcast') return
    if (message.type !== 'chat' || !message.body) return

    const senderDigits = (message.from || '').replace(/\D/g, '')
    if (!isAllowed(senderDigits)) {
      console.log(`[bot] Ignoring message from non-allowlisted ${message.from}`)
      return
    }

    console.log(`[bot] ← ${message.from}: ${message.body.slice(0, 80)}`)

    try {
      await client.simulateTyping(message.from, true)
      const reply = await askBrain(senderDigits, message.sender?.pushname || null, message.body)
      await client.simulateTyping(message.from, false)
      await client.sendText(
        message.from,
        reply || 'Sorry, I had no response for that.'
      )
      console.log(`[bot] → ${message.from}: ${(reply || '').slice(0, 80)}`)
    } catch (err) {
      await client.simulateTyping(message.from, false).catch(() => {})
      console.error(`[bot] Failed to handle message from ${message.from}:`, err)
      await client
        .sendText(
          message.from,
          'Sorry — something went wrong reaching the assistant. Please try again shortly.'
        )
        .catch(() => {})
    }
  })
}

create({
  sessionId: 'agrikima',
  // Persist the session so we only scan the QR once, not on every restart.
  multiDevice: true,
  authTimeout: 0,
  headless: true,
  qrTimeout: 0,
  // Use the system-installed Google Chrome instead of open-wa's bundled
  // Chromium — the bundled one times out loading WhatsApp Web on fresh VPS
  // installs. Install with: apt-get install ./google-chrome-stable_*.deb
  useChrome: true,
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  // Required when running as root on a headless server.
  chromiumArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  // Quieter logs; the QR still prints to the terminal for the first scan.
  disableSpins: true,
})
  .then(start)
  .catch((err) => {
    console.error('[bot] Failed to start open-wa:', err)
    process.exit(1)
  })
