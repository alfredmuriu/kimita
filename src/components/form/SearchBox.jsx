'use client'
import { useState, useRef, useEffect } from 'react'
import styles from '@/styles/form.module.css'

export default function SearchBox({ type, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const search = (q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q || q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/form/search?q=${encodeURIComponent(q)}&type=${type}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    search(e.target.value)
  }

  const handleSelect = (record) => {
    onSelect(record)
    setQuery(type === 'farm' ? record.farm_name : record.full_name)
    setOpen(false)
  }

  const showEmpty = open && !loading && results.length === 0 && query.length >= 2

  return (
    <div className={styles.searchBlock}>
      <label className={styles.searchLabel}>Search existing record</label>
      <div className={styles.searchWrapper} ref={wrapperRef}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={
            type === 'farm'
              ? 'Type farm or ranch name to pre-fill…'
              : 'Type consultant or vet name to pre-fill…'
          }
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {(open && results.length > 0) || showEmpty ? (
          <div className={styles.searchDropdown}>
            {results.map((r) => (
              <div
                key={r.id}
                className={styles.searchItem}
                onMouseDown={() => handleSelect(r)}
              >
                <strong>{type === 'farm' ? r.farm_name : r.full_name}</strong>
                {r.county ? <span style={{ color: '#777', fontWeight: 400 }}> — {r.county}</span> : null}
              </div>
            ))}
            {showEmpty && (
              <div className={styles.searchItemEmpty}>No existing records found</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
