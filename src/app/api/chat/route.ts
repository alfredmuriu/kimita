import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { chatWithAgent } from '@/lib/claude'

type ChatTurn = { role: 'user' | 'assistant'; content: string }

const SYSTEM_PROMPT = `You are the Agrikima Marketing Agent — an AI assistant for the Agrikima marketing team.

Agrikima is an organic animal health company in East Africa.
Key products: Advice (viral protection), Biogar (gut health), Agritonic, Agrivitam.
Tagline: "Making Growth Happen". Audience: smallholder and commercial farmers, agri-vets, distributors.
Tone: knowledgeable, farmer-first, practical, Africa-rooted.

You help the team with:
- Writing and refining social media posts
- Answering questions about content strategy
- Reviewing post performance
- Suggesting hashtags, captions, and content ideas

You do NOT publish posts yourself. Publishing happens only through the weekly
content plan and the team's "Publish Post" composer. If the user asks you to post
something, draft the content for them and tell them to publish it from the
Publish Post tab.`

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
async function loadHistory(sessionId: string): Promise<ChatTurn[]> {
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

    // Call the agent through the shared provider switch (Anthropic or OpenAI,
    // depending on AI_PROVIDER). chatWithAgent handles web search + fallback.
    const assistantReply = await chatWithAgent(history, SYSTEM_PROMPT)

    await saveMessage(sessionId, 'assistant', assistantReply)

    // The assistant no longer publishes. Strip any stray <publish> block just in
    // case the model emits one, so it never leaks into the reply — but never act
    // on it. Publishing is done only via the content plan and the composer.
    const cleanReply = assistantReply.replace(/<publish>[\s\S]*?<\/publish>/g, '').trim()

    return NextResponse.json({
      reply: cleanReply,
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
