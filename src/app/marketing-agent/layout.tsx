import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketing Agent — Agrikima',
  robots: { index: false, follow: false },
}

export default function MarketingAgentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
