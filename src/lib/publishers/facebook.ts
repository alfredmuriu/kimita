import axios from 'axios'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
}

export async function publishToFacebook(
  postId: string,
  text: string,
  mediaUrl?: string,
  mediaType: 'image' | 'video' = 'image'
): Promise<PublishResult> {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID!
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN!

    let endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`
    const payload: Record<string, string> = { message: text, access_token: accessToken }

    if (mediaUrl && mediaType === 'image') {
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`
      payload.url = mediaUrl
      payload.caption = text
      delete payload.message
    } else if (mediaUrl && mediaType === 'video') {
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/videos`
      payload.file_url = mediaUrl
      payload.description = text
      delete payload.message
    }

    const response = await axios.post(endpoint, payload)

    const fbPostId = response.data.id
    const result: PublishResult = {
      success: true,
      platform_post_id: fbPostId,
      post_url: `https://facebook.com/${fbPostId}`,
    }

    await logToSupabase(postId, 'Facebook', true, fbPostId, undefined)
    return result
  } catch (err: unknown) {
    const message =
      axios.isAxiosError(err)
        ? err.response?.data?.error?.message || err.message
        : String(err)
    console.error('[Facebook] Publish failed:', message)
    await logToSupabase(postId, 'Facebook', false, undefined, message)
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
    console.error('[Facebook] Failed to log to Supabase:', err)
  }
}
