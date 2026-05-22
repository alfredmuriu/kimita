// Generate a blog featured image via Vertex AI Imagen 3, using the project's
// $300 free-trial credentials (kept on a SEPARATE GCP project from the marketing
// agent's Vertex setup, so the trial credits don't leak into agent usage).
//
// Returns a PNG Buffer ready for the cron's existing Supabase Storage upload.
// Falls back to the Pollinations-based generator on any failure so a single bad
// trial-credit day (or day 91, when credits expire) never breaks the blog cron.

import { JWT } from 'google-auth-library'
import { generateBlogImageGemini } from './gemini'

const MODEL = 'imagen-3.0-generate-001'

function getAuthClient() {
  return new JWT({
    email: process.env.BLOG_GOOGLE_CLIENT_EMAIL!,
    key: (process.env.BLOG_GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
}

function buildBlogImagePrompt(topic: string, category?: string | null): string {
  const cat = (category || '').toLowerCase()
  const isFeedMilling = cat === 'feed milling' || cat === 'feed manufacturing'

  if (isFeedMilling) {
    return `Photorealistic natural photograph illustrating this feed milling topic: "${topic}". Real feed mill scene — hammer mill or roller mill grinding grain, pellet mill extruding feed, ribbon or paddle mixer in operation, conditioner with steam, bagged finished feed stacked on pallets, bulk ingredient silos, or raw materials (maize, soya cake, sunflower meal, fishmeal) on a receiving bay. Industrial feed manufacturing environment: stainless steel or painted steel equipment, conveyors, ducting, concrete floors, warehouse lighting. No humans, no operators in frame. Realistic textures of grain, pellets, mash, dust, and metal. Candid industrial photography — natural, unposed, authentic. Shot on a Canon EOS R5, 35mm f/1.8, shallow depth of field, golden hour or soft warehouse light, slight film grain. No text overlays, no watermarks, no logos.`
  }

  return `Photorealistic, documentary-style photograph related to the agricultural topic: "${topic}". Shot on a Canon EOS R5 with an 85mm f/1.4 lens, shallow depth of field. Show the relevant farm animal (chickens for poultry, dairy cows for dairy, pigs for swine, goats if mentioned) in a natural farm environment with real dirt, grass, and natural imperfections. Golden hour natural lighting, slight film grain, realistic skin, feather and fur textures. National Geographic documentary style — NOT illustration, NOT AI-looking, NOT overly clean. No humans in frame. No text overlays, no watermarks, no logos.`
}

export async function generateBlogImageVertex(
  topic: string,
  category?: string | null
): Promise<Buffer> {
  const projectId = process.env.BLOG_VERTEX_PROJECT_ID
  const location = process.env.BLOG_VERTEX_LOCATION || 'us-central1'
  const clientEmail = process.env.BLOG_GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.BLOG_GOOGLE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[BlogImagen] BLOG_VERTEX_* env vars not set — falling back to Pollinations')
    return generateBlogImageGemini(topic, category)
  }

  try {
    const auth = getAuthClient()
    const { token } = await auth.getAccessToken()
    if (!token) throw new Error('Failed to obtain Vertex access token')

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${MODEL}:predict`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: buildBlogImagePrompt(topic, category) }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '16:9',
          safetyFilterLevel: 'block_some',
          personGeneration: 'allow_adult',
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Vertex Imagen ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const base64Image: string | undefined = data.predictions?.[0]?.bytesBase64Encoded
    if (!base64Image) throw new Error('Vertex Imagen returned no image bytes')

    return Buffer.from(base64Image, 'base64')
  } catch (err) {
    console.error('[BlogImagen] Vertex failed, falling back to Pollinations:', err)
    return generateBlogImageGemini(topic, category)
  }
}
