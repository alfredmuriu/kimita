import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Guest login — no DB check, just a name
  if (body.guest) {
    const name = body.name?.trim()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    const res = NextResponse.json({ success: true, rep: { code: 'E000', name } })
    res.cookies.set('form_rep', JSON.stringify({ code: 'E000', name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  }

  const { code, password } = body

  if (!code || !password) {
    return NextResponse.json({ error: 'Code and password required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database error' }, { status: 500 })

  const { data: rep, error } = await supabase
    .from('sales_reps')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('password', password)
    .single()

  if (error || !rep) {
    return NextResponse.json({ error: 'Invalid code or password' }, { status: 401 })
  }

  const repName = rep.name

  const res = NextResponse.json({ success: true, rep: { code: rep.code, name: repName } })
  res.cookies.set('form_rep', JSON.stringify({ code: rep.code, name: repName }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.cookies.set('form_rep', '', { maxAge: 0, path: '/' })
  return res
}
