'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

// The legacy jQuery/vendor scripts (plugins.js, main.js) drive the marketing
// site's DOM (sliders, lightbox, preloader, etc.). They assume the homepage
// markup exists and crash ("Cannot read properties of null") on self-contained
// React routes that don't render that markup. Skip them on those routes.
const SKIP_PREFIXES = ['/marketing-agent', '/form', '/admin', '/formulate']

export default function SiteScripts() {
  const pathname = usePathname() || ''
  const skip = SKIP_PREFIXES.some((p) => pathname.startsWith(p))

  if (skip) return null

  return (
    <>
      <Script src="/js/plugins.js" strategy="beforeInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  )
}
