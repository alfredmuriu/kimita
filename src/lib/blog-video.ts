// Per-step helpers for the article hero video pipeline. The work is driven by a
// tick-based cron (src/app/api/cron/generate-video/route.ts) so each step stays
// well under Vercel Hobby's 60s function limit — Veo itself takes minutes, so we
// never block on it; we submit, then poll one op at a time across cron ticks.
//
// Pipeline: submit N Veo clips → poll each (download bytes) → upload to
// Cloudinary → generate TTS → build a spliced MP4 URL. The whole feature is gated
// behind isVideoEnabled() (Veo enabled AND Cloudinary creds present).

import { v2 as cloudinary } from 'cloudinary'
import { isVeoEnabled } from './blog-veo'
import { generateVoiceover } from './blog-tts'

export const CLIP_COUNT = Math.min(4, Math.max(1, parseInt(process.env.BLOG_VEO_CLIPS || '3', 10)))

function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
}

export function isVideoEnabled(): boolean {
  return isVeoEnabled() && cloudinaryConfigured()
}

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

const FOLDER = 'blog-videos'

// Build distinct, cinematic prompts for each clip so the stitched video has
// visual progression rather than three near-identical shots. Mirrors the
// species-first logic of the blog image prompt so the video stays on-topic.
export function buildClipPrompts(topic: string, category?: string | null): string[] {
  const cat = (category || '').toLowerCase()
  const isFeedMilling = cat === 'feed milling' || cat === 'feed manufacturing'
  const isAMR = cat === 'amr' || cat === 'antimicrobial resistance'

  const subject = isFeedMilling
    ? `a real industrial feed mill (hammer mills, pellet mills, mixers, ingredient silos, bagged feed)`
    : isAMR
      ? `responsible antibiotic use in livestock — a clean farm or veterinary setting with healthy chickens, cattle or goats`
      : `the specific farm animal species the title "${topic}" is about (poultry, layers, broilers, dairy or beef cattle, goats, sheep, pigs or fish), as the clear dominant subject in a natural farm setting`

  const common = `Photorealistic, documentary style, natural daylight, slow smooth camera movement. Subject: ${subject}. No on-screen text, no watermarks, no logos, no human faces. 16:9.`

  const shots = [
    `Establishing wide aerial-style shot. ${common}`,
    `Mid shot with a slow dolly-in, shallow depth of field. ${common}`,
    `Close-up detail shot with gentle parallax. ${common}`,
    `Golden-hour pull-back reveal. ${common}`,
  ]
  return shots.slice(0, CLIP_COUNT).map((s) => `${s} Topic context: "${topic}".`)
}

async function uploadBuffer(buffer: Buffer, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: FOLDER, public_id: publicId, overwrite: true },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Cloudinary upload returned no result'))
        resolve(result.public_id)
      }
    )
    stream.end(buffer)
  })
}

// Upload one finished Veo clip (MP4 bytes) to Cloudinary, return its public_id.
export async function uploadClip(buffer: Buffer, slug: string, index: number): Promise<string> {
  configureCloudinary()
  return uploadBuffer(buffer, `${slug}-clip-${index}-${Date.now()}`)
}

// Generate + upload the TTS voiceover. Returns the Cloudinary public_id, or null
// if narration couldn't be produced (we keep Veo's native audio in that case).
export async function uploadVoiceover(
  topic: string,
  excerpt: string | null,
  slug: string
): Promise<string | null> {
  const voiceover = await generateVoiceover(topic, excerpt)
  if (!voiceover) return null
  configureCloudinary()
  // Cloudinary stores audio under the "video" resource type.
  return uploadBuffer(voiceover, `${slug}-vo-${Date.now()}`)
}

// Splice clips 2..N onto clip 1 and overlay the voiceover audio. Cloudinary
// concatenation = each extra clip as a video overlay with flags splice+layer_apply.
// Audio (uploaded as a "video" resource) is overlaid the same way; it plays
// alongside the base clips' own Veo-generated audio.
function buildTransformation(
  clipPublicIds: string[],
  audioPublicId: string | null
): Array<Record<string, unknown>> {
  const [, ...rest] = clipPublicIds
  const tx: Array<Record<string, unknown>> = []

  for (const id of rest) {
    // public_id segments are separated by ':' in overlay refs; '/' becomes ':'.
    const ref = id.replace(/\//g, ':')
    tx.push({ overlay: `video:${ref}`, flags: 'splice' })
    tx.push({ flags: 'layer_apply' })
  }

  if (audioPublicId) {
    const ref = audioPublicId.replace(/\//g, ':')
    tx.push({ overlay: `video:${ref}` })
    tx.push({ flags: 'layer_apply' })
  }

  tx.push({ width: 1280, height: 720, crop: 'fill', quality: 'auto', format: 'mp4' })
  return tx
}

// Build the delivered MP4 URL from already-uploaded clip + audio public_ids, and
// warm Cloudinary's render so the first visitor doesn't hit a cold transform.
export async function buildVideoUrl(
  clipPublicIds: string[],
  audioPublicId: string | null
): Promise<string> {
  configureCloudinary()
  const transformation = buildTransformation(clipPublicIds, audioPublicId)
  const url = cloudinary.url(clipPublicIds[0], {
    resource_type: 'video',
    transformation,
    format: 'mp4',
    secure: true,
  })
  try {
    await fetch(url, { method: 'GET' })
  } catch {
    /* eager-render warm-up is best-effort */
  }
  return url
}
