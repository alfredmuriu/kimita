'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'

const THIS_MONTH = (() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return { start: `${y}-${m}-01`, end: now.toISOString().split('T')[0] }
})()

const THIS_YEAR = (() => {
  const y = new Date().getFullYear()
  return { start: `${y}-01-01`, end: new Date().toISOString().split('T')[0] }
})()

export default function DownloadPanel({ reps = [], onClose }) {
  const [recordType, setRecordType] = useState('both')
  const [repCode, setRepCode] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    setLoading(true)
    setError('')

    let startDate = ''
    let endDate = ''
    if (dateRange === 'month') { startDate = THIS_MONTH.start; endDate = THIS_MONTH.end }
    if (dateRange === 'year')  { startDate = THIS_YEAR.start;  endDate = THIS_YEAR.end }
    if (dateRange === 'custom') { startDate = customStart; endDate = customEnd }

    try {
      const res = await fetch('/api/form/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: recordType, repCode, startDate, endDate }),
      })
      if (!res.ok) { setError('Export failed. Please try again.'); return }

      const { farmVisits, consultantVisits } = await res.json()
      const XLSX = await import('xlsx')
      const wb = XLSX.utils.book_new()

      if (recordType === 'both' || recordType === 'farm') {
        const headers = ['Date','Farm Name','County','Location','Enterprise Type','Farm Size','Owner Name','Owner Contacts','Manager Name','Manager Contacts','Activity','Products Currently Used','Potential Demand','Outcome','Next Follow-Up Date','Priority','Rep Code','Rep Name']
        const rows = (farmVisits || []).map((r) => [r.date,r.farm_name,r.county,r.location,r.enterprise_type,r.farm_size,r.owner_name,r.owner_contacts,r.manager_name,r.manager_contacts,r.activity,r.products_currently_used,r.potential_demand,r.outcome,r.next_followup_date,r.priority,r.rep_code,r.rep_name])
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, ...rows]), 'Farm Visits')
      }

      if (recordType === 'both' || recordType === 'consultant') {
        const headers = ['Date','Full Name','Profession','Practice Number','Contacts','Client Types','Key Clients','No. of Clients','Coverage Area','Animals Under Influence','County','Technical Discussion','Opportunity','Action & Remarks','Rep Code','Rep Name']
        const rows = (consultantVisits || []).map((r) => [r.date,r.full_name,r.profession,r.practice_number,r.contacts,r.client_types,r.key_clients,r.num_clients,r.coverage_area,r.animals_under_influence,r.county,r.topics_discussed,r.products_introduced,r.remarks,r.rep_code,r.rep_name])
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, ...rows]), 'Consultant Visits')
      }

      // Build descriptive filename
      const repLabel = repCode ? `_${repCode}` : ''
      const dateLabel = dateRange === 'month' ? '_ThisMonth' : dateRange === 'year' ? '_ThisYear' : dateRange === 'custom' ? `_${customStart}_${customEnd}` : ''
      const typeLabel = recordType === 'farm' ? '_FarmVisits' : recordType === 'consultant' ? '_ConsultantVisits' : ''
      const today = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `Agrikima${typeLabel}${repLabel}${dateLabel}_${today}.xlsx`)
      onClose()
    } catch {
      setError('Export failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalCard} style={{ maxWidth: 400 }}>
        <h3 className={styles.modalTitle}>Download Field Data</h3>

        {/* Record type */}
        <p style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Record Type</p>
        <div className={styles.pillGroup} style={{ marginBottom: 20 }}>
          {[['both', 'All Records'], ['farm', 'Farm Visits'], ['consultant', 'Consultant Visits']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`${styles.pill} ${recordType === val ? styles.pillSelected : ''}`}
              onClick={() => setRecordType(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Rep filter */}
        <p style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sales Rep</p>
        <div className={styles.selectWrapper} style={{ marginBottom: 20 }}>
          <select size={1} className={styles.select} value={repCode} onChange={(e) => setRepCode(e.target.value)}>
            <option value="">All Reps</option>
            {reps.map((r) => (
              <option key={r.id} value={r.code}>{r.code} — {r.name}</option>
            ))}
          </select>
        </div>

        {/* Date range */}
        <p style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date Range</p>
        <div className={styles.pillGroup} style={{ marginBottom: dateRange === 'custom' ? 12 : 24 }}>
          {[['all', 'All Time'], ['month', 'This Month'], ['year', 'This Year'], ['custom', 'Custom']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`${styles.pill} ${dateRange === val ? styles.pillSelected : ''}`}
              onClick={() => setDateRange(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {dateRange === 'custom' && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <label className={styles.label} style={{ marginBottom: 4 }}>From</label>
              <input type="date" className={styles.input} value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label className={styles.label} style={{ marginBottom: 4 }}>To</label>
              <input type="date" className={styles.input} value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
            </div>
          </div>
        )}

        {error && <p className={styles.modalError}>{error}</p>}

        <button className={styles.modalConfirmBtn} onClick={handleDownload} disabled={loading || (dateRange === 'custom' && (!customStart || !customEnd))}>
          {loading ? 'Downloading…' : 'Download Excel'}
        </button>
        <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
