// Helper for WhatsApp Cloud API (Meta) — send messages, mark read, parse incoming payloads.

const GRAPH_URL = 'https://graph.facebook.com/v21.0'

const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''

function assertConfigured() {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    throw new Error('WhatsApp is not configured — missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID')
  }
}

// Send a plain text message to a phone number (E.164 format, e.g. "254712345678")
export async function sendTextMessage(to: string, text: string): Promise<void> {
  assertConfigured()

  const res = await fetch(`${GRAPH_URL}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`WhatsApp sendTextMessage failed: ${res.status} ${errBody}`)
  }
}

// Mark an incoming message as read (so the sender sees blue ticks)
export async function markAsRead(messageId: string): Promise<void> {
  assertConfigured()

  const res = await fetch(`${GRAPH_URL}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error(`WhatsApp markAsRead failed: ${res.status} ${errBody}`)
  }
}

// ── Types for incoming webhook payloads ────────────────────────────────────

export interface WhatsAppIncomingMessage {
  from: string        // phone number, e.g. "254712345678"
  messageId: string
  name: string | null // profile name if available
  text: string        // message body (empty if non-text message)
  timestamp: string   // unix epoch seconds as string
  type: string        // "text", "image", "audio", "video", "document", "location", etc.
}

// Extract the first usable message from a webhook payload. WhatsApp can batch
// multiple entries/changes per webhook call, but per the docs the common case
// is one message per call, so we return the first and ignore the rest.
export function parseIncomingMessage(payload: unknown): WhatsAppIncomingMessage | null {
  try {
    const body = payload as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: Array<{
              from: string
              id: string
              timestamp: string
              type: string
              text?: { body: string }
            }>
            contacts?: Array<{
              profile?: { name?: string }
              wa_id?: string
            }>
          }
        }>
      }>
    }

    const change = body.entry?.[0]?.changes?.[0]?.value
    const msg = change?.messages?.[0]
    if (!msg) return null

    const contact = change?.contacts?.[0]
    return {
      from: msg.from,
      messageId: msg.id,
      name: contact?.profile?.name || null,
      text: msg.text?.body || '',
      timestamp: msg.timestamp,
      type: msg.type,
    }
  } catch (err) {
    console.error('parseIncomingMessage error:', err)
    return null
  }
}
