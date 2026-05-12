// Twilio WhatsApp webhook.
// Twilio POSTs application/x-www-form-urlencoded on incoming messages.
// Configure in Twilio Console (Sandbox or Sender) → "When a message comes in".

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { generateBotReply, type ConversationTurn } from '@/lib/whatsapp-bot'
import { sendEscalationEmail } from '@/lib/whatsapp-escalation'
import { parseTwilioIncoming, sendTwilioWhatsAppMessage } from '@/lib/twilio-whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

function twiml(body?: string) {
  // Empty TwiML response — we send replies via REST API, not inline TwiML.
  // Returning valid (empty) TwiML keeps Twilio from logging a parse warning.
  const xml = body
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${body}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response/>`
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text()
    const form = new URLSearchParams(raw)
    const incoming = parseTwilioIncoming(form)

    if (!incoming) {
      return twiml()
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error('twilio webhook: Supabase not configured')
      return twiml()
    }

    const { data: existing } = await supabase
      .from('whatsapp_conversations')
      .select('*')
      .eq('phone', incoming.from)
      .maybeSingle()

    const priorHistory: ConversationTurn[] = (existing?.message_history as ConversationTurn[] | null) || []

    let reply
    try {
      reply = await generateBotReply(priorHistory, incoming.text)
    } catch (err) {
      console.error('generateBotReply failed:', err)
      await sendTwilioWhatsAppMessage(
        incoming.from,
        "Sorry, I'm having a technical problem. Please try again in a moment."
      ).catch((e) => console.error('twilio send failed:', e))
      return twiml()
    }

    await sendTwilioWhatsAppMessage(incoming.from, reply.text).catch((e) =>
      console.error('twilio send failed:', e)
    )

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

    if (reply.shouldEscalate) {
      sendEscalationEmail({
        customerPhone: incoming.from,
        customerName: incoming.name,
        reason: reply.escalationReason || 'Bot could not answer',
        history: priorHistory,
        latestMessage: incoming.text,
      }).catch((e) => console.error('sendEscalationEmail failed:', e))
    }

    return twiml()
  } catch (err) {
    console.error('twilio webhook error:', err)
    return twiml()
  }
}
