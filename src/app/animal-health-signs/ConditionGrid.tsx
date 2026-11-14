'use client'

import { useMemo, useState } from 'react'
import type { ConditionCard } from '@/lib/animal-health-client'
import { ConditionCardView } from './shared'
import styles from './signs.module.css'

export default function ConditionGrid({ cards }: { cards: ConditionCard[] }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cards
    return cards.filter((c) => [c.name, c.headline, c.look, ...c.aka].some((t) => t.toLowerCase().includes(q)))
  }, [cards, query])

  return (
    <>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.filter}
          placeholder="Filter by sign or disease…"
          aria-label="Filter conditions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>Nothing matches — try another word.</p>
      ) : (
        <div className={styles.cards}>
          {visible.map((c) => (
            <ConditionCardView key={c.id} c={c} />
          ))}
        </div>
      )}
    </>
  )
}
