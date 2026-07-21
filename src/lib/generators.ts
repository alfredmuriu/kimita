import { generateContent } from '@/lib/claude'
import { PostPlan } from '@/lib/strategy'
import { generateImageBuffer, uploadImageBuffer, buildImagePrompt, buildProductPosterPrompt, getAspectRatio } from '@/lib/imagen'
import { generateImageAIStudio } from '@/lib/blog-imagen'
import { generateBlogImageGemini } from '@/lib/gemini'
import { composePoster } from '@/lib/poster'
import { findProductPoster } from '@/lib/product-posters'
import { getSupabaseAdmin } from '@/lib/supabase'

export interface GeneratedPost {
  platform: string
  content_type: string
  copy: {
    main_text: string
    headline?: string
    // Short poster copy for visual content types — a punchy headline (<=7 words)
    // and one supporting line — rendered onto the branded poster image.
    poster_headline?: string
    poster_subtitle?: string
    hashtags: string[]
  }
  image_url?: string
  status: 'pending'
  cycle_id?: number
}

// Content types that should have an image generated via Imagen.
// Articles intentionally excluded — they reuse the matching blog post's featured_image.
const VISUAL_TYPES = ['photo_post', 'carousel']

const SITE_URL = 'https://www.agrikima.co.ke'

// Curated hashtag bank — merged with LLM picks so every post has strong brand + reach tags.
// Mix: branded (anchor), niche (farmer intent), broad (reach), location (local discovery).
const BRAND_TAGS = ['#Agrikima', '#MakingGrowthHappen']
const LOCATION_TAGS = ['#KenyaFarmers', '#EastAfrica', '#FarmingKE']
const NICHE_TAGS = [
  '#LivestockHealth', '#PoultryFarming', '#DairyFarming', '#OrganicFarming',
  '#SustainableAgriculture', '#AnimalHealth', '#SmallholderFarmers',
  '#AgribusinessKE', '#FarmingTips', '#AgriTech',
]
const BROAD_TAGS = ['#Agriculture', '#Farming', '#FoodSecurity']

// Per-platform hashtag counts (FB/LI lighter, IG heavy, Twitter light).
const HASHTAG_BUDGET: Record<string, { total: number; brand: number; location: number; niche: number; broad: number }> = {
  Twitter:   { total: 3,  brand: 1, location: 1, niche: 1, broad: 0 },
  Facebook:  { total: 5,  brand: 1, location: 1, niche: 2, broad: 1 },
  Instagram: { total: 18, brand: 2, location: 2, niche: 10, broad: 4 },
  LinkedIn:  { total: 7,  brand: 1, location: 1, niche: 4, broad: 1 },
  TikTok:    { total: 6,  brand: 1, location: 1, niche: 3, broad: 1 },
}

function pickFromBank(bank: string[], count: number, exclude: Set<string>): string[] {
  const lower = new Set<string>()
  exclude.forEach((t) => lower.add(t.toLowerCase()))
  const picks: string[] = []
  for (const tag of bank) {
    if (picks.length >= count) break
    if (!lower.has(tag.toLowerCase())) {
      picks.push(tag)
      lower.add(tag.toLowerCase())
    }
  }
  return picks
}

// Merge LLM hashtags with curated bank to hit platform budget and ensure brand coverage.
function optimizeHashtags(platform: string, llmTags: string[]): string[] {
  const budget = HASHTAG_BUDGET[platform] || HASHTAG_BUDGET.Facebook
  const seen = new Set<string>()
  const normalized = (llmTags || [])
    .map((t) => (t.startsWith('#') ? t : `#${t}`))
    .map((t) => t.replace(/\s+/g, ''))
    .filter((t) => t.length > 1)
    .filter((t) => {
      const k = t.toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })

  const result: string[] = []
  result.push(...pickFromBank(BRAND_TAGS, budget.brand, new Set(result)))
  result.push(...pickFromBank(LOCATION_TAGS, budget.location, new Set(result)))
  // Use LLM picks before falling back to the niche/broad banks.
  for (const t of normalized) {
    if (result.length >= budget.total) break
    if (!result.some((r) => r.toLowerCase() === t.toLowerCase())) result.push(t)
  }
  const remaining = budget.total - result.length
  if (remaining > 0) {
    const nicheTake = Math.min(budget.niche, remaining)
    result.push(...pickFromBank(NICHE_TAGS, nicheTake, new Set(result)))
  }
  const stillRemaining = budget.total - result.length
  if (stillRemaining > 0) {
    result.push(...pickFromBank(BROAD_TAGS, stillRemaining, new Set(result)))
  }
  return result.slice(0, budget.total)
}

// Find the most relevant blog post for a topic — used so social article posts
// reuse the actual website article's featured image and link.
async function findBlogPostForTopic(topic: string): Promise<{ slug: string; featured_image: string | null } | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  // Pull a recent slice and score in JS — keeps the query simple and avoids
  // depending on full-text search being set up on blog_posts.
  const { data } = await supabase
    .from('blog_posts')
    .select('slug, title, keywords, featured_image, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(200)

  if (!data || data.length === 0) return null

  const topicLower = topic.toLowerCase()
  const topicWords: string[] = Array.from(
    new Set(topicLower.split(/[^a-z0-9]+/).filter((w) => w.length > 3))
  )

  let best: { slug: string; featured_image: string | null; score: number } | null = null
  for (const row of data) {
    const title = (row.title || '').toLowerCase()
    const keywords: string[] = Array.isArray(row.keywords) ? row.keywords : []
    let score = 0
    for (const w of topicWords) {
      if (title.includes(w)) score += 2
      if (keywords.some((k) => k.toLowerCase().includes(w))) score += 3
    }
    if (!best || score > best.score) {
      best = { slug: row.slug, featured_image: row.featured_image || null, score }
    }
  }

  // Require at least one keyword overlap; otherwise fall back to latest post.
  if (best && best.score > 0) return { slug: best.slug, featured_image: best.featured_image }
  const latest = data[0]
  return { slug: latest.slug, featured_image: latest.featured_image || null }
}

const BRAND_VOICE = `
Brand voice guidelines:
- Knowledgeable but accessible — speak like a trusted farm advisor, not a corporate brand
- Farmer-first — always lead with the farmer's benefit or challenge
- Africa-rooted — reference East African context, local realities, Kenyan farms
- Never use jargon without explanation
- End with a clear call to action or question to drive engagement
- Company: Agrikima | Tagline: Making Growth Happen
- Key products: Advice (viral protection), Biogar (gut health), Agritonic, Agrivitam

Engagement craft (apply to every post):
- Open with a scroll-stopper: a surprising stat, bold claim, vivid scene, or pointed question
- Use short lines and line breaks — never a wall of text
- Use 1-3 relevant emojis to add warmth and break up text (🌱🐄🐓🥚🌾💧📈) — never gimmicky
- Speak directly to "you" (the farmer)
- Close with a clear CTA: ask a question, invite a comment, or point to next step
`

// ── Photo Post ────────────────────────────────────────────────────────────────
async function generatePhotoPost(post: PostPlan): Promise<GeneratedPost> {
  const platformGuidelines: Record<string, string> = {
    Twitter: 'Max 270 characters (leave room for hashtags). Punchy, one sharp idea. Hook in first 7 words. 1 emoji max in body.',
    Facebook: 'Warm and conversational. 80-180 words. Short paragraphs (1-2 sentences each), blank lines between. Open with a question or scene. End with a question for the audience. 1-2 emojis sprinkled naturally.',
    Instagram: 'Visual-first caption. 120-220 words. First line must hook (it shows above the fold). Use line breaks every 1-2 sentences. 2-4 emojis. End with a clear CTA and a question.',
    LinkedIn: 'Professional and insightful. 120-220 words. Open with a contrarian or data-led hook. Short paragraphs. End with a question that invites comments. 1 emoji max.',
  }

  const prompt = `Write a photo post caption for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}
Hashtags to include: ${post.hashtag_focus.join(', ')}

Platform guidelines: ${platformGuidelines[post.platform] || ''}
${BRAND_VOICE}

This post gets a branded poster image. Also write short poster copy:
- "poster_headline": max 7 words, bold and benefit-driven — the single message the poster must land.
- "poster_subtitle": max 12 words, one supporting line.

Return ONLY valid JSON, no other text:
{
  "main_text": "the full caption",
  "headline": "short punchy headline (for LinkedIn/Facebook only, else empty string)",
  "poster_headline": "punchy poster headline (<=7 words)",
  "poster_subtitle": "one supporting line (<=12 words)",
  "hashtags": ["#tag1", "#tag2"]
}`

  const raw = await generateContent(prompt, 1024)
  const parsed = safeParseJSON(raw)

  return {
    platform: post.platform,
    content_type: 'photo_post',
    copy: parsed,
    status: 'pending',
  }
}

// ── Article ───────────────────────────────────────────────────────────────────
async function generateArticle(post: PostPlan): Promise<GeneratedPost> {
  // Find the matching website blog post so we can reuse its image + link.
  const blog = await findBlogPostForTopic(post.topic)
  const articleLink = blog ? `${SITE_URL}/agrikima-academy/${blog.slug}` : SITE_URL

  const prompt = `Write a long-form article post for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}
Hashtags to include: ${post.hashtag_focus.join(', ')}

Guidelines:
- 350-550 words (LinkedIn/Facebook article format)
- FIRST LINE must be a scroll-stopping hook (surprising stat, bold claim, or sharp question)
- 3-5 short sections with bold subheadings (use plain ALL CAPS or numbered headings, no markdown)
- Short paragraphs (1-3 sentences). Blank line between paragraphs.
- Practical, actionable advice for East African farmers
- 1-3 emojis used as section anchors or emphasis (never gimmicky)
- End with: a one-line summary + a question for the reader + this link on its own line: ${articleLink}
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "the full article text, with the link on the last line",
  "headline": "compelling article headline",
  "hashtags": ["#tag1", "#tag2"]
}`

  const raw = await generateContent(prompt, 2048)
  const parsed = safeParseJSON(raw)

  // Belt-and-braces: ensure the article link is present even if the LLM dropped it.
  if (!parsed.main_text.includes(articleLink)) {
    parsed.main_text = `${parsed.main_text.trim()}\n\nRead more: ${articleLink}`
  }

  return {
    platform: post.platform,
    content_type: 'article',
    copy: parsed,
    image_url: blog?.featured_image || undefined,
    status: 'pending',
  }
}

// ── Video Script ──────────────────────────────────────────────────────────────
async function generateVideoScript(post: PostPlan): Promise<GeneratedPost> {
  const prompt = `Write a short video script for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}

Guidelines:
- 30-60 seconds when read aloud (roughly 75-150 words)
- Hook in the FIRST 3 seconds — make it impossible to scroll past
- Clear scene descriptions in brackets e.g. [Show farmer checking chickens]
- Conversational voiceover text
- End with a strong CTA
- Trending, relatable language for East African farmers
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "full script with scene directions",
  "headline": "video title/hook line",
  "hashtags": ${JSON.stringify(post.hashtag_focus)}
}`

  const raw = await generateContent(prompt, 1024)
  const parsed = safeParseJSON(raw)

  return {
    platform: post.platform,
    content_type: 'video_script',
    copy: parsed,
    status: 'pending',
  }
}

// ── Carousel ──────────────────────────────────────────────────────────────────
async function generateCarousel(post: PostPlan): Promise<GeneratedPost> {
  const prompt = `Write a carousel post for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}
Hashtags: ${post.hashtag_focus.join(', ')}

The carousel is a branded poster image. Write:
- "main_text": the post CAPTION only — a visual-first caption of 120-220 words.
  First line must hook (it shows above the fold). Line breaks every 1-2 sentences.
  2-4 emojis. End with a clear CTA and a question. Do NOT list or number slides,
  and do NOT write "Slide 1", "Slide 2", etc. — this is the caption readers see,
  not a slide script.
- "poster_headline": max 7 words — the swipe-stopping cover message.
- "poster_subtitle": max 12 words, one supporting line.
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "the full caption (no slide numbering)",
  "headline": "carousel series title",
  "poster_headline": "cover poster headline (<=7 words)",
  "poster_subtitle": "one supporting line (<=12 words)",
  "hashtags": ["#tag1", "#tag2"]
}`

  const raw = await generateContent(prompt, 2048)
  const parsed = safeParseJSON(raw)

  return {
    platform: post.platform,
    content_type: 'carousel',
    copy: parsed,
    status: 'pending',
  }
}

// ── Thread ────────────────────────────────────────────────────────────────────
async function generateThread(post: PostPlan): Promise<GeneratedPost> {
  const prompt = `Write a Twitter/LinkedIn thread for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}
Hashtags: ${post.hashtag_focus.join(', ')}

Guidelines:
- 6-8 posts in the thread
- Tweet 1 (hook): Must stop the scroll — bold claim, surprising stat, or provocative question
- Tweets 2-7: Each tweet stands alone but connects to the next
- Tweet 8 (closer): Summary + CTA + hashtags
- Twitter: max 280 chars per tweet
- LinkedIn: max 700 chars per post in thread
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "1/ [hook tweet]\\n\\n2/ [tweet 2]\\n\\n3/ [tweet 3]\\n... (all tweets numbered)",
  "headline": "thread topic summary",
  "hashtags": ["#tag1", "#tag2"]
}`

  const raw = await generateContent(prompt, 2048)
  const parsed = safeParseJSON(raw)

  return {
    platform: post.platform,
    content_type: 'thread',
    copy: parsed,
    status: 'pending',
  }
}

// ── Safe JSON parser ──────────────────────────────────────────────────────────
function safeParseJSON(raw: string): { main_text: string; headline: string; poster_headline?: string; poster_subtitle?: string; hashtags: string[] } {
  try {
    let cleaned = raw.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      return JSON.parse(cleaned.slice(start, end + 1))
    }
  } catch {
    // fall through to default
  }

  // Fallback if JSON parsing fails
  return {
    main_text: raw,
    headline: '',
    hashtags: [],
  }
}

// ── Main generator — routes to the right generator by content type ─────────────
export async function generatePost(post: PostPlan, cycleId?: number): Promise<GeneratedPost> {
  console.log(`[Generator] Generating ${post.content_type} for ${post.platform} — "${post.topic}"`)

  let generated: GeneratedPost

  switch (post.content_type) {
    case 'photo_post':
      generated = await generatePhotoPost(post)
      break
    case 'article':
      generated = await generateArticle(post)
      break
    case 'video_script':
      generated = await generateVideoScript(post)
      break
    case 'carousel':
      generated = await generateCarousel(post)
      break
    case 'thread':
      generated = await generateThread(post)
      break
    default:
      generated = await generatePhotoPost(post)
  }

  // Generate image for visual content types (articles already pull the blog image).
  // Flow: generate the AI background photo, compose a branded Agrikima poster
  // (headline + subtitle + logo) over it, then upload. Falls back to the plain
  // photo if poster composition fails so a post always has an image.
  if (VISUAL_TYPES.includes(post.content_type) && !generated.image_url) {
    // If this post is about a product with a professionally designed poster,
    // attach that poster verbatim and skip AI generation entirely.
    const productText = [post.topic, post.brief, generated.copy.poster_headline].filter(Boolean).join(' ')
    const premade = findProductPoster(productText, post.pillar === 'Product', post.platform)
    if (premade) {
      generated.image_url = premade.url
      console.log(`[Generator] Using pre-made ${premade.slug} poster for ${post.platform} — ${premade.url}`)
    }
  }

  if (VISUAL_TYPES.includes(post.content_type) && !generated.image_url) {
    console.log(`[Generator] Generating poster for ${post.platform} — "${post.topic}"`)
    const aspectRatio = getAspectRatio(post.platform)
    // Product posts (without a pre-made poster) use a prompt that echoes the
    // branded Agrikima product posters; everything else uses the general prompt.
    const isProduct = post.pillar === 'Product'
    const imagePrompt = isProduct
      ? buildProductPosterPrompt(post.topic, post.platform, aspectRatio)
      : buildImagePrompt(post.topic, post.platform, post.content_type, post.pillar, aspectRatio)

    // Best-available background: Gemini 2.5 Flash Image (same billed key the blog
    // articles use) → Vertex Imagen 3 → Pollinations. Each is high quality except
    // Pollinations, which is a last resort so a post always gets an image.
    let photo = await generateImageAIStudio(imagePrompt)
    if (!photo) photo = await generateImageBuffer(imagePrompt, aspectRatio)
    if (!photo) photo = await generateBlogImageGemini(post.topic, post.pillar).catch(() => null)

    if (photo) {
      const headline = (generated.copy.poster_headline || generated.copy.headline || post.topic).trim()
      const subtitle = (generated.copy.poster_subtitle || '').trim() || undefined
      let imageUrl: string | null = null
      try {
        const poster = await composePoster({
          photo,
          headline,
          subtitle,
          eyebrow: post.pillar,
          platform: post.platform,
        })
        imageUrl = await uploadImageBuffer(poster, { contentType: 'image/jpeg', ext: 'jpg' }) // JPEG for platform compatibility
      } catch (err) {
        console.error('[Generator] Poster composition failed, using plain photo:', err)
        imageUrl = await uploadImageBuffer(photo) // compress + upload raw photo
      }
      if (imageUrl) {
        generated.image_url = imageUrl
        console.log(`[Generator] Poster ready: ${imageUrl}`)
      }
    }
  }

  // Optimize hashtags: merge LLM picks with curated brand/location/niche bank.
  generated.copy.hashtags = optimizeHashtags(generated.platform, generated.copy.hashtags || [])

  if (cycleId) generated.cycle_id = cycleId
  return generated
}
