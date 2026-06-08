// Generate short article hero clips with Veo 3 Fast on Vertex AI, reusing the
// project's existing BLOG_GOOGLE_* JWT credentials (same GCP trial project as the
// blog image generator). Veo is a long-running operation: we submit a job, then
// poll :fetchPredictOperation until it's done, and read back base64 MP4 bytes.
//
// Cost note: Veo 3 Fast bills per second of output. Each clip here is 8s, and the
// orchestrator requests 3 clips per article (~$4-5/article at time of writing).
// The whole feature is env-gated — see isVeoEnabled().

import { JWT } from 'google-auth-library'

// Veo 3.1 Fast. Caps at 8s per clip; supports native audio generation.
const MODEL = 'veo-3.1-fast-generate-001'

// Veo is only available in a subset of regions; us-central1 is the safe default
// and matches BLOG_VERTEX_LOCATION used by the image generator.
function getLocation(): string {
  return process.env.BLOG_VEO_LOCATION || process.env.BLOG_VERTEX_LOCATION || 'us-central1'
}

function getProjectId(): string | undefined {
  return process.env.BLOG_VEO_PROJECT_ID || process.env.BLOG_VERTEX_PROJECT_ID
}

export function isVeoEnabled(): boolean {
  return Boolean(
    process.env.BLOG_VEO_ENABLED === 'true' &&
      getProjectId() &&
      process.env.BLOG_GOOGLE_CLIENT_EMAIL &&
      process.env.BLOG_GOOGLE_PRIVATE_KEY
  )
}

function getAuthClient() {
  return new JWT({
    email: process.env.BLOG_GOOGLE_CLIENT_EMAIL!,
    key: (process.env.BLOG_GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })
}

function baseUrlFor(): string {
  const projectId = getProjectId()
  if (!projectId) throw new Error('Veo project id not configured')
  const location = getLocation()
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${MODEL}`
}

async function getToken(): Promise<string> {
  const auth = getAuthClient()
  const { token } = await auth.getAccessToken()
  if (!token) throw new Error('Failed to obtain Vertex access token')
  return token
}

interface VeoOperation {
  name: string
  done?: boolean
  error?: { code?: number; message?: string }
  response?: {
    videos?: Array<{ bytesBase64Encoded?: string; gcsUri?: string; mimeType?: string }>
  }
}

// Submit one Veo generation job and return its long-running operation name.
// Exported for the tick-based cron: this returns in seconds (just enqueues the
// job), so it's safe inside Vercel Hobby's 60s function limit.
export async function submitVeoClip(prompt: string): Promise<string> {
  const token = await getToken()
  return submitClip(prompt, token, baseUrlFor())
}

// Poll one operation ONCE (no waiting loop). Returns the MP4 Buffer if the op is
// done, or null if still running. Throws if the op errored. Safe within 60s.
export async function pollVeoClip(operationName: string): Promise<Buffer | null> {
  const token = await getToken()
  const res = await fetch(`${baseUrlFor()}:fetchPredictOperation`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName }),
  })
  if (!res.ok) {
    throw new Error(`Veo fetchPredictOperation ${res.status}: ${(await res.text()).slice(0, 500)}`)
  }
  const op = (await res.json()) as VeoOperation
  if (op.error) throw new Error(`Veo operation failed: ${op.error.message || op.error.code}`)
  if (!op.done) return null
  const b64 = op.response?.videos?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('Veo operation done but no bytesBase64Encoded in response')
  return Buffer.from(b64, 'base64')
}

// Submit one Veo generation job and return its long-running operation name.
async function submitClip(prompt: string, token: string, baseUrl: string): Promise<string> {
  const res = await fetch(`${baseUrl}:predictLongRunning`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        aspectRatio: '16:9',
        sampleCount: 1,
        durationSeconds: 8,
        resolution: '720p',
        generateAudio: true,
        personGeneration: 'allow_adult',
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Veo predictLongRunning ${res.status}: ${(await res.text()).slice(0, 500)}`)
  }
  const data = (await res.json()) as { name?: string }
  if (!data.name) throw new Error('Veo predictLongRunning returned no operation name')
  return data.name
}

