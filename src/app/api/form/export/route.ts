import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.FORM_DOWNLOAD_CODE) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const [{ data: farmVisits, error: farmError }, { data: consultantVisits, error: consultantError }] =
    await Promise.all([
      supabase
        .from('farm_visits')
        .select(`
          id, date, activity, products_currently_used, potential_demand, outcome,
          next_followup_date, priority, submitted_by, created_at,
          farms ( farm_name, county, location, enterprise_type, farm_size,
                  owner_name, owner_contacts, manager_name, manager_contacts )
        `)
        .order('created_at', { ascending: false }),

      supabase
        .from('consultant_visits')
        .select(`
          id, date, topics_discussed, field_challenges, products_recommended,
          competitors_mentioned, products_introduced, interest_level, trial_opportunity,
          referral_potential, next_action, support_needed, followup_date, outcome,
          remarks, submitted_by, created_at,
          consultants ( full_name, profession, practice_number, contacts, county,
                        client_types, num_clients, key_clients, coverage_area,
                        animals_under_influence )
        `)
        .order('created_at', { ascending: false }),
    ])

  if (farmError) return NextResponse.json({ error: farmError.message }, { status: 500 })
  if (consultantError) return NextResponse.json({ error: consultantError.message }, { status: 500 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatFarmVisits = (farmVisits ?? []).map((v: any) => ({
    date: v.date,
    farm_name: v.farms?.farm_name ?? '',
    county: v.farms?.county ?? '',
    location: v.farms?.location ?? '',
    enterprise_type: v.farms?.enterprise_type ?? [],
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
    submitted_by: v.submitted_by ?? '',
    created_at: v.created_at ?? '',
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatConsultantVisits = (consultantVisits ?? []).map((v: any) => ({
    date: v.date,
    full_name: v.consultants?.full_name ?? '',
    profession: v.consultants?.profession ?? '',
    practice_number: v.consultants?.practice_number ?? '',
    contacts: v.consultants?.contacts ?? '',
    county: v.consultants?.county ?? '',
    client_types: v.consultants?.client_types ?? [],
    num_clients: v.consultants?.num_clients ?? '',
    key_clients: v.consultants?.key_clients ?? '',
    coverage_area: v.consultants?.coverage_area ?? '',
    animals_under_influence: v.consultants?.animals_under_influence ?? '',
    topics_discussed: v.topics_discussed ?? '',
    field_challenges: v.field_challenges ?? '',
    products_recommended: v.products_recommended ?? '',
    competitors_mentioned: v.competitors_mentioned ?? '',
    products_introduced: v.products_introduced ?? '',
    interest_level: v.interest_level ?? '',
    trial_opportunity: v.trial_opportunity ?? '',
    referral_potential: v.referral_potential ?? '',
    next_action: v.next_action ?? '',
    support_needed: v.support_needed ?? '',
    followup_date: v.followup_date ?? '',
    outcome: v.outcome ?? '',
    remarks: v.remarks ?? '',
    submitted_by: v.submitted_by ?? '',
    created_at: v.created_at ?? '',
  }))

  return NextResponse.json({ farmVisits: flatFarmVisits, consultantVisits: flatConsultantVisits })
}
