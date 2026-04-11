import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function getRep(req: NextRequest) {
  try {
    const cookie = req.cookies.get('form_rep')?.value
    return cookie ? JSON.parse(cookie) : null
  } catch { return null }
}

// GET — fetch rep's own records
export async function GET(req: NextRequest) {
  const rep = getRep(req)
  if (!rep) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })

  const [farmRes, consultantRes] = await Promise.all([
    supabase
      .from('farm_visits')
      .select(`id, date, activity, outcome, priority, next_followup_date, created_at,
               farms ( farm_name, county, location, enterprise_type, farm_size,
                       owner_name, owner_contacts, manager_name, manager_contacts )`)
      .eq('rep_code', rep.code)
      .order('created_at', { ascending: false }),

    supabase
      .from('consultant_visits')
      .select(`id, date, outcome, topics_discussed, products_introduced, remarks, created_at,
               consultants ( full_name, profession, county, contacts, client_types )`)
      .eq('rep_code', rep.code)
      .order('created_at', { ascending: false }),
  ])

  return NextResponse.json({
    farmVisits: farmRes.data ?? [],
    consultantVisits: consultantRes.data ?? [],
  })
}
