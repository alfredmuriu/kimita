import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feed Formulation — Agrikima',
  description: 'Least-cost, nutritionally balanced feed formulas for Kenyan millers',
  robots: { index: false, follow: false },
}

export default function FormulateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
