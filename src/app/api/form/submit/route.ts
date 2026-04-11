import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function getRepFromCookie(request: NextRequest): { code: string; name: string } | null {
  try {
    const cookie = request.cookies.get('form_rep')?.value
    return cookie ? JSON.parse(cookie) : null
  } catch { return null }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type } = body
  const rep = getRepFromCookie(request)

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  if (type === 'farm') return handleFarmSubmit(supabase, body, rep)
  if (type === 'consultant') return handleConsultantSubmit(supabase, body, rep)

  return NextResponse.json({ error: 'Unknown form type' }, { status: 400 })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleFarmSubmit(supabase: any, { isReturning, farmId, data }: any, rep: any) {
  const profileFields = {
    farm_name: data.farm_name,
    county: data.county || null,
    location: data.location || null,
    enterprise_type: data.enterprise_type?.length ? data.enterprise_type : null,
    farm_size: data.farm_size ?? null,
    owner_name: data.owner_name || null,
    owner_contacts: data.owner_contacts || null,
    manager_name: data.manager_name || null,
    manager_contacts: data.manager_contacts || null,
  }

  let resolvedFarmId = farmId

  if (isReturning && farmId) {
    const { error } = await supabase
      .from('farms')
      .update({ ...profileFields, updated_at: new Date().toISOString() })
      .eq('id', farmId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { data: inserted, error } = await supabase
      .from('farms')
      .insert(profileFields)
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    resolvedFarmId = inserted.id
  }

  const { error: visitError } = await supabase.from('farm_visits').insert({
    farm_id: resolvedFarmId,
    farm_name: data.farm_name,
    county: data.county || null,
    date: data.date,
    activity: data.activity || null,
    products_currently_used: data.products_currently_used || null,
    potential_demand: data.potential_demand || null,
    outcome: data.outcome || null,
    next_followup_date: data.next_followup_date || null,
    priority: data.priority || null,
    submitted_by: rep?.name || data.submitted_by || null,
    rep_code: rep?.code || null,
    rep_name: rep?.name || null,
  })
  if (visitError) return NextResponse.json({ error: visitError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleConsultantSubmit(supabase: any, { isReturning, consultantId, data }: any, rep: any) {
  const profileFields = {
    full_name: data.full_name,
    profession: data.profession || null,
    practice_number: data.practice_number || null,
    contacts: data.contacts || null,
    county: data.county || null,
    client_types: data.client_types?.length ? data.client_types : null,
    num_clients: data.num_clients ?? null,
    key_clients: data.key_clients || null,
    coverage_area: data.coverage_area || null,
    animals_under_influence: data.animals_under_influence ?? null,
  }

  let resolvedConsultantId = consultantId

  if (isReturning && consultantId) {
    const { error } = await supabase
      .from('consultants')
      .update({ ...profileFields, updated_at: new Date().toISOString() })
      .eq('id', consultantId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { data: inserted, error } = await supabase
      .from('consultants')
      .insert(profileFields)
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    resolvedConsultantId = inserted.id
  }

  const { error: visitError } = await supabase.from('consultant_visits').insert({
    consultant_id: resolvedConsultantId,
    full_name: data.full_name,
    county: data.county || null,
    date: data.date,
    topics_discussed: data.topics_discussed || null,
    field_challenges: data.field_challenges || null,
    products_recommended: data.products_recommended || null,
    competitors_mentioned: data.competitors_mentioned || null,
    products_introduced: data.products_introduced || null,
    interest_level: data.interest_level || null,
    trial_opportunity: data.trial_opportunity || null,
    referral_potential: data.referral_potential || null,
    next_action: data.next_action || null,
    support_needed: data.support_needed || null,
    followup_date: data.followup_date || null,
    outcome: data.outcome || null,
    remarks: data.remarks || null,
    submitted_by: rep?.name || data.submitted_by || null,
    rep_code: rep?.code || null,
    rep_name: rep?.name || null,
  })
  if (visitError) return NextResponse.json({ error: visitError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
