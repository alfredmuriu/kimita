import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase unavailable' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')       // pending | published | failed
  const platform = searchParams.get('platform')   // Twitter | Facebook | etc.
  const cycleId = searchParams.get('cycle_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (platform) query = query.eq('platform', platform)
  if (cycleId) query = query.eq('cycle_id', parseInt(cycleId))

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ posts: data, total: data?.length ?? 0 })
}
