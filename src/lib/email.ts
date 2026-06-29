import { sendEmail } from './email-client'
import type { ContentPlan } from './strategy'

const FROM_NAME = 'Agrikima Marketing Agent'

export async function sendWeeklyDigest(
  strategy: ContentPlan,
  recipients: string[]
): Promise<void> {
  const cards = strategy.posts
    .map((p, i) => {
      const hashtags = Array.isArray(p.hashtag_focus) ? p.hashtag_focus.filter(Boolean) : []
      const meta = [p.scheduled_day, p.platform, p.content_type, p.pillar]
        .filter(Boolean)
        .join(' &middot; ')
      return `
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px">
        <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.03em">
          ${i + 1}. ${meta}
        </div>
        <div style="font-size:16px;font-weight:700;margin:6px 0">${p.topic}</div>
        ${p.brief ? `<div style="font-size:14px;color:#374151;line-height:1.55">${p.brief}</div>` : ''}
        ${hashtags.length ? `<div style="margin-top:10px;font-size:13px;color:#2563eb">${hashtags.join(' ')}</div>` : ''}
      </div>`
    })
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

      <h3 style="margin:24px 0 12px;font-size:16px">Planned posts</h3>
      ${cards}

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
  const envRecipients = (process.env.AGENT_NOTIFY_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  const recipients = envRecipients.length
    ? envRecipients
    : ['info@agrikima.co.ke', 'justin@agrikima.co.ke']

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
