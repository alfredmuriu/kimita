// Weekly planning pipeline. Run once a week (Sunday evening on cron-job.org).
// Research → strategy → generate posts (left pending) → weekly digest email.
// Publishing is handled separately by /api/marketing/publish-next (daily).

import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { getSupabaseAdmin } from '@/lib/supabase'
import { runResearch } from '@/lib/research'
import { runStrategy } from '@/lib/strategy'
import { generatePost } from '@/lib/generators'
import { sendWeeklyDigest } from '@/lib/email'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 300

// Content types that are disabled and must never be planned, saved or posted.
// Filtered out of the plan upstream so the digest matches what's published.
const DISABLED_CONTENT_TYPES = new Set(['article'])

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.AGENT_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })
  }

  const startedAt = Date.now()

  // Create cycle record
  const { data: cycle, error: cycleError } = await supabase
    .from('cycles')
    .insert({ status: 'running' })
    .select()
    .single()

  if (cycleError || !cycle) {
    console.error('[Agent] Failed to create cycle:', cycleError)
    return NextResponse.json({ error: 'Failed to create cycle' }, { status: 500 })
  }

  const cycleId: number = cycle.id

  // Weekly planning runs 60-180s (research + strategy + 8-10 post generations
  // each with LLM + image). cron-job.org free tier caps HTTP response timeout
  // at ~30s — so we return immediately and run the pipeline in the background.
  // The cycle row already exists with status='running', so the caller can
  // poll /api/marketing/cycles to watch progress.
  waitUntil(
    (async () => {
      try {
        // ── Step 1: Research ─────────────────────────────────────────────
        console.log(`[Agent] Cycle ${cycleId} — starting research`)
        const research = await runResearch()

        await supabase
          .from('cycles')
          .update({ research_data: research, status: 'researched' })
          .eq('id', cycleId)

        // ── Step 2: Strategy ─────────────────────────────────────────────
        console.log(`[Agent] Cycle ${cycleId} — generating strategy`)
        const strategy = await runStrategy(research)

        // Enforce the content-type policy centrally, BEFORE the plan is saved,
        // emailed and generated — so the digest (what you review) is identical to
        // what actually gets posted. Articles are disabled on every platform.
        const before = strategy.posts.length
        strategy.posts = strategy.posts.filter((p) => !DISABLED_CONTENT_TYPES.has(p.content_type))
        if (strategy.posts.length !== before) {
          console.log(`[Agent] Cycle ${cycleId} — dropped ${before - strategy.posts.length} disabled-type post(s) from the plan`)
        }

        await supabase
          .from('cycles')
          .update({
            weekly_theme: strategy.weekly_theme,
            ai_confidence_score: strategy.ai_confidence_score,
            strategy_json: strategy,
            status: 'planned',
          })
          .eq('id', cycleId)

        // Email the weekly content plan. CONTENT_PLAN_RECIPIENTS is a dedicated
        // list for the plan (the two addresses that should receive it), kept
        // separate from AGENT_NOTIFY_EMAILS (per-post publish notifications +
        // escalations) so plan recipients aren't subscribed to that noise. Falls
        // back to AGENT_NOTIFY_EMAILS if the dedicated var isn't set.
        const digestRecipients = (
          process.env.CONTENT_PLAN_RECIPIENTS ||
          process.env.AGENT_NOTIFY_EMAILS ||
          ''
        )
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean)

        if (digestRecipients.length) {
          await sendWeeklyDigest(strategy, digestRecipients).catch((err) =>
            console.error('[Agent] Digest email failed:', err)
          )
        }

        // ── Step 3: Generate all posts ───────────────────────────────────
        console.log(`[Agent] Cycle ${cycleId} — generating ${strategy.posts.length} posts`)

        const savedPostIds: string[] = []

        for (const postPlan of strategy.posts) {
          const generated = await generatePost(postPlan, cycleId)

          const { data: savedPost } = await supabase
            .from('posts')
            .insert({
              cycle_id: cycleId,
              platform: generated.platform,
              content_type: generated.content_type,
              content: generated.copy.main_text,
              hashtags: generated.copy.hashtags ?? [],
              image_url: generated.image_url || null,
              status: 'pending',
            })
            .select('id')
            .single()

          if (savedPost) savedPostIds.push(savedPost.id)
        }

        // ── Step 4: Mark cycle complete (publishing runs separately, daily) ──
        const durationSeconds = (Date.now() - startedAt) / 1000

        await supabase
          .from('cycles')
          .update({
            status: 'completed',
            posts_generated: savedPostIds.length,
            completed_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
          })
          .eq('id', cycleId)

        console.log(
          `[Agent] Cycle ${cycleId} planned — ${savedPostIds.length} posts pending, to be published daily by /api/marketing/publish-next`
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`[Agent] Cycle ${cycleId} crashed:`, message)

        await supabase
          .from('cycles')
          .update({ status: 'failed', error_message: message })
          .eq('id', cycleId)
      }
    })()
  )

  return NextResponse.json({
    success: true,
    message: 'Weekly plan started in background',
    cycle_id: cycleId,
  })
}
