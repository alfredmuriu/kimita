import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSupabaseAdmin } from '@/lib/supabase'
import { publishToTwitter } from '@/lib/publishers/twitter'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_PROMPT = `You are the Agrikima Marketing Agent — an AI assistant for the Agrikima marketing team.

Agrikima is an organic animal health company in East Africa (Kenya, Uganda, Rwanda, Tanzania).
Key products: Advice (viral protection), Biogar (gut health), Agritonic, Agrivitam.
Tagline: "Making Growth Happen". Audience: smallholder and commercial farmers, agri-vets, distributors.
Tone: knowledgeable, farmer-first, practical, Africa-rooted.

You help the team with:
- Writing and refining social media posts
- Answering questions about content strategy
- Reviewing post performance
- Suggesting hashtags, captions, and content ideas
- Publishing posts manually when asked

MANUAL PUBLISH DETECTION:
If the user asks you to post something to a specific platform, extract the content and respond with a JSON block in this exact format (in addition to your normal reply):

<publish>
{
  "platform": "Twitter",
  "content": "The post text here",
  "hashtags": ["#tag1", "#tag2"]
}
</publish>

Supported platforms: Twitter, Facebook, Instagram, LinkedIn.
For Instagram, remind the user that an image URL is required.`

// ── Save message to chat_history ─────────────────────────────────────────────
async function saveMessage(sessionId: string, role: string, content: string) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return
    await supabase.from('chat_history').insert({ session_id: sessionId, role, content })
  } catch (err) {
    console.error('[Chat] Failed to save message:', err)
  }
}

// ── Load recent chat history for session ─────────────────────────────────────
async function loadHistory(sessionId: string): Promise<Anthropic.MessageParam[]> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return []

    const { data } = await supabase
      .from('chat_history')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(40)

    return (data ?? []).map((row) => ({
      role: row.role as 'user' | 'assistant',
      content: row.content,
    }))
  } catch {
    return []
  }
}

// ── Detect and execute manual publish ────────────────────────────────────────
async function handlePublish(
  assistantReply: string,
  sessionId: string
): Promise<string | null> {
  const match = assistantReply.match(/<publish>([\s\S]*?)<\/publish>/)
  if (!match) return null

  let parsed: { platform: string; content: string; hashtags?: string[] }
  try {
    parsed = JSON.parse(match[1].trim())
  } catch {
    return 'Failed to parse publish instruction.'
  }

  const supabase = getSupabaseAdmin()
  const text = [parsed.content, (parsed.hashtags ?? []).join(' ')].filter(Boolean).join('\n\n')

  // Save to posts table
  let postId = 'manual'
  if (supabase) {
    const { data } = await supabase
      .from('posts')
      .insert({
        platform: parsed.platform,
        content_type: 'manual',
        content: parsed.content,
        hashtags: parsed.hashtags ?? [],
        status: 'pending',
      })
      .select('id')
      .single()

    if (data) postId = data.id
  }

  let result
  switch (parsed.platform) {
    case 'Twitter':
      result = await publishToTwitter(postId, text)
      break
    case 'Facebook':
      result = await publishToFacebook(postId, text)
      break
    case 'Instagram':
      result = await publishToInstagram(postId, text)
      break
    case 'LinkedIn':
      result = await publishToLinkedIn(postId, text)
      break
    default:
      return `Unknown platform: ${parsed.platform}`
  }

  if (supabase) {
    await supabase
      .from('posts')
      .update({
        status: result.success ? 'published' : 'failed',
        platform_post_id: result.platform_post_id || null,
        post_url: result.post_url || null,
        error_message: result.error_message || null,
        published_at: result.success ? new Date().toISOString() : null,
      })
      .eq('id', postId)
  }

  return result.success
    ? `Published to ${parsed.platform}. View: ${result.post_url}`
    : `Failed to publish to ${parsed.platform}: ${result.error_message}`
}

// ── Main route handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'message and sessionId are required' }, { status: 400 })
    }

    // Load history + add new user message
    const history = await loadHistory(sessionId)
    history.push({ role: 'user', content: message })
    await saveMessage(sessionId, 'user', message)

    // Call Claude — try with web search, fall back to plain chat if unavailable
    let response
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 3,
          } as unknown as Anthropic.Tool,
        ],
        messages: history,
      })
    } catch (toolErr) {
      console.warn('[Chat] web_search unavailable, falling back to plain chat:', toolErr)
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: history,
      })
    }

    // Extract text reply
    const assistantReply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('')

    await saveMessage(sessionId, 'assistant', assistantReply)

    // Check for manual publish instruction
    let publishResult: string | null = null
    if (assistantReply.includes('<publish>')) {
      publishResult = await handlePublish(assistantReply, sessionId)
    }

    // Strip the <publish> block from the reply shown to user
    const cleanReply = assistantReply.replace(/<publish>[\s\S]*?<\/publish>/g, '').trim()

    return NextResponse.json({
      reply: cleanReply,
      publish_result: publishResult,
      session_id: sessionId,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[Chat] Unhandled error:', message)
    return NextResponse.json(
      { reply: `Server error: ${message}` },
      { status: 500 }
    )
  }
}
