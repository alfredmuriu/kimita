import { NextRequest, NextResponse } from 'next/server'
import { findRelevantArticles } from '@/lib/embeddings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public semantic search over published blog posts. The articles page calls this
// as the user types; results are matched by meaning via the `match_articles`
// pgvector RPC, so natural-language queries ("how do I increase milk production")
// match articles that share no literal keywords ("Boosting Lactation Yield").
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const query = typeof body?.query === 'string' ? body.query.trim() : ''

    if (query.length < 2) {
      return NextResponse.json({ ids: [] })
    }

    // Return a generous set of matches; the client orders/filters them against
    // the posts it already has. min_similarity is low so loosely-related posts
    // still surface, while clearly-irrelevant ones are dropped.
    const matches = await findRelevantArticles(query, 30, 0.25)

    return NextResponse.json({
      ids: matches.map((m) => m.id),
    })
  } catch (err) {
    console.error('articles/search failed:', err)
    // Fail soft: an empty result lets the client fall back to keyword search.
    return NextResponse.json({ ids: [] })
  }
}
