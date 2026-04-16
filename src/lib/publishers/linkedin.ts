import axios from 'axios'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
}

export async function publishToLinkedIn(
  postId: string,
  text: string
): Promise<PublishResult> {
  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!

    // Get the organisation URN first
    const orgResponse = await axios.get(
      'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(id,localizedName)))',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    )

    const orgId = orgResponse.data.elements?.[0]?.['organization~']?.id
    if (!orgId) throw new Error('Could not retrieve LinkedIn organisation ID')

    const authorUrn = `urn:li:organization:${orgId}`

    // Post the content
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    )

    const urn = response.data.id
    const result: PublishResult = {
      success: true,
      platform_post_id: urn,
      post_url: `https://linkedin.com/feed/update/${urn}`,
    }

    await logToSupabase(postId, 'LinkedIn', true, urn, undefined)
    return result
  } catch (err: unknown) {
    const message =
      axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : String(err)
    console.error('[LinkedIn] Publish failed:', message)
    await logToSupabase(postId, 'LinkedIn', false, undefined, message)
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
    console.error('[LinkedIn] Failed to log to Supabase:', err)
  }
}
