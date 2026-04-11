import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  return req.cookies.get('form_admin')?.value === process.env.FORM_DOWNLOAD_CODE
}

// GET — list all reps
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })
  const { data, error } = await supabase
    .from('sales_reps')
    .select('id, code, name, created_at')
    .order('code')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reps: data })
}

// POST — add new rep
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })
  const { code, name, password } = await req.json()
  if (!code || !name || !password) {
    return NextResponse.json({ error: 'Code, name and password required' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('sales_reps')
    .insert({ code: code.toUpperCase(), name, password })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rep: data })
}

// PATCH — update rep password
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })
  const { id, password } = await req.json()
  if (!id || !password) return NextResponse.json({ error: 'ID and password required' }, { status: 400 })
  const { error } = await supabase.from('sales_reps').update({ password }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE — remove rep
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const { error } = await supabase.from('sales_reps').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
