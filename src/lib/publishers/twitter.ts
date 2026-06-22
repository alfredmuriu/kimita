import { TwitterApi } from 'twitter-api-v2'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
  // True when the publish was intentionally skipped (e.g. paused via
  // SOCIAL_PUBLISH_DISABLED). Callers should leave the post pending and send no
  // notification, rather than treating it as a real failure.
  skipped?: boolean
}

function getClient() {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  })
}

export async function publishToTwitter(
  postId: string,
  text: string
): Promise<PublishResult> {
  // Temporary pause switch. The publishing logic below stays intact; while
  // SOCIAL_PUBLISH_DISABLED is set we just skip the actual tweet. Remove the
  // env var (or set it to anything but 'true') in Vercel to resume. Returns
  // `skipped` so callers leave the post pending and send no email.
  if (process.env.SOCIAL_PUBLISH_DISABLED === 'true') {
    const message = 'Twitter publishing paused (SOCIAL_PUBLISH_DISABLED)'
    console.log(`[Twitter] ${message} — skipping post ${postId}`)
    return { success: false, skipped: true, error_message: message }
  }

  try {
    const client = getClient()
    const tweet = await client.v2.tweet(text.slice(0, 280))

    const result: PublishResult = {
      success: true,
      platform_post_id: tweet.data.id,
      post_url: `https://x.com/agrikima_africa/status/${tweet.data.id}`,
    }

    await logToSupabase(postId, 'Twitter', true, tweet.data.id, undefined)
    return result
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[Twitter] Publish failed:', message)
    await logToSupabase(postId, 'Twitter', false, undefined, message)
    return { success: false, error_message: message }
  }
}

async function logToSupabase(
  postId: string,
  platform: string,
  success: boolean,
  platformPostId?: string,
  errorMessage?: string
) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return
    await supabase.from('publish_log').insert({
      post_id: postId,
      platform,
      success,
      platform_post_id: platformPostId || null,
      error_message: errorMessage || null,
    })
  } catch (err) {
    console.error('[Twitter] Failed to log to Supabase:', err)
  }
}
