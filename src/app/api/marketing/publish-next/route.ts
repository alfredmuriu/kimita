// Daily social-media publisher. Picks the oldest pending post from the most
// recent completed cycle and publishes it to its platform. Called once per day
// by cron-job.org with header `x-cron-secret: <AGENT_CRON_SECRET>`.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { publishToTwitter } from '@/lib/publishers/twitter'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'
import { publishToTikTok } from '@/lib/publishers/tiktok'
import { sendPublishNotification } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
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

  // Pick the oldest pending post from that cycle.
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('cycle_id', cycle.id)
    .eq('status', 'pending')
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
      result = await publishToLinkedIn(post.id, text)
      break
    case 'TikTok':
      result = await publishToTikTok(post.id, text)
      break
    default:
      // Unknown platform — mark failed so we don't keep retrying it.
      await supabase
        .from('posts')
        .update({ status: 'failed', error_message: `Unknown platform: ${post.platform}` })
        .eq('id', post.id)
      return NextResponse.json({ error: `Unknown platform: ${post.platform}` }, { status: 400 })
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

  return NextResponse.json({
    success: result.success,
    cycle_id: cycle.id,
    post_id: post.id,
    platform: post.platform,
    post_url: result.post_url,
    error_message: result.error_message,
  })
}
