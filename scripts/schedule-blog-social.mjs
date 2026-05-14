// Schedules a Twitter + Facebook post for every published blog article,
// one article per day at 04:00 Africa/Nairobi (= 01:00 UTC), starting from
// the very first (oldest) article.
//
// Usage:
//   node scripts/schedule-blog-social.mjs --dry-run     # preview, no writes
//   node scripts/schedule-blog-social.mjs               # actually insert
//   node scripts/schedule-blog-social.mjs --start=2026-05-15
//                                                       # override first day
//
// Idempotency: before inserting, looks for an existing pending post with the
// same platform + article URL in `content`. If one exists, that article is
// skipped (so re-running the script doesn't double-schedule).

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// --- env loading ---------------------------------------------------------
for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let val = m[2]
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  if (!process.env[m[1]]) process.env[m[1]] = val
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- args ----------------------------------------------------------------
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const startArg = args.find((a) => a.startsWith('--start='))?.split('=')[1]

// --- time helpers --------------------------------------------------------
// Africa/Nairobi is UTC+3, no DST. 04:00 local == 01:00 UTC.
function nairobiFourAmUtc(yyyyMmDd) {
  // yyyyMmDd is a local-Nairobi calendar date string like "2026-05-15".
  // Return the corresponding 04:00 Nairobi instant as ISO UTC ("2026-05-14T01:00:00.000Z" wait — same day at 01:00 UTC).
  return new Date(`${yyyyMmDd}T04:00:00+03:00`).toISOString()
}

function addDaysIso(yyyyMmDd, days) {
  const d = new Date(`${yyyyMmDd}T00:00:00+03:00`)
  d.setUTCDate(d.getUTCDate() + days)
  // Format back to yyyy-mm-dd in Nairobi tz (UTC+3, so add 3h then take ISO date part).
  const shifted = new Date(d.getTime() + 3 * 3600 * 1000)
  return shifted.toISOString().slice(0, 10)
}

function todayNairobi() {
  const now = new Date()
  const shifted = new Date(now.getTime() + 3 * 3600 * 1000)
  return shifted.toISOString().slice(0, 10)
}

// First scheduled day: tomorrow in Nairobi (so we never schedule for a past 04:00).
const firstDay = startArg || addDaysIso(todayNairobi(), 1)

// --- fetch articles ------------------------------------------------------
const { data: articles, error: artErr } = await supabase
  .from('blog_posts')
  .select('id, slug, title, excerpt, published_at')
  .eq('status', 'published')
  .order('published_at', { ascending: true, nullsFirst: true })
  .order('created_at', { ascending: true })

if (artErr) {
  console.error('Failed to fetch blog_posts:', artErr.message)
  process.exit(1)
}
if (!articles?.length) {
  console.log('No published articles found.')
  process.exit(0)
}

console.log(`Found ${articles.length} published articles.`)
console.log(`First scheduled day (Nairobi): ${firstDay} @ 04:00 (=01:00 UTC)`)
console.log(dryRun ? '\n[DRY RUN — no inserts will be made]\n' : '')

// --- compose + insert ----------------------------------------------------
function buildTweet(article) {
  const url = `https://www.agrikima.co.ke/articles/${article.slug}`
  // Twitter trims URLs to ~23 chars via t.co; budget = 280 - 24 (url + newline) - safety.
  const maxTitleLen = 230
  const title =
    article.title.length > maxTitleLen
      ? article.title.slice(0, maxTitleLen - 1) + '…'
      : article.title
  return `${title}\n\n${url}`
}

function buildFacebook(article) {
  const url = `https://www.agrikima.co.ke/articles/${article.slug}`
  const excerpt = (article.excerpt || '').trim()
  const body = excerpt ? `${article.title}\n\n${excerpt}\n\n${url}` : `${article.title}\n\n${url}`
  return body
}

let scheduledCount = 0
let skipped = 0
let day = firstDay

for (const article of articles) {
  const url = `https://www.agrikima.co.ke/articles/${article.slug}`
  const scheduledForUtc = nairobiFourAmUtc(day)
  const tweetText = buildTweet(article)
  const fbText = buildFacebook(article)

  // Idempotency check: any pending row with this URL in content?
  const { data: existing, error: exErr } = await supabase
    .from('posts')
    .select('id, platform')
    .eq('status', 'pending')
    .like('content', `%${url}%`)

  if (exErr) {
    console.error(`  ✖ lookup failed for ${article.slug}:`, exErr.message)
    continue
  }

  const existingPlatforms = new Set((existing || []).map((r) => r.platform))
  const rowsToInsert = []
  if (!existingPlatforms.has('Twitter')) {
    rowsToInsert.push({
      platform: 'Twitter',
      content_type: 'manual',
      content: tweetText,
      hashtags: [],
      status: 'pending',
      scheduled_for: scheduledForUtc,
    })
  }
  if (!existingPlatforms.has('Facebook')) {
    rowsToInsert.push({
      platform: 'Facebook',
      content_type: 'manual',
      content: fbText,
      hashtags: [],
      status: 'pending',
      scheduled_for: scheduledForUtc,
    })
  }

  if (rowsToInsert.length === 0) {
    console.log(`  · ${day}  SKIP (already scheduled)  ${article.slug}`)
    skipped++
    day = addDaysIso(day, 1)
    continue
  }

  console.log(
    `  + ${day} 04:00 EAT  ${article.slug}  (${rowsToInsert.map((r) => r.platform).join(' + ')})`
  )

  if (!dryRun) {
    const { error: insErr } = await supabase.from('posts').insert(rowsToInsert)
    if (insErr) {
      console.error(`    ✖ insert failed:`, insErr.message)
    } else {
      scheduledCount += rowsToInsert.length
    }
  } else {
    scheduledCount += rowsToInsert.length
  }

  day = addDaysIso(day, 1)
}

console.log('')
console.log(`Done. ${dryRun ? 'Would schedule' : 'Scheduled'} ${scheduledCount} post rows across ${articles.length - skipped} articles (${skipped} skipped).`)
