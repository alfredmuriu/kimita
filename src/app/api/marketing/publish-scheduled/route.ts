// Scheduled-post dispatcher. Finds pending posts whose scheduled_for time has
// arrived and publishes them. Trigger with cron-job.org every 5-15 minutes
// using header `x-cron-secret: <AGENT_CRON_SECRET>`.

import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { getSupabaseAdmin } from '@/lib/supabase'
import { publishToTwitter } from '@/lib/publishers/twitter'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'
import { publishToTikTok } from '@/lib/publishers/tiktok'
import { sendPublishNotification } from '@/lib/email'
import { DISABLED_CONTENT_TYPES, isDisabledContentType } from '@/lib/content-policy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const maxDuration = 120

const KNOWN_PLATFORMS = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok']

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.AGENT_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  const nowIso = new Date().toISOString()

  // Pull every pending post whose scheduled time has arrived, oldest first.
  const { data: duePosts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'pending')
    .not('scheduled_for', 'is', null)
    .lte('scheduled_for', nowIso)
    // Exclude disabled types in the query as well as in the loop below, so a
    // backlog of disabled-type posts can't eat the 20-row limit and starve real posts.
    .not('content_type', 'in', `(${DISABLED_CONTENT_TYPES.join(',')})`)
    .order('scheduled_for', { ascending: true })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({ success: true, message: 'No scheduled posts due', due: 0 })
  }

  // Run publishes in the background so cron-job.org sees a fast 200.
  waitUntil(
    (async () => {
      for (const post of duePosts) {
        // Disabled types (articles, carousels) — leave them pending (never
        // published, never failed) so they sit out until the policy changes.
        if (isDisabledContentType(post.content_type)) {
          console.log(
            `[publish-scheduled] Skipped post ${post.id} — content_type "${post.content_type}" is disabled`
          )
          continue
        }

        if (!KNOWN_PLATFORMS.includes(post.platform)) {
          await supabase
            .from('posts')
            .update({ status: 'failed', error_message: `Unknown platform: ${post.platform}` })
            .eq('id', post.id)
          continue
        }

        const hashtags: string[] = Array.isArray(post.hashtags) ? post.hashtags : []
        const text = [post.content, hashtags.join(' ')].filter(Boolean).join('\n\n')
        const imageUrl: string | undefined = post.image_url || undefined

        try {
          let result
          switch (post.platform) {
            case 'Twitter':
              result = await publishToTwitter(post.id, text)
              break
            case 'Facebook':
              result = await publishToFacebook(post.id, text, imageUrl)
              break
            case 'Instagram':
              result = await publishToInstagram(post.id, text, imageUrl)
              break
            case 'LinkedIn':
              result = await publishToLinkedIn(post.id, text, imageUrl)
              break
            case 'TikTok':
              result = await publishToTikTok(post.id, text)
              break
            default:
              continue
          }

          // Paused (SOCIAL_PUBLISH_DISABLED): leave the post pending so it
          // publishes once posting resumes, and send no notification email.
          if (result.skipped) {
            console.log(`[publish-scheduled] Skipped post ${post.id} (${post.platform}) — publishing paused, left pending`)
            continue
          }

          await supabase
            .from('posts')
            .update({
              status: result.success ? 'published' : 'failed',
              platform_post_id: result.platform_post_id || null,
              post_url: result.post_url || null,
              error_message: result.error_message || null,
              published_at: result.success ? new Date().toISOString() : null,
            })
            .eq('id', post.id)

          await sendPublishNotification(
            post.platform,
            text,
            result.post_url,
            result.success,
            result.error_message
          ).catch((err) => console.error('[publish-scheduled] Notification email failed:', err))
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.error(`[publish-scheduled] Crashed for post ${post.id}:`, message)
          await supabase
            .from('posts')
            .update({ status: 'failed', error_message: message })
            .eq('id', post.id)
        }
      }
    })()
  )

  return NextResponse.json({
    success: true,
    message: 'Scheduled publishes started in background',
    due: duePosts.length,
    post_ids: duePosts.map((p) => p.id),
  })
}
