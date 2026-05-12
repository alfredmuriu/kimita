// Twilio WhatsApp sender. Mirrors the surface of `whatsapp.ts` but speaks
// Twilio's REST API instead of Meta's Graph API.

const SID = process.env.TWILIO_ACCOUNT_SID || ''
const TOKEN = process.env.TWILIO_AUTH_TOKEN || ''
const FROM = process.env.TWILIO_WHATSAPP_FROM || '' // e.g. "whatsapp:+14155238886"

export async function sendTwilioWhatsAppMessage(to: string, body: string): Promise<void> {
  if (!SID || !TOKEN || !FROM) {
    throw new Error('Twilio env vars missing (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM)')
  }

  const toAddr = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : '+' + to}`

  const params = new URLSearchParams({ To: toAddr, From: FROM, Body: body })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${SID}:${TOKEN}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Twilio send failed (${res.status}): ${text}`)
  }
}

export type TwilioIncomingMessage = {
  from: string // bare E.164 like "254790600972" (no "whatsapp:" prefix, no "+")
  name?: string
  text: string
  messageId: string
}

export function parseTwilioIncoming(form: URLSearchParams): TwilioIncomingMessage | null {
  const fromRaw = form.get('From') || ''
  const body = form.get('Body') || ''
  const sid = form.get('MessageSid') || form.get('SmsMessageSid') || ''
  if (!fromRaw || !body) return null

  // Twilio sends From as "whatsapp:+254790600972"
  const from = fromRaw.replace(/^whatsapp:/, '').replace(/^\+/, '')
  const name = form.get('ProfileName') || undefined

  return { from, name, text: body, messageId: sid }
}
