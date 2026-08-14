// Watchdog for the Baileys WhatsApp bridge. Call it on a schedule (cron-job.org,
// every 15 min): if the VPS bot hasn't checked in recently, staff get one email.
//
//   GET|POST  →  { ok, state, minutesSinceLastBeat }
//
// Auth: x-cron-secret header, or ?secret= for cron services that can't set
// headers. Exactly one email per outage — alerted_at is the latch, and the next
// heartbeat clears it (see ../heartbeat), which also triggers one recovery note.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/email-client'
import { BOT_ID } from '../heartbeat/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The bot beats every 5 minutes, so 15 tolerates two misses (a restart, a blip)
// before we call it down.
const STALE_AFTER_MINUTES = 15

function recipients(): string[] {
  return (process.env.AGENT_NOTIFY_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
}

async function handle(req: NextRequest) {
  const headerSecret = req.headers.get('x-cron-secret')
  const querySecret = new URL(req.url).searchParams.get('secret')
  const expected = process.env.AGENT_CRON_SECRET
  if (!expected || (headerSecret !== expected && querySecret !== expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  const { data: row, error } = await supabase
    .from('whatsapp_bot_heartbeat')
    .select('last_seen_at, status, alerted_at')
    .eq('id', BOT_ID)
    .maybeSingle()

  if (error) {
    console.error('[heartbeat-check] query failed:', error.message)
    return NextResponse.json(
      { error: `${error.message}. Has supabase/whatsapp_bot_heartbeat.sql been run?` },
      { status: 500 }
    )
  }

  // No row at all means the bot has never checked in — that's setup pending, not
  // an outage, so don't alarm anyone about a bot that was never up.
  if (!row) {
    return NextResponse.json({
      ok: true,
      state: 'never-seen',
      message: 'No heartbeat recorded yet — bot has not started, or the QR is unscanned.',
    })
  }

  const lastSeen = new Date(row.last_seen_at)
  const minutesSince = Math.round((Date.now() - lastSeen.getTime()) / 60000)
  const isDown = minutesSince > STALE_AFTER_MINUTES
  const to = recipients()

  if (isDown && !row.alerted_at) {
    if (to.length) {
      await sendEmail({
        to,
        subject: `⚠️ WhatsApp bot is down (silent ${minutesSince} min)`,
        html: `
          <p>The WhatsApp bridge on the VPS has not checked in for <strong>${minutesSince} minutes</strong>.</p>
          <p>Last seen: ${lastSeen.toUTCString()}<br/>Last status: ${row.status || 'unknown'}</p>
          <p><strong>Customers messaging the bot number are getting no reply.</strong></p>
          <p>To investigate, SSH to the VPS and check the process:</p>
          <pre>ssh root@167.233.130.182
pm2 status
pm2 logs agrikima-whatsapp --lines 50</pre>
          <p>Most likely causes: WhatsApp logged the linked device out (needs a fresh
          QR scan from the spare phone), or the server rebooted without pm2 resuming.</p>
        `,
        fromName: 'Agrikima Bot Watchdog',
      }).catch((e) => console.error('[heartbeat-check] alert email failed:', e))
    }
    await supabase
      .from('whatsapp_bot_heartbeat')
      .update({ alerted_at: new Date().toISOString() })
      .eq('id', BOT_ID)

    return NextResponse.json({ ok: false, state: 'down', minutesSinceLastBeat: minutesSince, alerted: true })
  }

  return NextResponse.json({
    ok: !isDown,
    state: isDown ? 'down' : 'alive',
    minutesSinceLastBeat: minutesSince,
    // Already emailed for this outage; staying quiet until it recovers.
    alerted: Boolean(row.alerted_at),
  })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
