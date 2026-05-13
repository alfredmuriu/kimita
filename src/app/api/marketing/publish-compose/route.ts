import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { publishToTwitter } from '@/lib/publishers/twitter'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'
import { sendPublishNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })

  const { platform, content, hashtags, media_url, media_type, text, scheduled_for } = await req.json()

  if (!platform || !content) {
    return NextResponse.json({ error: 'platform and content are required' }, { status: 400 })
  }

  // Validate scheduled_for if present
  let scheduledAt: string | null = null
  if (scheduled_for) {
    const d = new Date(scheduled_for)
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduled_for timestamp' }, { status: 400 })
    }
    if (d.getTime() < Date.now() - 60_000) {
      return NextResponse.json({ error: 'scheduled_for must be in the future' }, { status: 400 })
    }
    scheduledAt = d.toISOString()
  }

  // Save to posts table — for scheduled posts, persist media_url to image_url
  // so the dispatcher can republish it later.
  const { data: post, error: saveError } = await supabase
    .from('posts')
    .insert({
      platform,
      content_type: 'manual',
      content,
      hashtags: hashtags ?? [],
      image_url: media_url ?? null,
      status: 'pending',
      scheduled_for: scheduledAt,
    })
    .select('id')
    .single()

  if (saveError || !post) {
    console.error('[publish-compose] Supabase insert failed:', saveError)
    return NextResponse.json(
      { error: 'Failed to save post', detail: saveError?.message, code: saveError?.code, hint: saveError?.hint },
      { status: 500 }
    )
  }

  // Scheduled: don't publish now, return early.
  if (scheduledAt) {
    return NextResponse.json({
      success: true,
      scheduled: true,
      scheduled_for: scheduledAt,
      post_id: post.id,
    })
  }

  // Publish immediately
  let result
  switch (platform) {
    case 'Twitter':
      result = await publishToTwitter(post.id, text)
      break
    case 'Facebook':
      result = await publishToFacebook(post.id, text, media_url, media_type)
      break
    case 'Instagram':
      result = await publishToInstagram(post.id, text, media_url)
      break
    case 'LinkedIn':
      result = await publishToLinkedIn(post.id, text)
      break
    default:
      return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 })
  }

  // Update post record
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

  // Email notification
  await sendPublishNotification(
    platform,
    text,
    result.post_url,
    result.success,
    result.error_message
  ).catch((err) => console.error('[Compose] Email notification failed:', err))

  return NextResponse.json({
    success: result.success,
    post_url: result.post_url,
    error: result.error_message,
  })
}
