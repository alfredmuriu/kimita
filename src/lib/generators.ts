import { generateContent } from '@/lib/claude'
import { PostPlan } from '@/lib/strategy'
import { generateImage, buildImagePrompt, getAspectRatio } from '@/lib/imagen'

export interface GeneratedPost {
  platform: string
  content_type: string
  copy: {
    main_text: string
    headline?: string
    hashtags: string[]
  }
  image_url?: string
  status: 'pending'
  cycle_id?: number
}

// Content types that should have an image generated
const VISUAL_TYPES = ['photo_post', 'carousel', 'article']

const BRAND_VOICE = `
Brand voice guidelines:
- Knowledgeable but accessible — speak like a trusted farm advisor, not a corporate brand
- Farmer-first — always lead with the farmer's benefit or challenge
- Africa-rooted — reference East African context, local realities, Kenyan farms
- Never use jargon without explanation
- End with a clear call to action or question to drive engagement
- Company: Agrikima | Tagline: Making Growth Happen
- Key products: Advice (viral protection), Biogar (gut health), Agritonic, Agrivitam
`

// ── Photo Post ────────────────────────────────────────────────────────────────
async function generatePhotoPost(post: PostPlan): Promise<GeneratedPost> {
  const platformGuidelines: Record<string, string> = {
    Twitter: 'Max 280 characters. Punchy, direct. 2-3 hashtags only.',
    Facebook: 'Warm and conversational. 100-250 words. Community-focused. 3-5 hashtags.',
    Instagram: 'Visual-first caption. 150-300 words. 15-20 hashtags. Start with a hook.',
    LinkedIn: 'Professional and insightful. 150-300 words. Thought leadership angle. 5-8 hashtags.',
  }

  const prompt = `Write a photo post caption for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}
Hashtags to include: ${post.hashtag_focus.join(', ')}

Platform guidelines: ${platformGuidelines[post.platform] || ''}
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "the full caption",
  "headline": "short punchy headline (for LinkedIn/Facebook only, else empty string)",
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
  const prompt = `Write a long-form article post for ${post.platform}.

Topic: ${post.topic}
Content pillar: ${post.pillar}
Brief: ${post.brief}
Hashtags to include: ${post.hashtag_focus.join(', ')}

Guidelines:
- 400-600 words (LinkedIn/Facebook article format)
- Bold opening hook that stops the scroll
- 3-5 clear sections with subheadings
- Practical, actionable advice for East African farmers
- Strong CTA at the end
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "the full article text",
  "headline": "compelling article headline",
  "hashtags": ["#tag1", "#tag2"]
}`

  const raw = await generateContent(prompt, 2048)
  const parsed = safeParseJSON(raw)

  return {
    platform: post.platform,
    content_type: 'article',
    copy: parsed,
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

Guidelines:
- 6-10 slides
- Slide 1: Bold hook/title that makes people want to swipe
- Slides 2-9: One clear point per slide, short headline + 1-2 sentence body
- Last slide: Strong CTA (follow, comment, share, contact)
- Each slide should work as a standalone insight
${BRAND_VOICE}

Return ONLY valid JSON, no other text:
{
  "main_text": "Slide 1: [title]\\nSlide 2: [headline] — [body]\\nSlide 3: [headline] — [body]\\n... (all slides)",
  "headline": "carousel series title",
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
function safeParseJSON(raw: string): { main_text: string; headline: string; hashtags: string[] } {
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

  // Generate image for visual content types
  if (VISUAL_TYPES.includes(post.content_type)) {
    console.log(`[Generator] Generating image for ${post.platform} — "${post.topic}"`)
    const imagePrompt = buildImagePrompt(post.topic, post.platform, post.content_type, post.pillar)
    const aspectRatio = getAspectRatio(post.platform)
    const imageUrl = await generateImage(imagePrompt, aspectRatio)
    if (imageUrl) {
      generated.image_url = imageUrl
      console.log(`[Generator] Image ready: ${imageUrl}`)
    }
  }

  if (cycleId) generated.cycle_id = cycleId
  return generated
}
