import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Unlisted while the library is under review: reachable by direct URL only.
// Keep search engines out until it is approved, linked from the site and
// added to the sitemap — then delete this robots rule.
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function AnimalHealthLayout({ children }: { children: ReactNode }) {
  return children
}
