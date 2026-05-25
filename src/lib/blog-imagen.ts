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

  if (isFeedMilling) {
    return `Photorealistic photograph of a feed mill relevant to: "${topic}". Show feed milling equipment and scenes — hammer mills, pellet mills, mixers, conditioners, ingredient silos, bagged feed, or raw materials (maize, soya, sunflower meal). Real industrial feed mill environment. No humans, no text, no watermarks, no logos. Widescreen 16:9.`
  }

  return `Photorealistic photograph of the specific animal referenced in this topic: "${topic}". The animal is the clear subject, in a natural farm setting. No humans, no text, no watermarks, no logos. Widescreen 16:9.`
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
          // Tell the model we want an image back, not text.
          responseModalities: ['IMAGE'],
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
