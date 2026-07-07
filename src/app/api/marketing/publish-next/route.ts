// Daily social-media publisher. Picks the oldest pending post from the most
// recent completed cycle and publishes it to its platform. Called once per day
// by cron-job.org with header `x-cron-secret: <AGENT_CRON_SECRET>`.

import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { getSupabaseAdmin } from '@/lib/supabase'
import { publishToTwitter } from '@/lib/publishers/twitter'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'
import { publishToTikTok } from '@/lib/publishers/tiktok'
import { sendPublishNotification } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.AGENT_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  // Find the most recent completed cycle — that's this week's planned batch.
  const { data: cycle } = await supabase
    .from('cycles')
    .select('id, weekly_theme')
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!cycle) {
    return NextResponse.json({
      success: true,
      message: 'No completed cycle yet — waiting for the weekly planner to run',
    })
  }

  // Pick the oldest pending post for a platform we can actually publish to.
  // Twitter + Facebook use our own publishers. LinkedIn + Instagram go through
  // Zernio (zernio.ts) and only become publishable once ZERNIO_API_KEY is set.
  // TikTok stays paused pending API access.
  const PUBLISHABLE_PLATFORMS = ['Twitter', 'Facebook']
  if (process.env.ZERNIO_API_KEY) {
    PUBLISHABLE_PLATFORMS.push('LinkedIn', 'Instagram')
  }
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('cycle_id', cycle.id)
    .eq('status', 'pending')
    .in('platform', PUBLISHABLE_PLATFORMS)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!post) {
    return NextResponse.json({
      success: true,
      message: `No pending posts left in cycle ${cycle.id} — next planner run will refill the queue`,
      cycle_id: cycle.id,
    })
  }

  const hashtags: string[] = Array.isArray(post.hashtags) ? post.hashtags : []
  const text = [post.content, hashtags.join(' ')].filter(Boolean).join('\n\n')
  const imageUrl: string | undefined = post.image_url || undefined

  // Reject unknown platforms synchronously so the caller sees a 400.
  const knownPlatforms = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok']
  if (!knownPlatforms.includes(post.platform)) {
    await supabase
      .from('posts')
      .update({ status: 'failed', error_message: `Unknown platform: ${post.platform}` })
      .eq('id', post.id)
    return NextResponse.json({ error: `Unknown platform: ${post.platform}` }, { status: 400 })
  }

  // Publisher calls + Supabase update + notification email run 5-40s total
  // depending on which platform API we're hitting. Do it in the background
  // so cron-job.org sees a fast 200.
  waitUntil(
    (async () => {
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
            return
        }

        // Paused (SOCIAL_PUBLISH_DISABLED): leave the post pending so it
        // publishes once posting resumes, and send no notification email.
        if (result.skipped) {
          console.log(`[publish-next] Skipped post ${post.id} (${post.platform}) — publishing paused, left pending`)
          return
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
        ).catch((err) => console.error('[publish-next] Notification email failed:', err))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`[publish-next] Background publish crashed for post ${post.id}:`, message)
        await supabase
          .from('posts')
          .update({ status: 'failed', error_message: message })
          .eq('id', post.id)
      }
    })()
  )

  return NextResponse.json({
    success: true,
    message: 'Publish started in background',
    cycle_id: cycle.id,
    post_id: post.id,
    platform: post.platform,
  })
}
