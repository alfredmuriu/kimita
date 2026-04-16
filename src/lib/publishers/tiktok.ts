// TikTok publisher — stub pending API approval from TikTok
// TikTok's Content Posting API requires prior approval.
// Once approved, implement video upload flow here.

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  post_url?: string
  error_message?: string
}

export async function publishToTikTok(
  postId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _text: string
): Promise<PublishResult> {
  console.warn(`[TikTok] Publisher not yet implemented (pending API approval) — skipping post ${postId}`)
  return {
    success: false,
    error_message: 'TikTok publisher pending API approval — skipped',
  }
}
