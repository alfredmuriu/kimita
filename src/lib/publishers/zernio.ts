// Shared Zernio publisher. Zernio is a unified social API that handles the
// platform OAuth we were blocked on for LinkedIn + Instagram. One API key
// (ZERNIO_API_KEY, format sk_...) plus a per-platform connected-account ID.
//
// Docs: https://docs.zernio.com  — POST https://zernio.com/api/v1/posts
// Free tier covers the first 2 connected accounts (LinkedIn + TikTok), so this
// is the whole social-publishing path for those two platforms.

import axios from 'axios'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
  // True when the publish was intentionally skipped (e.g. paused). Kept in sync
  // with the other publishers so callers can read result.skipped on the union.
  skipped?: boolean
}

const ZERNIO_POSTS_URL = 'https://zernio.com/api/v1/posts'

// Zernio publishes synchronously, so we wait out whatever the downstream
// platform takes. Instagram is the slow one: Zernio has to hand Meta the image
// URL, wait for Meta to fetch it into a container, then publish that container —
// which regularly runs past 30s and left us timing out on posts Zernio had
// actually published. LinkedIn accepts the post in one call and stays quick.
// Both sit inside the callers' maxDuration of 120s.
const TIMEOUT_MS: Record<ZernioPlatform, number> = {
  instagram: 90_000,
  linkedin: 30_000,
}

// Zernio's platform slug for each of our display-name platforms.
type ZernioPlatform = 'linkedin' | 'instagram'

/**
 * Publish a post to one connected Zernio account. Stays dormant (returns a
 * skipped failure) until the API key and the matching account ID are present in
 * env, so it's safe to wire before creds land. `imageUrl` is attached as a
 * mediaItem; Instagram requires one, so we skip cleanly if it's missing.
 */
export async function publishViaZernio(
  postId: string,
  text: string,
  platform: ZernioPlatform,
  accountId: string | undefined,
  displayName: string,
  imageUrl?: string
): Promise<PublishResult> {
  const apiKey = process.env.ZERNIO_API_KEY

  if (!apiKey || !accountId) {
    const missing = !apiKey ? 'ZERNIO_API_KEY' : `account ID for ${displayName}`
    const message = `Zernio not configured (missing ${missing}) — skipped`
    console.warn(`[Zernio:${displayName}] ${message} for post ${postId}`)
    return { success: false, error_message: message }
  }

  // Instagram is image-first and Zernio rejects an image-less IG post.
  if (platform === 'instagram' && !imageUrl) {
    const message = 'Instagram requires an image — skipping (no image available)'
    console.warn(`[Zernio:${displayName}] ${message} for post ${postId}`)
    await logToSupabase(postId, displayName, false, undefined, message)
    return { success: false, error_message: message }
  }

  try {
    const response = await axios.post(
      ZERNIO_POSTS_URL,
      {
        content: text,
        publishNow: true,
        ...(imageUrl
          ? { mediaItems: [{ url: imageUrl, type: 'image' }] }
          : {}),
        platforms: [{ platform, accountId }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: TIMEOUT_MS[platform],
      }
    )

    // Zernio returns a post object keyed by `_id`. A public URL isn't a
    // documented field, so only pass it through if present.
    const platformPostId: string | undefined =
      response.data?._id || response.data?.id
    const postUrl: string | undefined = response.data?.url || undefined

    await logToSupabase(postId, displayName, true, platformPostId, undefined)
    return { success: true, platform_post_id: platformPostId, post_url: postUrl }
  } catch (err: unknown) {
    // A timeout means we stopped waiting, NOT that the publish failed — Zernio
    // may still have posted it. Say so in the message so nobody re-runs the post
    // and double-posts; check the account before republishing.
    const timedOut = axios.isAxiosError(err) && err.code === 'ECONNABORTED'
    const message = timedOut
      ? `${err.message} — Zernio may still have published this; check the ${displayName} account before republishing`
      : axios.isAxiosError(err)
      ? err.response?.data?.message ||
        err.response?.data?.error ||
        err.message
      : String(err)
    console.error(`[Zernio:${displayName}] Publish failed:`, message)
    await logToSupabase(postId, displayName, false, undefined, message)
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
    console.error(`[Zernio:${platform}] Failed to log to Supabase:`, err)
  }
}
