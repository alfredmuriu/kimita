// Send a staff email when the WhatsApp bot escalates a conversation.

import { Resend } from 'resend'
import type { ConversationTurn } from './whatsapp-bot'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = 'Agrikima WhatsApp Bot <agent@agrikima.co.ke>'

export async function sendEscalationEmail(params: {
  customerPhone: string
  customerName: string | null
  reason: string
  history: ConversationTurn[]
  latestMessage: string
}): Promise<void> {
  const recipients = (process.env.AGENT_NOTIFY_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  if (!recipients.length) return

  const historyRows = [...params.history, { role: 'user' as const, content: params.latestMessage }]
    .map((turn) => {
      const bg = turn.role === 'user' ? '#f0fdf4' : '#f3f4f6'
      const label = turn.role === 'user' ? 'Customer' : 'Bot'
      return `
        <div style="background:${bg};border-radius:8px;padding:10px 14px;margin-bottom:8px">
          <div style="font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;margin-bottom:4px">${label}</div>
          <div style="font-size:14px;color:#111;white-space:pre-wrap">${escapeHtml(turn.content)}</div>
        </div>
      `
    })
    .join('')

  const waLink = `https://wa.me/${params.customerPhone}`

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:640px;margin:0 auto;color:#111">
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:6px;margin-bottom:20px">
        <div style="font-size:12px;color:#92400e;font-weight:600;text-transform:uppercase;margin-bottom:4px">WhatsApp Escalation</div>
        <div style="font-size:14px;color:#78350f">${escapeHtml(params.reason)}</div>
      </div>

      <table style="width:100%;font-size:14px;margin-bottom:20px">
        <tr>
          <td style="padding:4px 0;color:#6b7280;width:120px">Customer:</td>
          <td style="padding:4px 0"><strong>${escapeHtml(params.customerName || 'Unknown')}</strong></td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280">Phone:</td>
          <td style="padding:4px 0">
            <a href="${waLink}" style="color:#16a34a;text-decoration:none">+${escapeHtml(params.customerPhone)} →</a>
          </td>
        </tr>
      </table>

      <h3 style="font-size:14px;color:#374151;margin-bottom:12px">Conversation</h3>
      ${historyRows}

      <a href="${waLink}" style="display:inline-block;background:#16a34a;color:#fff;border-radius:6px;padding:10px 20px;text-decoration:none;font-size:14px;font-weight:600;margin-top:16px">
        Reply on WhatsApp →
      </a>

      <p style="margin-top:24px;font-size:12px;color:#9ca3af">Agrikima WhatsApp Assistant</p>
    </div>
  `

  await resend.emails.send({
    from: FROM,
    to: recipients,
    subject: `[WhatsApp] ${params.customerName || params.customerPhone} needs a human`,
    html,
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
