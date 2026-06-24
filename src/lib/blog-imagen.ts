// Generate a blog featured image via Google AI Studio's Gemini 2.5 Flash Image
// (a.k.a. "Nano Banana"), authed with a single API key.
//
// Returns a PNG Buffer ready for the cron's existing Supabase Storage upload.
// Falls back to the Pollinations-based generator on any failure so a bad image
// day never breaks the blog cron.

import { generateBlogImageGemini } from './gemini'

// "Nano Banana" — the multimodal generation model, called via :generateContent.
const MODEL = 'gemini-2.5-flash-image'

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
    const body = JSON.stringify({
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
    })

    // Retry transient throttling (429) and server errors (5xx) with backoff
    // before giving up to Pollinations. A 429 can be per-minute rate limiting
    // (retry helps) OR a per-day quota / no-billing cap (retry won't help — the
    // fix there is enabling billing on the key's Google Cloud project).
    const MAX_ATTEMPTS = 3
    let res!: Response
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body,
      })
      if (res.ok) break
      const transient = res.status === 429 || res.status >= 500
      if (transient && attempt < MAX_ATTEMPTS) {
        const backoffMs = 2000 * attempt
        console.warn(`[BlogImagen] AI Studio ${res.status} (attempt ${attempt}/${MAX_ATTEMPTS}) — retrying in ${backoffMs}ms`)
        await new Promise((r) => setTimeout(r, backoffMs))
        continue
      }
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
