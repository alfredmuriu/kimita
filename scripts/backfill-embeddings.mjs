// One-shot backfill: embed every published blog post that doesn't already have
// an embedding vector. Safe to re-run — only touches rows where embedding IS NULL.
//
// Usage (from repo root, with .env.local exporting SUPABASE_SERVICE_ROLE_KEY,
// NEXT_PUBLIC_SUPABASE_URL, OPENAI_API_KEY):
//
//   node scripts/backfill-embeddings.mjs

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY || !OPENAI_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_KEY })

const MODEL = 'text-embedding-3-small'
const BATCH_SIZE = 50

function buildInput(post) {
  const stripped = (post.content || '').replace(/<[^>]+>/g, ' ')
  return [post.title, post.excerpt || '', stripped]
    .filter(Boolean)
    .join('\n\n')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)
}

async function main() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, content')
    .eq('status', 'published')
    .is('embedding', null)

  if (error) {
    console.error('Fetch failed:', error.message)
    process.exit(1)
  }

  if (!posts?.length) {
    console.log('Nothing to backfill — every published post already has an embedding.')
    return
  }

  console.log(`Backfilling ${posts.length} posts in batches of ${BATCH_SIZE}…`)

  let done = 0
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE)
    const inputs = batch.map(buildInput)

    let res
    try {
      res = await openai.embeddings.create({ model: MODEL, input: inputs })
    } catch (err) {
      console.error(`Embedding batch starting at ${i} failed:`, err.message)
      continue
    }

    await Promise.all(
      batch.map((post, idx) =>
        supabase
          .from('blog_posts')
          .update({ embedding: res.data[idx].embedding })
          .eq('id', post.id)
          .then(({ error: upErr }) => {
            if (upErr) console.error(`Update ${post.id} failed:`, upErr.message)
            else done++
          })
      )
    )

    console.log(`  ${Math.min(i + BATCH_SIZE, posts.length)}/${posts.length}`)
  }

  console.log(`Done. Embedded ${done}/${posts.length} posts.`)
}

main().catch((err) => {
  console.error('Backfill crashed:', err)
  process.exit(1)
})
