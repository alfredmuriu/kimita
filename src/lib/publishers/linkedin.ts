// LinkedIn publisher — routed through Zernio (see zernio.ts). We previously
// called the LinkedIn Marketing API directly, but Zernio now handles that OAuth
// for us under its free tier. Account ID comes from ZERNIO_LINKEDIN_ACCOUNT_ID.

import { publishViaZernio, type PublishResult } from './zernio'

export type { PublishResult }

export async function publishToLinkedIn(
  postId: string,
  text: string,
  imageUrl?: string
): Promise<PublishResult> {
  return publishViaZernio(
    postId,
    text,
    'linkedin',
    process.env.ZERNIO_LINKEDIN_ACCOUNT_ID,
    'LinkedIn',
    imageUrl
  )
}
