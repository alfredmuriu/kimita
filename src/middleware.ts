import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Marketing agent ───────────────────────────────────────────────────────
  const isAgentProtected =
    (pathname.startsWith('/marketing-agent') && !pathname.startsWith('/marketing-agent/login')) ||
    (pathname.startsWith('/api/marketing') && !pathname.startsWith('/api/marketing/auth')) ||
    pathname.startsWith('/api/chat')

  if (isAgentProtected) {
    const cronSecret = req.headers.get('x-cron-secret')
    if (cronSecret && cronSecret === process.env.AGENT_CRON_SECRET) {
      return NextResponse.next()
    }
    const cookie = req.cookies.get('agent_auth')
    if (cookie?.value === process.env.AGENT_PASSWORD) return NextResponse.next()

    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/marketing-agent/login'
    return NextResponse.redirect(url)
  }

  // ── Form — rep auth ───────────────────────────────────────────────────────
  const isFormRep =
    (pathname === '/form' || pathname.startsWith('/form/records')) ||
    (pathname.startsWith('/api/form/records'))

  if (isFormRep) {
    try {
      const cookie = req.cookies.get('form_rep')?.value
      if (cookie) { JSON.parse(cookie); return NextResponse.next() }
    } catch {}
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/form/login'
    return NextResponse.redirect(url)
  }

  // ── Form — admin auth ─────────────────────────────────────────────────────
  const isFormAdmin =
    (pathname.startsWith('/form/admin') && !pathname.startsWith('/form/admin/login')) ||
    (pathname.startsWith('/api/form/admin') &&
      !pathname.startsWith('/api/form/admin/auth') &&
      !pathname.startsWith('/api/form/export'))

  if (isFormAdmin) {
    const cookie = req.cookies.get('form_admin')?.value
    if (cookie === process.env.FORM_DOWNLOAD_CODE) return NextResponse.next()
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/form/admin/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/marketing-agent/:path*',
    '/api/marketing/:path*',
    '/api/chat/:path*',
    '/form',
    '/form/records/:path*',
    '/form/admin/:path*',
    '/api/form/records/:path*',
    '/api/form/admin/:path*',
  ],
}
