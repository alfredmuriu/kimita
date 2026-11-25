'use client'

// "On this page" for a condition page: a back link, the introduction plus
// numbered sections, highlighting whichever one is under the header. When the
// list is taller than the screen it scrolls itself to keep that one in view.

import { useEffect, useRef, useState } from 'react'
import BackLink from './BackLink'
import styles from './signs.module.css'

export default function ArticleToc({ sections, backHref }: { sections: { id: string; title: string }[]; backHref: string }) {
  const [active, setActive] = useState('introduction')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ids = ['introduction', ...sections.map((s) => s.id)]
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-120px 0px -60% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  // Keep the highlighted entry visible inside the sticky list (without moving the page).
  useEffect(() => {
    const nav = navRef.current
    if (!nav || nav.scrollHeight <= nav.clientHeight) return
    const link = nav.querySelector<HTMLElement>(`a[href="#${active}"]`)
    if (!link) return
    nav.scrollTo({ top: link.offsetTop - nav.clientHeight / 2 + link.offsetHeight / 2, behavior: 'smooth' })
  }, [active])

  const link = (id: string) => (id === active ? styles.tocActive : undefined)

  return (
    <nav ref={navRef} className={styles.toc} aria-label="On this page">
      <BackLink fallback={backHref} className={styles.tocBack} />
      <span className={styles.pretitle}>On this page</span>
      <ol>
        <li className={styles.tocIntro}>
          <a href="#introduction" className={link('introduction')}>
            Introduction
          </a>
        </li>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className={link(s.id)} aria-current={s.id === active ? 'location' : undefined}>
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
