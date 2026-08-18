import { generateContent } from '@/lib/claude'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ResearchFindings } from '@/lib/research'

export interface PostPlan {
  platform: 'Twitter' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok'
  content_type: 'photo_post' | 'article' | 'video_script' | 'thread'
  topic: string
  pillar: string
  scheduled_day: string
  hashtag_focus: string[]
  brief: string
}

export interface ContentPlan {
  weekly_theme: string
  ai_confidence_score: number
  competitor_gap: string
  trending_opportunity: string
  posts: PostPlan[]
}

// ── Pull last 5 cycle feedback from Supabase ─────────────────────────────────
async function getRecentCycleFeedback(): Promise<string> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return 'No previous cycle data available.'

    const { data } = await supabase
      .from('cycles')
      .select('weekly_theme, ai_confidence_score, posts_generated, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (!data || data.length === 0) return 'No previous cycle data available — this is the first cycle.'

    return data
      .map(
        (c, i) =>
          `Cycle ${i + 1}: Theme="${c.weekly_theme}", Confidence=${c.ai_confidence_score}, Posts=${c.posts_generated}, Status=${c.status}`
      )
      .join('\n')
  } catch {
    return 'Could not retrieve previous cycle data.'
  }
}

// ── Parse JSON safely from Claude's response ──────────────────────────────────
function extractJSON(raw: string): ContentPlan {
  // Strip markdown fences if present
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  // Find the JSON object
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object found in strategy response')

  return JSON.parse(cleaned.slice(start, end + 1))
}

// ── Main strategy engine ──────────────────────────────────────────────────────
export async function runStrategy(research: ResearchFindings): Promise<ContentPlan> {
  console.log('[Strategy] Generating content plan...')

  const feedback = await getRecentCycleFeedback()

  const prompt = `You are the marketing strategy engine for Agrikima, an organic animal health company in East Africa.

AGRIKIMA BRAND CONTEXT:
- Company: Agrikima — organic animal health solutions and crop management
- Tagline: Making Growth Happen
- Markets: Kenya, Uganda, Rwanda, Tanzania
- Key products: Advice (viral protection), Biogar (gut health), Agritonic, Agrivitam
- Mission: Natural alternatives to antibiotics, reducing AMR, sustainable farming
- Audience: Smallholder and commercial farmers, distributors, agri-vets, NGOs
- Tone: Knowledgeable, farmer-first, practical, Africa-rooted

RESEARCH FINDINGS:
Competitor Activity & Gaps:
${research.competitors[0]?.recentActivity || 'N/A'}

Industry News:
${research.industryNews}

Agrikima Social Audit:
${research.agrikimaSocialAudit}

Hashtag Intelligence:
${JSON.stringify(research.trendingHashtags)}

PREVIOUS CYCLE FEEDBACK (last 5 cycles):
${feedback}

YOUR TASK:
Based on all the above, produce a weekly content plan for Agrikima.

Requirements:
- Identify the single biggest content gap competitors are missing that Agrikima can own
- Choose a weekly theme aligned to current market signals and Agrikima's brand
- Plan 8-10 posts across Twitter, Facebook, Instagram, LinkedIn (skip TikTok for now)
- Mix content types: photo_post and thread ONLY. Do NOT use the "article" or "carousel" content types on any platform — carousels are retired because every post carries a single image, not a slideshow.
- Assign each post to a specific day (Monday through Sunday)
- Choose platform-appropriate hashtags
- Set a confidence score between 0 and 1 for this strategy

Return ONLY valid JSON in this exact format, no other text:
{
  "weekly_theme": "string",
  "ai_confidence_score": 0.0,
  "competitor_gap": "string — what gap are we filling",
  "trending_opportunity": "string — what trend are we capitalising on",
  "posts": [
    {
      "platform": "LinkedIn",
      "content_type": "photo_post",
      "topic": "string",
      "pillar": "string — Education / Product / Community / News / Brand",
      "scheduled_day": "Monday",
      "hashtag_focus": ["#tag1", "#tag2", "#tag3"],
      "brief": "string — 2-3 sentences describing what this post should say and why"
    }
  ]
}`

  const raw = await generateContent(prompt, 4096)

  try {
    const plan = extractJSON(raw)
    console.log(`[Strategy] Plan generated — Theme: "${plan.weekly_theme}", Posts: ${plan.posts.length}, Confidence: ${plan.ai_confidence_score}`)
    return plan
  } catch (err) {
    console.error('[Strategy] Failed to parse JSON:', raw)
    throw new Error(`Strategy engine returned invalid JSON: ${err}`)
  }
}
