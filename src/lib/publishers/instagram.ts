import axios from 'axios'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
}

export async function publishToInstagram(
  postId: string,
  caption: string,
  imageUrl?: string
): Promise<PublishResult> {
  try {
    const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN!

    if (!imageUrl) {
      const message = 'Instagram requires an image URL — skipping (no image available)'
      console.warn('[Instagram]', message)
      await logToSupabase(postId, 'Instagram', false, undefined, message)
      return { success: false, error_message: message }
    }

    // Step 1 — Create media container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}/media`,
      {
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }
    )

    const containerId = containerResponse.data.id

    // Step 2 — Publish the container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    )

    const mediaId = publishResponse.data.id
    const result: PublishResult = {
      success: true,
      platform_post_id: mediaId,
      post_url: `https://instagram.com/p/${mediaId}`,
    }

    await logToSupabase(postId, 'Instagram', true, mediaId, undefined)
    return result
  } catch (err: unknown) {
    const message =
      axios.isAxiosError(err)
        ? err.response?.data?.error?.message || err.message
        : String(err)
    console.error('[Instagram] Publish failed:', message)
    await logToSupabase(postId, 'Instagram', false, undefined, message)
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
    console.error('[Instagram] Failed to log to Supabase:', err)
  }
}
