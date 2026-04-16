import { TwitterApi } from 'twitter-api-v2'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
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
  try {
    const client = getClient()
    const tweet = await client.v2.tweet(text.slice(0, 280))

    const result: PublishResult = {
      success: true,
      platform_post_id: tweet.data.id,
      post_url: `https://x.com/AgrikimaB/status/${tweet.data.id}`,
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
