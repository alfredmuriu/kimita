import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Field Portal — Agrikima',
  description: 'Agrikima field agent visit recording portal',
  robots: { index: false, follow: false },
}

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
