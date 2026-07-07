import { JWT } from 'google-auth-library'
import { getSupabaseAdmin } from './supabase'
import { compressToWebp } from './image-compress'

const BUCKET = 'marketing-media'
const MODEL = 'imagen-3.0-generate-001'

function getAuthClient() {
  return new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL!,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
}

// Generate the raw image bytes from Vertex Imagen without uploading. Returns the
// PNG buffer so callers can post-process (e.g. compose a branded poster) before
// upload. Returns null if credentials are missing or the API fails.
export async function generateImageBuffer(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '4:5' = '1:1'
): Promise<Buffer | null> {
  const projectId = process.env.VERTEX_PROJECT_ID
  const location = process.env.VERTEX_LOCATION || 'us-central1'

  if (!projectId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.warn('[Imagen] Vertex AI credentials not configured — skipping image generation')
    return null
  }

  try {
    const auth = getAuthClient()
    const { token } = await auth.getAccessToken()
    if (!token) throw new Error('Failed to obtain access token')

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${MODEL}:predict`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          safetyFilterLevel: 'block_some',
          personGeneration: 'allow_adult',
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Imagen] API error:', errText)
      return null
    }

    const data = await res.json()
    const base64Image: string | undefined = data.predictions?.[0]?.bytesBase64Encoded
    if (!base64Image) {
      console.error('[Imagen] No image returned in response')
      return null
    }
    return Buffer.from(base64Image, 'base64')
  } catch (err) {
    console.error('[Imagen] Error:', err)
    return null
  }
}

// Upload an image buffer to the marketing-media bucket, compressing to WebP to
// keep Supabase Cached Egress low. Pass a `preEncoded` format for buffers that
// are already in a final format (e.g. a JPEG poster) to skip the re-encode — use
// this for images published to social platforms, which reject WebP.
export async function uploadImageBuffer(
  input: Buffer,
  preEncoded?: { contentType: string; ext: string }
): Promise<string | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { buffer, contentType, ext } = preEncoded
    ? { buffer: input, contentType: preEncoded.contentType, ext: preEncoded.ext }
    : await compressToWebp(input)
  const fileName = `ai_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType, upsert: false })

  if (uploadError) {
    console.error('[Imagen] Storage upload error:', uploadError.message)
    return null
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
  console.log('[Imagen] Image uploaded:', urlData.publicUrl)
  return urlData.publicUrl
}

// Generate an image and upload it (compressed) — returns the public URL.
export async function generateImage(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '4:5' = '1:1'
): Promise<string | null> {
  const buffer = await generateImageBuffer(prompt, aspectRatio)
  if (!buffer) return null
  return uploadImageBuffer(buffer)
}

// ── Build a detailed, brand-aligned image prompt ──────────────────────────────
export function buildImagePrompt(
  topic: string,
  platform: string,
  contentType: string,
  pillar?: string
): string {
  const platformContext =
    platform === 'LinkedIn'
      ? 'professional, clean composition suitable for LinkedIn'
      : platform === 'Twitter'
      ? 'eye-catching, bold visual suitable for Twitter'
      : 'vibrant, engaging photo suitable for Instagram and Facebook'

  const pillars: Record<string, string> = {
    Education: 'educational infographic style, clear and informative',
    Product: 'product showcase, clean background, professional lighting',
    Community: 'community of farmers, warm and welcoming atmosphere',
    News: 'journalistic style, documentary feel',
    Brand: 'brand lifestyle, aspirational and professional',
  }

  const pillarStyle = pillar && pillars[pillar] ? pillars[pillar] : 'professional agricultural photography'

  const carouselNote = contentType === 'carousel' ? 'clean minimal layout with space for text overlay, ' : ''

  return [
    `${topic},`,
    'East African farming context, Kenya countryside,',
    'healthy livestock or lush green crops,',
    carouselNote,
    pillarStyle + ',',
    platformContext + ',',
    'golden hour natural lighting, vibrant colors,',
    'main subject in the upper two-thirds, uncluttered simpler foreground in the lower third for a text overlay,',
    'photorealistic, high quality, 8k resolution,',
    'no text or watermarks',
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Aspect ratio per platform ─────────────────────────────────────────────────
export function getAspectRatio(platform: string): '1:1' | '16:9' | '4:5' {
  if (platform === 'Instagram') return '4:5'
  if (platform === 'LinkedIn' || platform === 'Twitter' || platform === 'Facebook') return '16:9'
  return '1:1'
}
