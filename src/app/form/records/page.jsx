'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/form.module.css'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function RecordsPage() {
  const router = useRouter()
  const [tab, setTab] = useState('farm')
  const [farmVisits, setFarmVisits] = useState([])
  const [consultantVisits, setConsultantVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/form/records')
      .then((r) => r.json())
      .then((d) => {
        setFarmVisits(d.farmVisits ?? [])
        setConsultantVisits(d.consultantVisits ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const records = tab === 'farm' ? farmVisits : consultantVisits

  return (
    <div className={styles.page}>
      {/* ── Sticky header ── */}
      <div className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <img src="/logo.png" alt="Agrikima" className={styles.siteHeaderImg} />
          <div className={styles.siteHeaderActions}>
            <button type="button" className={styles.downloadBtn} onClick={() => router.push('/form')}>
              ← Back to Form
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>

        {/* Toggle */}
        <div className={styles.toggleGroup} style={{ marginBottom: 24 }}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${tab === 'farm' ? styles.active : ''}`}
            onClick={() => setTab('farm')}
          >
            Farm Visits
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${tab === 'consultant' ? styles.active : ''}`}
            onClick={() => setTab('consultant')}
          >
            Consultant Visits
          </button>
        </div>

        {/* Records list */}
        {loading ? (
          <p style={{ color: '#888', fontSize: 14, marginTop: 32 }}>Loading...</p>
        ) : records.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: 14, marginTop: 32 }}>No records yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {records.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                type={tab}
                onEdit={() => router.push(`/form/records/${tab}/${record.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecordCard({ record, type, onEdit }) {
  const name = type === 'farm'
    ? record.farms?.farm_name || '—'
    : record.consultants?.full_name || '—'

  const sub = type === 'farm'
    ? [record.farms?.county, record.activity].filter(Boolean).join(' · ')
    : [record.consultants?.county, record.consultants?.profession].filter(Boolean).join(' · ')

  return (
    <div style={{
      border: '1px solid #eeeeee', borderRadius: 10, padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      background: '#fff',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 12, color: '#888' }}>
          {formatDate(record.date)}{sub ? ` · ${sub}` : ''}
        </div>
      </div>
      {record.outcome && (
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
          background: '#f0fdf4', color: '#16a34a', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {record.outcome}
        </span>
      )}
      <button
        type="button"
        className={styles.downloadBtn}
        onClick={onEdit}
        style={{ flexShrink: 0, fontSize: 12 }}
      >
        Edit
      </button>
    </div>
  )
}
