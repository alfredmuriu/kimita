import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function getRep(req: NextRequest) {
  try {
    const cookie = req.cookies.get('form_rep')?.value
    return cookie ? JSON.parse(cookie) : null
  } catch { return null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const rep = getRep(req)
  if (!rep) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id } = params
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })

  if (type === 'farm') {
    const { data, error } = await supabase
      .from('farm_visits')
      .select(`
        id, date, activity, products_currently_used, potential_demand,
        outcome, next_followup_date, priority, farm_id,
        farms ( id, farm_name, county, location, enterprise_type, farm_size,
                owner_name, owner_contacts, manager_name, manager_contacts )
      `)
      .eq('id', id)
      .eq('rep_code', rep.code)
      .single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ record: data })
  }

  if (type === 'consultant') {
    const { data, error } = await supabase
      .from('consultant_visits')
      .select(`
        id, date, topics_discussed, products_introduced, remarks, consultant_id,
        consultants ( id, full_name, profession, practice_number, contacts, county,
                      client_types, num_clients, key_clients, coverage_area, animals_under_influence )
      `)
      .eq('id', id)
      .eq('rep_code', rep.code)
      .single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ record: data })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: NextRequest, { params }: any) {
  const rep = getRep(req)
  if (!rep) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, id } = params
  const body = await req.json()
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })

  if (type === 'farm') {
    const { farmId, visit, profile } = body

    if (farmId && profile) {
      const { error } = await supabase
        .from('farms')
        .update({
          farm_name: profile.farm_name,
          county: profile.county || null,
          location: profile.location || null,
          enterprise_type: profile.enterprise_type?.length ? profile.enterprise_type : null,
          farm_size: profile.farm_size ?? null,
          owner_name: profile.owner_name || null,
          owner_contacts: profile.owner_contacts || null,
          manager_name: profile.manager_name || null,
          manager_contacts: profile.manager_contacts || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { error: visitError } = await supabase
      .from('farm_visits')
      .update({
        date: visit.date,
        activity: visit.activity || null,
        products_currently_used: visit.products_currently_used || null,
        potential_demand: visit.potential_demand || null,
        outcome: visit.outcome || null,
        next_followup_date: visit.next_followup_date || null,
        priority: visit.priority || null,
      })
      .eq('id', id)
      .eq('rep_code', rep.code)
    if (visitError) return NextResponse.json({ error: visitError.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  }

  if (type === 'consultant') {
    const { consultantId, visit, profile } = body

    if (consultantId && profile) {
      const { error } = await supabase
        .from('consultants')
        .update({
          full_name: profile.full_name,
          profession: profile.profession || null,
          practice_number: profile.practice_number || null,
          contacts: profile.contacts || null,
          county: profile.county || null,
          client_types: profile.client_types?.length ? profile.client_types : null,
          num_clients: profile.num_clients ?? null,
          key_clients: profile.key_clients || null,
          coverage_area: profile.coverage_area || null,
          animals_under_influence: profile.animals_under_influence ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', consultantId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { error: visitError } = await supabase
      .from('consultant_visits')
      .update({
        date: visit.date,
        topics_discussed: visit.topics_discussed || null,
        products_introduced: visit.products_introduced || null,
        remarks: visit.remarks || null,
      })
      .eq('id', id)
      .eq('rep_code', rep.code)
    if (visitError) return NextResponse.json({ error: visitError.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
