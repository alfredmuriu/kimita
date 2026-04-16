import { sendEmail } from './email-client'
import type { ContentPlan } from './strategy'

const FROM_NAME = 'Agrikima Marketing Agent'

export async function sendWeeklyDigest(
  strategy: ContentPlan,
  recipients: string[]
): Promise<void> {
  const rows = strategy.posts
    .map(
      (p) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${p.platform}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${p.content_type}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${p.topic}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${p.scheduled_day || '—'}</td>
      </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:640px;margin:0 auto;color:#111">
      <h2 style="margin-bottom:4px">Agrikima Weekly Content Plan</h2>
      <p style="color:#6b7280;margin-top:0">Theme: <strong>${strategy.weekly_theme}</strong></p>

      <div style="display:flex;gap:16px;margin-bottom:24px">
        <div style="background:#f0fdf4;border-radius:8px;padding:12px 20px;flex:1">
          <div style="font-size:12px;color:#16a34a;font-weight:600;text-transform:uppercase">AI Confidence</div>
          <div style="font-size:28px;font-weight:700">${Math.round(strategy.ai_confidence_score * 100)}%</div>
        </div>
        <div style="background:#fef9c3;border-radius:8px;padding:12px 20px;flex:1">
          <div style="font-size:12px;color:#ca8a04;font-weight:600;text-transform:uppercase">Posts Planned</div>
          <div style="font-size:28px;font-weight:700">${strategy.posts.length}</div>
        </div>
      </div>

      ${strategy.competitor_gap ? `<p><strong>Competitor gap:</strong> ${strategy.competitor_gap}</p>` : ''}
      ${strategy.trending_opportunity ? `<p><strong>Trending opportunity:</strong> ${strategy.trending_opportunity}</p>` : ''}

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f9fafb;text-align:left">
            <th style="padding:8px 12px;border-bottom:2px solid #e5e7eb">Platform</th>
            <th style="padding:8px 12px;border-bottom:2px solid #e5e7eb">Type</th>
            <th style="padding:8px 12px;border-bottom:2px solid #e5e7eb">Topic</th>
            <th style="padding:8px 12px;border-bottom:2px solid #e5e7eb">Day</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p style="margin-top:24px;font-size:12px;color:#9ca3af">
        Content generation is now running. You will receive individual publish notifications as each post goes live.
      </p>
    </div>
  `

  await sendEmail({
    fromName: FROM_NAME,
    to: recipients,
    subject: `Agrikima — Weekly content plan ready (${strategy.posts.length} posts)`,
    html,
  })
}

export async function sendPublishNotification(
  platform: string,
  postContent: string,
  postUrl: string | undefined,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  const recipients = (process.env.AGENT_NOTIFY_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  if (!recipients.length) return

  const preview = postContent.slice(0, 200) + (postContent.length > 200 ? '…' : '')
  const statusColor = success ? '#16a34a' : '#dc2626'
  const statusLabel = success ? 'Published' : 'Failed'

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="background:${statusColor};color:#fff;border-radius:4px;padding:4px 10px;font-size:12px;font-weight:600">
          ${statusLabel}
        </span>
        <span style="font-size:16px;font-weight:600">${platform}</span>
      </div>

      <blockquote style="border-left:3px solid #e5e7eb;margin:0 0 16px;padding:8px 16px;color:#374151;font-size:14px">
        ${preview}
      </blockquote>

      ${
        success && postUrl
          ? `<a href="${postUrl}" style="display:inline-block;background:#16a34a;color:#fff;border-radius:6px;padding:10px 20px;text-decoration:none;font-size:14px;font-weight:600">View Post →</a>`
          : ''
      }

      ${
        !success && errorMessage
          ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px 16px;font-size:13px;color:#dc2626">
              <strong>Error:</strong> ${errorMessage}
            </div>`
          : ''
      }

      <p style="margin-top:24px;font-size:12px;color:#9ca3af">Agrikima Marketing Agent</p>
    </div>
  `

  await sendEmail({
    fromName: FROM_NAME,
    to: recipients,
    subject: `[${statusLabel}] ${platform} post — Agrikima`,
    html,
  })
}
