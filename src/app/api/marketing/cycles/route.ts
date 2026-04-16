import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')

  const { data: cycles, error } = await supabase
    .from('cycles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Attach post counts per cycle
  const cycleIds = (cycles ?? []).map((c) => c.id)

  const { data: postCounts } = await supabase
    .from('posts')
    .select('cycle_id, status')
    .in('cycle_id', cycleIds)

  const countsByCycle: Record<number, { published: number; failed: number; pending: number }> = {}
  for (const p of postCounts ?? []) {
    if (!countsByCycle[p.cycle_id]) {
      countsByCycle[p.cycle_id] = { published: 0, failed: 0, pending: 0 }
    }
    const s = p.status as 'published' | 'failed' | 'pending'
    if (s in countsByCycle[p.cycle_id]) countsByCycle[p.cycle_id][s]++
  }

  const enriched = (cycles ?? []).map((c) => ({
    ...c,
    post_counts: countsByCycle[c.id] ?? { published: 0, failed: 0, pending: 0 },
  }))

  return NextResponse.json({ cycles: enriched })
}
