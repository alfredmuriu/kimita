// Thin wrapper around Brevo's transactional email API.
// All outbound email across the app (bot escalations, marketing agent digests,
// contact form) goes through sendEmail() so we can swap providers in one place.
//
// Docs: https://developers.brevo.com/reference/sendtransacemail

interface SendEmailParams {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
  // Optional override for the From display name. The From email is always
  // EMAIL_FROM (the Brevo-verified sender).
  fromName?: string
}

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

export async function sendEmail(params: SendEmailParams): Promise<{ messageId: string }> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not set')
  }

  const fromEmail = process.env.EMAIL_FROM
  if (!fromEmail) {
    throw new Error('EMAIL_FROM is not set')
  }

  const toList = Array.isArray(params.to) ? params.to : [params.to]

  const body: Record<string, unknown> = {
    sender: { name: params.fromName || 'Agrikima', email: fromEmail },
    to: toList.map((email) => ({ email })),
    subject: params.subject,
  }
  if (params.html) body.htmlContent = params.html
  if (params.text) body.textContent = params.text
  if (params.replyTo) body.replyTo = { email: params.replyTo }

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Brevo send failed (${response.status}): ${errText}`)
  }

  return (await response.json()) as { messageId: string }
}
