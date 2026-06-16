// WhatsApp bridge endpoint for the open-wa VPS bot (whatsapp-bot/).
//
// The official Meta webhook (../webhook) is Meta-specific: Meta's payload shape,
// Meta's verify handshake, and replies sent via the Graph API. The open-wa bot
// can't use it. This endpoint exposes the SAME customer brain (bot-core via
// whatsapp-bot.ts) and the SAME persistence/escalation as the webhook, but over
// a plain JSON contract the VPS bot can call:
//
//   POST { phone, name?, message }  →  { reply, escalated }
//
// Auth: x-cron-secret header (same secret the cron jobs use). This route is NOT
// under the middleware matcher, so it enforces the secret itself.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateBotReply, type ConversationTurn } from '@/lib/whatsapp-bot'
import { sendEscalationEmail } from '@/lib/whatsapp-escalation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (!secret || secret !== process.env.AGENT_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { phone?: string; name?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const phone = body.phone?.trim()
  const message = body.message?.trim()
  const name = body.name?.trim() || null

  if (!phone || !message) {
    return NextResponse.json({ error: 'phone and message are required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  // Fetch or create the conversation, keyed by phone — same table the Meta
  // webhook uses, so history is shared if the number ever migrates.
  const { data: existing } = await supabase
    .from('whatsapp_conversations')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()

  const priorHistory: ConversationTurn[] =
    (existing?.message_history as ConversationTurn[] | null) || []

  let reply
  try {
    reply = await generateBotReply(priorHistory, message)
  } catch (err) {
    console.error('[whatsapp-bridge] generateBotReply failed:', err)
    return NextResponse.json(
      { reply: "Sorry, I'm having a technical problem. Please try again in a moment." },
      { status: 200 }
    )
  }

  const updatedHistory: ConversationTurn[] = [
    ...priorHistory,
    { role: 'user', content: message },
    { role: 'assistant', content: reply.text },
  ]

  if (existing) {
    await supabase
      .from('whatsapp_conversations')
      .update({
        name: name || existing.name,
        message_history: updatedHistory,
        last_message_at: new Date().toISOString(),
        escalated: existing.escalated || reply.shouldEscalate,
        escalation_reason: reply.shouldEscalate
          ? reply.escalationReason
          : existing.escalation_reason,
      })
      .eq('id', existing.id)
  } else {
    await supabase.from('whatsapp_conversations').insert({
      phone,
      name,
      message_history: updatedHistory,
      last_message_at: new Date().toISOString(),
      escalated: reply.shouldEscalate,
      escalation_reason: reply.escalationReason,
    })
  }

  // Fire-and-forget escalation email, same as the Meta webhook.
  if (reply.shouldEscalate) {
    sendEscalationEmail({
      customerPhone: phone,
      customerName: name,
      reason: reply.escalationReason || 'Bot could not answer',
      history: priorHistory,
      latestMessage: message,
    }).catch((e) => console.error('[whatsapp-bridge] sendEscalationEmail failed:', e))
  }

  return NextResponse.json({ reply: reply.text, escalated: reply.shouldEscalate })
}
