// WhatsApp Cloud API webhook.
//   GET  — Meta verification handshake (returns challenge if token matches)
//   POST — receives incoming messages, passes to bot, replies, stores history

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { parseIncomingMessage, sendTextMessage, markAsRead } from '@/lib/whatsapp'
import { generateBotReply, type ConversationTurn } from '@/lib/whatsapp-bot'
import { sendEscalationEmail } from '@/lib/whatsapp-escalation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || ''

// ── GET: Meta verification handshake ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// ── POST: incoming message ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Always return 200 fast — Meta retries on non-2xx and we don't want duplicate sends
  try {
    const payload = await request.json()
    const incoming = parseIncomingMessage(payload)

    if (!incoming) {
      // Status updates (delivered/read receipts) and non-message events land here
      return NextResponse.json({ ok: true })
    }

    // Only handle text messages for now; reply politely for other types
    if (incoming.type !== 'text' || !incoming.text) {
      await sendTextMessage(
        incoming.from,
        "Asante kwa ujumbe. Kwa sasa, naweza kujibu maswali ya maandishi tu. Tafadhali andika swali lako. / Thanks for your message. For now I can only respond to text messages — please send your question as text."
      )
      await markAsRead(incoming.messageId).catch(() => {})
      return NextResponse.json({ ok: true })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error('whatsapp webhook: Supabase not configured')
      return NextResponse.json({ ok: true })
    }

    // Fetch or create conversation record
    const { data: existing } = await supabase
      .from('whatsapp_conversations')
      .select('*')
      .eq('phone', incoming.from)
      .maybeSingle()

    const priorHistory: ConversationTurn[] = (existing?.message_history as ConversationTurn[] | null) || []

    // Mark as read so the customer sees blue ticks
    await markAsRead(incoming.messageId).catch((e) => console.error('markAsRead failed:', e))

    // Generate bot reply
    let reply
    try {
      reply = await generateBotReply(priorHistory, incoming.text)
    } catch (err) {
      console.error('generateBotReply failed:', err)
      await sendTextMessage(
        incoming.from,
        "Samahani, nina tatizo la kiufundi. Tafadhali jaribu tena. / Sorry, I'm having a technical problem. Please try again in a moment."
      )
      return NextResponse.json({ ok: true })
    }

    // Send the bot's reply
    await sendTextMessage(incoming.from, reply.text)

    // Persist the conversation
    const updatedHistory: ConversationTurn[] = [
      ...priorHistory,
      { role: 'user', content: incoming.text },
      { role: 'assistant', content: reply.text },
    ]

    if (existing) {
      await supabase
        .from('whatsapp_conversations')
        .update({
          name: incoming.name || existing.name,
          message_history: updatedHistory,
          last_message_at: new Date().toISOString(),
          escalated: existing.escalated || reply.shouldEscalate,
          escalation_reason: reply.shouldEscalate ? reply.escalationReason : existing.escalation_reason,
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('whatsapp_conversations').insert({
        phone: incoming.from,
        name: incoming.name,
        message_history: updatedHistory,
        last_message_at: new Date().toISOString(),
        escalated: reply.shouldEscalate,
        escalation_reason: reply.escalationReason,
      })
    }

    // Fire-and-forget escalation email
    if (reply.shouldEscalate) {
      sendEscalationEmail({
        customerPhone: incoming.from,
        customerName: incoming.name,
        reason: reply.escalationReason || 'Bot could not answer',
        history: priorHistory,
        latestMessage: incoming.text,
      }).catch((e) => console.error('sendEscalationEmail failed:', e))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('whatsapp webhook error:', err)
    // Still return 200 so Meta doesn't hammer us with retries
    return NextResponse.json({ ok: true })
  }
}
