// Instagram publisher — routed through Zernio (see zernio.ts). We previously
// called the Meta Graph API directly (two-step container + publish), but Zernio
// now handles that OAuth for us under its free tier. Account ID comes from
// ZERNIO_INSTAGRAM_ACCOUNT_ID. Instagram requires an image.

import { publishViaZernio, type PublishResult } from './zernio'

export type { PublishResult }

export async function publishToInstagram(
  postId: string,
  caption: string,
  imageUrl?: string
): Promise<PublishResult> {
  return publishViaZernio(
    postId,
    caption,
    'instagram',
    process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID,
    'Instagram',
    imageUrl
  )
}
