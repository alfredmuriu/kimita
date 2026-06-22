import axios from 'axios'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
}

// Facebook no longer reliably renders a link-preview image for plain `message`
// posts via the Graph API (unlike Twitter, which auto-cards the article's OG
// image). So when a post has no explicit media but references an Agrikima
// article, pull that article's featured image and post it as a real photo.
async function resolveArticleImage(text: string): Promise<string | undefined> {
  const match = text.match(/agrikima\.co\.ke\/articles\/([a-z0-9-]+)/i)
  if (!match) return undefined
  const slug = match[1]
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return undefined
    const { data } = await supabase
      .from('blog_posts')
      .select('featured_image')
      .eq('slug', slug)
      .maybeSingle()
    return data?.featured_image || undefined
  } catch {
    return undefined
  }
}

export async function publishToFacebook(
  postId: string,
  text: string,
  mediaUrl?: string,
  mediaType: 'image' | 'video' = 'image'
): Promise<PublishResult> {
  // Temporary pause switch. The publishing logic below stays intact; while
  // SOCIAL_PUBLISH_DISABLED is set we just skip the actual post. Remove the
  // env var (or set it to anything but 'true') in Vercel to resume.
  if (process.env.SOCIAL_PUBLISH_DISABLED === 'true') {
    const message = 'Facebook publishing paused (SOCIAL_PUBLISH_DISABLED)'
    console.log(`[Facebook] ${message} — skipping post ${postId}`)
    await logToSupabase(postId, 'Facebook', false, undefined, message)
    return { success: false, error_message: message }
  }

  try {
    const pageId = process.env.FACEBOOK_PAGE_ID!
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN!

    // No explicit media? Fall back to the linked article's featured image so
    // Facebook posts carry a picture instead of a bare link.
    if (!mediaUrl) {
      mediaUrl = await resolveArticleImage(text)
    }

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
