import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const adminCookie = request.cookies.get('form_admin')?.value
  const isAdminSession = adminCookie === process.env.FORM_DOWNLOAD_CODE

  const body = await request.json().catch(() => ({}))

  if (!isAdminSession) {
    if (!body.password || body.password !== process.env.FORM_DOWNLOAD_CODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { type = 'both', repCode = '', startDate = '', endDate = '' } = body

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  // ── Farm visits ──────────────────────────────────────────
  let farmVisits: any[] = []
  if (type === 'both' || type === 'farm') {
    let q = supabase
      .from('farm_visits')
      .select(`
        id, date, activity, products_currently_used, potential_demand, outcome,
        next_followup_date, priority, rep_code, rep_name, created_at,
        farms ( farm_name, county, location, enterprise_type, farm_size,
                owner_name, owner_contacts, manager_name, manager_contacts )
      `)
      .order('date', { ascending: false })

    if (repCode) q = q.eq('rep_code', repCode)
    if (startDate) q = q.gte('date', startDate)
    if (endDate) q = q.lte('date', endDate)

    const { data, error } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    farmVisits = data ?? []
  }

  // ── Consultant visits ────────────────────────────────────
  let consultantVisits: any[] = []
  if (type === 'both' || type === 'consultant') {
    let q = supabase
      .from('consultant_visits')
      .select(`
        id, date, topics_discussed, products_introduced, remarks,
        rep_code, rep_name, created_at,
        consultants ( full_name, profession, practice_number, contacts, county,
                      client_types, num_clients, key_clients, coverage_area,
                      animals_under_influence )
      `)
      .order('date', { ascending: false })

    if (repCode) q = q.eq('rep_code', repCode)
    if (startDate) q = q.gte('date', startDate)
    if (endDate) q = q.lte('date', endDate)

    const { data, error } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    consultantVisits = data ?? []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatFarmVisits = farmVisits.map((v: any) => ({
    date: v.date,
    farm_name: v.farms?.farm_name ?? '',
    county: v.farms?.county ?? '',
    location: v.farms?.location ?? '',
    enterprise_type: Array.isArray(v.farms?.enterprise_type) ? v.farms.enterprise_type.join(', ') : '',
    farm_size: v.farms?.farm_size ?? '',
    owner_name: v.farms?.owner_name ?? '',
    owner_contacts: v.farms?.owner_contacts ?? '',
    manager_name: v.farms?.manager_name ?? '',
    manager_contacts: v.farms?.manager_contacts ?? '',
    activity: v.activity ?? '',
    products_currently_used: v.products_currently_used ?? '',
    potential_demand: v.potential_demand ?? '',
    outcome: v.outcome ?? '',
    next_followup_date: v.next_followup_date ?? '',
    priority: v.priority ?? '',
    rep_code: v.rep_code ?? '',
    rep_name: v.rep_name ?? '',
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatConsultantVisits = consultantVisits.map((v: any) => ({
    date: v.date,
    full_name: v.consultants?.full_name ?? '',
    profession: v.consultants?.profession ?? '',
    practice_number: v.consultants?.practice_number ?? '',
    contacts: v.consultants?.contacts ?? '',
    county: v.consultants?.county ?? '',
    client_types: Array.isArray(v.consultants?.client_types) ? v.consultants.client_types.join(', ') : '',
    num_clients: v.consultants?.num_clients ?? '',
    key_clients: v.consultants?.key_clients ?? '',
    coverage_area: v.consultants?.coverage_area ?? '',
    animals_under_influence: v.consultants?.animals_under_influence ?? '',
    topics_discussed: v.topics_discussed ?? '',
    products_introduced: v.products_introduced ?? '',
    remarks: v.remarks ?? '',
    rep_code: v.rep_code ?? '',
    rep_name: v.rep_name ?? '',
  }))

  return NextResponse.json({ farmVisits: flatFarmVisits, consultantVisits: flatConsultantVisits })
}
