'use client'

import { useMemo, useState } from 'react'
import { URGENCY, URGENCY_ORDER, type ConditionCard, type Urgency } from '@/lib/animal-health-client'
import { ConditionCardView } from './shared'
import styles from './signs.module.css'

type Filter = Urgency | 'all'

export default function ConditionGrid({ cards }: { cards: ConditionCard[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const present = URGENCY_ORDER.filter((u) => cards.some((c) => c.urgency === u))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cards.filter(
      (c) =>
        (filter === 'all' || c.urgency === filter) &&
        (!q || [c.name, c.headline, c.look, ...c.aka].some((t) => t.toLowerCase().includes(q)))
    )
  }, [cards, filter, query])

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.chips} role="group" aria-label="Urgency">
          {(['all', ...present] as Filter[]).map((u) => (
            <button
              key={u}
              type="button"
              className={`${styles.chip} ${filter === u ? styles.chipActive : ''}`}
              aria-pressed={filter === u}
              title={u === 'all' ? undefined : URGENCY[u].hint}
              onClick={() => setFilter(u)}
            >
              {u === 'all' ? `All (${cards.length})` : URGENCY[u].label}
            </button>
          ))}
        </div>
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
        <p className={styles.empty}>Nothing matches — try another filter or word.</p>
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
