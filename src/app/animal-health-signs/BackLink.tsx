'use client'

// "← Back": returns to the previous page when the visitor came from this site,
// otherwise goes to `fallback` (e.g. someone landing from Google).

import { useRouter } from 'next/navigation'
import styles from './signs.module.css'

export default function BackLink({ fallback, className = '' }: { fallback: string; className?: string }) {
  const router = useRouter()

  const back = (e: React.MouseEvent) => {
    e.preventDefault()
    let sameSite = false
    try {
      // Reached by an in-app link: the page first loaded was a different URL.
      const first = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.name
      const clientNav = !!first && first !== window.location.href
      const fromSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin
      sameSite = clientNav || fromSite
    } catch {}
    if (sameSite && window.history.length > 1) router.back()
    else router.push(fallback)
  }

  return (
    <a href={fallback} onClick={back} className={`${styles.backLink} ${className}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back
    </a>
  )
}
