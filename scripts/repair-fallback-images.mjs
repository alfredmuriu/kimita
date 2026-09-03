// One-off repair: regenerate featured images for posts stuck on the Unsplash
// default (chicken) fallback, mirroring the cron's generate/compress/upload path.
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_AI_API_KEY
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function buildPrompt(topic) {
  return `Photorealistic photograph for a farming article titled: "${topic}". First identify which farm animal species the title is about (e.g. poultry/chickens, layers, broilers, dairy cattle, beef cattle, goats, sheep, pigs, fish). That species MUST be the clear, dominant subject of the photo, shown in a natural farm setting. Ignore equipment or abstract words in the title (feeder, waterer, nutrition, vaccination, etc.) when choosing the animal — they describe the topic, not the subject. Do NOT show any other species. No humans, no text, no watermarks, no logos. Widescreen 16:9.`
}

async function generate(topic) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildPrompt(topic) }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    )
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} (attempt ${attempt})`)
      await new Promise((r) => setTimeout(r, 2000 * attempt))
      continue
    }
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts ?? []
    const b64 = parts.find((p) => p?.inlineData?.data)?.inlineData?.data
    if (b64) return Buffer.from(b64, 'base64')
    console.warn(`  200 but no image (attempt ${attempt})`)
  }
  return null
}

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('id, slug, title, featured_image')
  .like('featured_image', '%unsplash.com%')
  .order('published_at', { ascending: false })

if (error) { console.error(error); process.exit(1) }
console.log(`${posts.length} posts on the Unsplash fallback\n`)

for (const post of posts) {
  console.log(`Repairing: ${post.title}`)
  const png = await generate(post.title)
  if (!png) { console.error('  generation failed after retries — skipped'); continue }

  const webp = await sharp(png)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer()

  const fileName = `${post.slug}-${Date.now()}.webp`
  const { error: upErr } = await supabase.storage
    .from('blog-images')
    .upload(fileName, webp, { contentType: 'image/webp', cacheControl: '31536000', upsert: false })
  if (upErr) { console.error('  upload failed:', upErr.message); continue }

  const { data: pub } = supabase.storage.from('blog-images').getPublicUrl(fileName)
  const { error: updErr } = await supabase
    .from('blog_posts')
    .update({ featured_image: pub.publicUrl })
    .eq('id', post.id)
  if (updErr) { console.error('  db update failed:', updErr.message); continue }
  console.log(`  done -> ${pub.publicUrl}`)
}
