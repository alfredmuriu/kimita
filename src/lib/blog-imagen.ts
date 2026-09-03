// Generate a blog featured image via Google AI Studio's Gemini 2.5 Flash Image
// (a.k.a. "Nano Banana"), authed with a single API key.
//
// Returns a PNG Buffer ready for the cron's existing Supabase Storage upload.
// On failure it returns null (no Pollinations fallback — those off-brand images
// were leaking onto posts). The caller uses its own DEFAULT_IMAGE instead.

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

// Low-level: generate an image from a raw prompt via Google AI Studio's Gemini
// 2.5 Flash Image (single API key). Returns the PNG Buffer, or null on failure
// so callers can pick their own fallback. Reused for both blog featured images
// (buildBlogImagePrompt) and marketing posters (imagen.ts buildImagePrompt).
export async function generateImageAIStudio(prompt: string): Promise<Buffer | null> {
  // Accept either name — GOOGLE_AI_API_KEY is the original var this project used
  // for the Gemini API; GOOGLE_AI_STUDIO_API_KEY was added later for the same key.
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    console.warn('[AIStudioImage] No key (GOOGLE_AI_STUDIO_API_KEY / GOOGLE_AI_API_KEY)')
    return null
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
    const body = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // Must include TEXT — the image generateContent endpoint rejects an
        // image-only modality list (400). We pick the image part out below.
        responseModalities: ['TEXT', 'IMAGE'],
      },
    })

    // Retry transient throttling (429), server errors (5xx), AND 200 responses
    // that carry no image part. The model regularly answers finishReason STOP
    // with only a text part ("here is the image...") and no inlineData — ~1 in 3
    // for kill/death-adjacent titles ("culling", "disposal of dead birds") — and
    // treating that as terminal is what put the default chicken photo on pig
    // articles. A 429 can also be a per-day quota / no-billing cap where retry
    // won't help — the fix there is billing on the key's project.
    const MAX_ATTEMPTS = 3
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body,
      })

      if (!res.ok) {
        const transient = res.status === 429 || res.status >= 500
        if (transient && attempt < MAX_ATTEMPTS) {
          const backoffMs = 2000 * attempt
          console.warn(`[AIStudioImage] ${res.status} (attempt ${attempt}/${MAX_ATTEMPTS}) — retrying in ${backoffMs}ms`)
          await new Promise((r) => setTimeout(r, backoffMs))
          continue
        }
        console.error(`[AIStudioImage] ${res.status}: ${(await res.text()).slice(0, 300)}`)
        return null
      }

      const data = await res.json()
      const parts: Array<{ inlineData?: { data?: string; mimeType?: string } }> =
        data?.candidates?.[0]?.content?.parts ?? []
      const base64Image = parts.find((p) => p?.inlineData?.data)?.inlineData?.data
      if (base64Image) return Buffer.from(base64Image, 'base64')

      if (attempt < MAX_ATTEMPTS) {
        console.warn(`[AIStudioImage] 200 but no inlineData (attempt ${attempt}/${MAX_ATTEMPTS}) — retrying`)
        continue
      }
      console.error('[AIStudioImage] no inlineData; response: ' + JSON.stringify(data).slice(0, 300))
    }
    return null
  } catch (err) {
    console.error('[AIStudioImage] failed:', err)
    return null
  }
}

// Google AI Studio (Gemini API) path for blog featured images — same "Nano
// Banana" model. Returns null on failure (no Pollinations fallback) so the
// caller can use its own default image instead of an off-brand generated one.
export async function generateBlogImageAIStudio(
  topic: string,
  category?: string | null
): Promise<Buffer | null> {
  const buf = await generateImageAIStudio(buildBlogImagePrompt(topic, category))
  if (buf) return buf
  console.warn('[BlogImagen] AI Studio Gemini Image failed — using default image')
  return null
}
