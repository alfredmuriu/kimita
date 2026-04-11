import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('form_rep')?.value
    if (!cookie) return NextResponse.json({ rep: null })
    const rep = JSON.parse(cookie)
    return NextResponse.json({ rep })
  } catch {
    return NextResponse.json({ rep: null })
  }
}
