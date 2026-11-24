'use client'

// The hub's library: every condition listed like the What's New articles,
// grouped by animal, with a sticky table of contents that tracks the section
// in view and a filter that searches across all animals.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { ConditionCard } from '@/lib/animal-health-client'
import { PostCard, SearchBar } from './shared'
import styles from './signs.module.css'

export interface HubGroup {
  id: string
  label: string
  intro: string
  cards: ConditionCard[]
}

export default function HubLibrary({ groups }: { groups: HubGroup[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(groups[0]?.id)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return groups
    return groups
      .map((g) => ({
        ...g,
        cards: g.cards.filter((c) => [c.name, c.headline, c.look, ...c.aka].some((t) => t.toLowerCase().includes(q))),
      }))
      .filter((g) => g.cards.length > 0)
  }, [groups, query])

  // Highlight the animal whose section sits under the header.
  useEffect(() => {
    const sections = visible.map((g) => document.getElementById(g.id)).filter((el): el is HTMLElement => !!el)
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-150px 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [visible])

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    // Clear the fixed header, plus the sticky chip row on small screens.
    const offset = window.innerWidth <= 800 ? 140 : 100
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  const conditionCount = (g: HubGroup) => g.cards.filter((c) => c.urgency !== 'normal').length

  return (
    <div className={styles.libraryWrap}>
      <aside className={`${styles.sidebar} ${styles.hubSidebar}`}>
        <nav className={styles.sidebarSticky} aria-label="Animals">
          <div className={styles.sidebarTitle}>Animals</div>
          <ul className={styles.sidebarMenu}>
            {visible.map((g) => {
              const isActive = g.id === active
              return (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    onClick={(e) => jump(e, g.id)}
                    className={`${styles.sidebarLink} ${isActive ? styles.sidebarActive : ''}`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span>{g.label}</span>
                    <span className={styles.sidebarCount}>{conditionCount(g)}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <div className={styles.libraryMain}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search all animals by sign or disease..."
          label="Search conditions"
        />

        {visible.length === 0 ? (
          <p className={styles.empty}>Nothing matches — try another word.</p>
        ) : (
          visible.map((g) => (
            <section key={g.id} id={g.id} className={styles.hubGroup}>
              {query ? (
                <h2 className={styles.hubGroupTitle}>{g.label}</h2>
              ) : (
                <GroupIntro g={g} n={groups.indexOf(g) + 1} />
              )}
              <div className={styles.postGrid}>
                {/* The healthy guide is featured in the intro; it only joins the grid when searching. */}
                {g.cards
                  .filter((c) => query || c.urgency !== 'normal')
                  .map((c) => (
                    <PostCard key={c.id} c={c} />
                  ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

/** Opening text for an animal: numbered title, intro, and its healthy-animal baseline. */
function GroupIntro({ g, n }: { g: HubGroup; n: number }) {
  const healthy = g.cards.find((c) => c.urgency === 'normal')
  return (
    <header className={styles.groupIntro}>
      <div>
        <span className={styles.groupNum}>{String(n).padStart(2, '0')}.</span>
        <h2 className={styles.groupIntroTitle}>{g.label}</h2>
        <p className={styles.groupIntroLead}>{g.intro}</p>
        {healthy && (
          <div className={styles.groupBaseline}>
            <span className={styles.groupBaselineLabel}>What healthy looks like</span>
            <p>{healthy.look}</p>
          </div>
        )}
        {healthy && (
          <div className={styles.groupLinks}>
            <Link href={healthy.href} className={styles.cardMore}>
              Health check guide
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
