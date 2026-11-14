'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './signs.module.css'

export interface SearchItem {
  name: string
  species: string
  href: string
  terms: string
}

export default function LibrarySearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return items.filter((i) => words.every((w) => i.terms.includes(w))).slice(0, 12)
  }, [items, query])

  return (
    <div className={styles.searchWrap}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search a sign or disease — e.g. “swollen neck”, “redwater”, “bloody droppings”"
        aria-label="Search the animal health library"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() &&
        (results.length ? (
          <ul className={styles.results}>
            {results.map((r) => (
              <li key={r.href}>
                <Link href={r.href}>
                  <span>{r.name}</span>
                  <span className={styles.resultMeta}>{r.species}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noResults}>No match — try a simpler word, or pick an animal below.</p>
        ))}
    </div>
  )
}
