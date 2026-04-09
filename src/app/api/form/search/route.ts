import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type')

  if (query.length < 2) return NextResponse.json([])

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json([])

  if (type === 'farm') {
    const { data, error } = await supabase
      .from('farms')
      .select(
        'id, farm_name, county, location, enterprise_type, farm_size, owner_name, owner_contacts, manager_name, manager_contacts'
      )
      .ilike('farm_name', `%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(6)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  const { data, error } = await supabase
    .from('consultants')
    .select(
      'id, full_name, profession, practice_number, contacts, county, client_types, num_clients, key_clients, coverage_area, animals_under_influence'
    )
    .ilike('full_name', `%${query}%`)
    .order('updated_at', { ascending: false })
    .limit(6)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
