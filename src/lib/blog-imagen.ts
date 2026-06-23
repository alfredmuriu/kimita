// Generate a blog featured image via Vertex AI Gemini 2.5 Flash Image
// (a.k.a. "Nano Banana"), using the project's $300 free-trial credentials
// on a SEPARATE GCP project from the marketing agent's Vertex setup.
//
// Returns a PNG Buffer ready for the cron's existing Supabase Storage upload.
// Falls back to the Pollinations-based generator on any failure so a single bad
// trial-credit day (or day 91, when credits expire) never breaks the blog cron.

import { JWT } from 'google-auth-library'
import { generateBlogImageGemini } from './gemini'

// "Nano Banana" — the multimodal generation model. Uses :generateContent, NOT
// the :predict endpoint that Imagen 3 uses. Cheaper per image and noticeably
// better at photoreal farm scenes for our use case.
const MODEL = 'gemini-2.5-flash-image'

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
  const isAMR = cat === 'amr' || cat === 'antimicrobial resistance'

  if (isFeedMilling) {
    return `Photorealistic photograph of a feed mill relevant to: "${topic}". Show feed milling equipment and scenes — hammer mills, pellet mills, mixers, conditioners, ingredient silos, bagged feed, or raw materials (maize, soya, sunflower meal). Real industrial feed mill environment. No humans, no text, no watermarks, no logos. Widescreen 16:9.`
  }

  if (isAMR) {
    return `Photorealistic photograph illustrating antimicrobial resistance in livestock relevant to: "${topic}". Show a close-up of a gloved hand holding a labeled antibiotic vial and syringe beside healthy farm animals (chickens, cattle, or goats) in a clean farm or veterinary setting. Convey responsible antibiotic stewardship. No human faces, no readable text, no watermarks, no logos. Widescreen 16:9.`
  }

  return `Photorealistic photograph for a farming article titled: "${topic}". First identify which farm animal species the title is about (e.g. poultry/chickens, layers, broilers, dairy cattle, beef cattle, goats, sheep, pigs, fish). That species MUST be the clear, dominant subject of the photo, shown in a natural farm setting. Ignore equipment or abstract words in the title (feeder, waterer, nutrition, vaccination, etc.) when choosing the animal — they describe the topic, not the subject. Do NOT show any other species. No humans, no text, no watermarks, no logos. Widescreen 16:9.`
}

// Google AI Studio (Gemini API) path — same "Nano Banana" model, but auth is a
// single API key (GOOGLE_AI_STUDIO_API_KEY) instead of a service account. This
// is the simplest setup and the preferred path once billing is enabled on the
// key's GCP project. Falls back to Pollinations on any failure.
export async function generateBlogImageAIStudio(
  topic: string,
  category?: string | null
): Promise<Buffer> {
  // Accept either name — GOOGLE_AI_API_KEY is the original var this project used
  // for the Gemini API; GOOGLE_AI_STUDIO_API_KEY was added later for the same key.
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_AI_API_KEY

  if (!apiKey) {
    console.warn('[BlogImagen] No AI Studio key (GOOGLE_AI_STUDIO_API_KEY / GOOGLE_AI_API_KEY) — falling back to Pollinations')
    return generateBlogImageGemini(topic, category)
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildBlogImagePrompt(topic, category) }],
          },
        ],
        generationConfig: {
          // Must include TEXT — the image generateContent endpoint rejects an
          // image-only modality list (400), which would silently fall back to
          // Pollinations. We pick the image part out of the response below.
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`AI Studio Gemini Image ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const parts: Array<{ inlineData?: { data?: string; mimeType?: string } }> =
      data?.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p) => p?.inlineData?.data)
    const base64Image = imagePart?.inlineData?.data
    if (!base64Image) {
      throw new Error('AI Studio Gemini Image returned no inlineData; response: ' + JSON.stringify(data).slice(0, 500))
    }

    return Buffer.from(base64Image, 'base64')
  } catch (err) {
    console.error('[BlogImagen] AI Studio Gemini Image failed, falling back to Pollinations:', err)
    return generateBlogImageGemini(topic, category)
  }
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

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${MODEL}:generateContent`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildBlogImagePrompt(topic, category) }],
          },
        ],
        generationConfig: {
          // Must include TEXT — the image generateContent endpoint rejects an
          // image-only modality list (400), which would silently fall back to
          // Pollinations. We pick the image part out of the response below.
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Vertex Gemini Image ${res.status}: ${errText}`)
    }

    const data = await res.json()
    // The base64 image lives at candidates[0].content.parts[*].inlineData.data —
    // there may be multiple parts (e.g. a text part + an image part); pick the
    // first one that actually contains image bytes.
    const parts: Array<{ inlineData?: { data?: string; mimeType?: string } }> =
      data?.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find((p) => p?.inlineData?.data)
    const base64Image = imagePart?.inlineData?.data
    if (!base64Image) {
      throw new Error('Vertex Gemini Image returned no inlineData; response: ' + JSON.stringify(data).slice(0, 500))
    }

    return Buffer.from(base64Image, 'base64')
  } catch (err) {
    console.error('[BlogImagen] Vertex Gemini Image failed, falling back to Pollinations:', err)
    return generateBlogImageGemini(topic, category)
  }
}
