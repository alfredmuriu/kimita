'use client'

// "On this page" for a condition page: the introduction plus numbered
// sections, highlighting whichever one is under the header.

import { useEffect, useState } from 'react'
import styles from './signs.module.css'

export default function ArticleToc({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState('introduction')

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

  const link = (id: string) => (id === active ? styles.tocActive : undefined)

  return (
    <nav className={styles.toc} aria-label="On this page">
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
