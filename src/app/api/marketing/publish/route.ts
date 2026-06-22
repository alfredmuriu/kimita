import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { publishToTwitter } from '@/lib/publishers/twitter'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'
import { publishToTikTok } from '@/lib/publishers/tiktok'
import { sendPublishNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })

  const { post_id } = await req.json()
  if (!post_id) return NextResponse.json({ error: 'post_id is required' }, { status: 400 })

  // Fetch the post
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', post_id)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (post.status === 'published') {
    return NextResponse.json({ error: 'Post already published' }, { status: 400 })
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
      return NextResponse.json({ error: `Unknown platform: ${post.platform}` }, { status: 400 })
  }

  // Paused (SOCIAL_PUBLISH_DISABLED): leave the post pending and send no email.
  if (result.skipped) {
    return NextResponse.json({
      success: false,
      skipped: true,
      platform: post.platform,
      error_message: result.error_message,
    })
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
  ).catch((err) => console.error('[Publish] Email notification failed:', err))

  return NextResponse.json({
    success: result.success,
    platform: post.platform,
    post_url: result.post_url,
    error_message: result.error_message,
  })
}
