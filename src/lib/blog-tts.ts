// Synthesize a short spoken voiceover for an article using Google Cloud
// Text-to-Speech, reusing the same BLOG_GOOGLE_* JWT credentials as the blog
// image + Veo generators. Returns an MP3 Buffer (or null on any failure — the
// video pipeline treats narration as optional and proceeds with Veo's own audio).

import { JWT } from 'google-auth-library'

const ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize'

// A natural-sounding English neural voice. Overridable via env without code changes.
const VOICE_NAME = process.env.BLOG_TTS_VOICE || 'en-US-Neural2-F'
const LANGUAGE_CODE = process.env.BLOG_TTS_LANGUAGE || 'en-US'

function getAuthClient() {
  return new JWT({
    email: process.env.BLOG_GOOGLE_CLIENT_EMAIL!,
    key: (process.env.BLOG_GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
}

// Strip HTML and trim the narration text to a length that comfortably fits the
// ~24s of video we produce (3 x 8s clips). ~55 words ≈ 22s at a calm pace.
function buildNarration(title: string, excerpt: string | null): string {
  const clean = (excerpt || title)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = clean.split(' ').slice(0, 55).join(' ')
  return words
}

export async function generateVoiceover(
  title: string,
  excerpt: string | null
): Promise<Buffer | null> {
  if (!process.env.BLOG_GOOGLE_CLIENT_EMAIL || !process.env.BLOG_GOOGLE_PRIVATE_KEY) {
    return null
  }

  try {
    const auth = getAuthClient()
    const { token } = await auth.getAccessToken()
    if (!token) throw new Error('Failed to obtain TTS access token')

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: buildNarration(title, excerpt) },
        voice: { languageCode: LANGUAGE_CODE, name: VOICE_NAME },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
      }),
    })

    if (!res.ok) {
      throw new Error(`TTS synthesize ${res.status}: ${(await res.text()).slice(0, 300)}`)
    }

    const data = (await res.json()) as { audioContent?: string }
    if (!data.audioContent) throw new Error('TTS returned no audioContent')
    return Buffer.from(data.audioContent, 'base64')
  } catch (err) {
    console.error('[BlogTTS] voiceover generation failed (continuing without narration):', err)
    return null
  }
}
