import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  return req.cookies.get('form_admin')?.value === process.env.FORM_DOWNLOAD_CODE
}

// GET — fetch all records (admin only)
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const repCode = searchParams.get('rep_code')
  const type = searchParams.get('type') // 'farm' | 'consultant'

  const [farmRes, consultantRes] = await Promise.all([
    (!type || type === 'farm')
      ? supabase
          .from('farm_visits')
          .select(`id, date, activity, outcome, priority, rep_code, rep_name, created_at,
                   farms ( farm_name, county, location, enterprise_type )`)
          .order('created_at', { ascending: false })
          .then((r) => r)
      : Promise.resolve({ data: [], error: null }),

    (!type || type === 'consultant')
      ? supabase
          .from('consultant_visits')
          .select(`id, date, outcome, rep_code, rep_name, created_at,
                   consultants ( full_name, profession, county )`)
          .order('created_at', { ascending: false })
          .then((r) => r)
      : Promise.resolve({ data: [], error: null }),
  ])

  let farmVisits = (farmRes.data ?? []) as any[]
  let consultantVisits = (consultantRes.data ?? []) as any[]

  if (repCode) {
    farmVisits = farmVisits.filter((v) => v.rep_code === repCode)
    consultantVisits = consultantVisits.filter((v) => v.rep_code === repCode)
  }

  return NextResponse.json({ farmVisits, consultantVisits })
}
