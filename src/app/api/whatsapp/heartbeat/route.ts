// Heartbeat receiver for the Baileys WhatsApp bridge on the VPS.
//
// The bot POSTs here every few minutes while its WhatsApp socket is open. We
// only store "when did we last hear from it" — the alerting lives in
// ../heartbeat-check, which a cron calls on its own schedule.
//
//   POST { status? }  →  { ok: true }
//
// Auth: x-cron-secret, same as the bridge route (not under the middleware
// matcher, so it checks the secret itself).

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/email-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const BOT_ID = 'whatsapp-bot'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (!secret || secret !== process.env.AGENT_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let status: string | null = null
  try {
    const body = await req.json()
    status = typeof body?.status === 'string' ? body.status : null
  } catch {
    // Body is optional — a bare POST is a valid heartbeat.
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  // Read first so we can tell "routine beat" from "back after an outage" — a
  // set alerted_at means the watchdog already emailed that the bot was down, so
  // staff are owed the all-clear.
  const { data: previous } = await supabase
    .from('whatsapp_bot_heartbeat')
    .select('alerted_at')
    .eq('id', BOT_ID)
    .maybeSingle()

  // Clearing alerted_at also re-arms the watchdog for the next outage.
  const { error } = await supabase.from('whatsapp_bot_heartbeat').upsert({
    id: BOT_ID,
    last_seen_at: new Date().toISOString(),
    status: status || 'connected',
    alerted_at: null,
  })

  if (error) {
    console.error('[whatsapp-heartbeat] upsert failed:', error.message)
    return NextResponse.json(
      { error: `Could not record heartbeat: ${error.message}. Has supabase/whatsapp_bot_heartbeat.sql been run?` },
      { status: 500 }
    )
  }

  if (previous?.alerted_at) {
    const to = (process.env.AGENT_NOTIFY_EMAILS || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
    if (to.length) {
      // Fire-and-forget: a failed all-clear must never fail the heartbeat itself.
      sendEmail({
        to,
        subject: '✅ WhatsApp bot is back online',
        html: `<p>The WhatsApp bridge is checking in again as of ${new Date().toUTCString()}.</p>
               <p>It was last reported down at ${new Date(previous.alerted_at).toUTCString()}. Customer replies have resumed.</p>`,
        fromName: 'Agrikima Bot Watchdog',
      }).catch((e) => console.error('[whatsapp-heartbeat] recovery email failed:', e))
    }
  }

  return NextResponse.json({ ok: true })
}
