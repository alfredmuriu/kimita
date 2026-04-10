'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'

export default function DownloadModal({ onClose }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/form/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.status === 401) {
        setError('Incorrect access code.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      const { farmVisits, consultantVisits } = await res.json()

      const XLSX = await import('xlsx')

      const wb = XLSX.utils.book_new()

      // ── Sheet 1: Farm Visits ──────────────────────────────
      const farmHeaders = [
        'Date',
        'Name of Farm / Ranch / Institution',
        'County',
        'Location',
        'Type of Enterprise',
        'Farm Size / Number of Animals',
        'Name of Owner',
        'Owner Contacts',
        'Name of Manager / Decision Maker',
        'Manager Contacts',
        'Activity Type',
        'Insights — Products Currently Used',
        'Insights — Potential Demand',
        'Outcome',
        'Next Follow-Up Date',
        'Priority',
      ]
      const farmRows = (farmVisits || []).map((r) => [
        r.date,
        r.farm_name,
        r.county,
        r.location,
        Array.isArray(r.enterprise_type) ? r.enterprise_type.join(', ') : (r.enterprise_type ?? ''),
        r.farm_size,
        r.owner_name,
        r.owner_contacts,
        r.manager_name,
        r.manager_contacts,
        r.activity,
        r.products_currently_used,
        r.potential_demand,
        r.outcome,
        r.next_followup_date,
        r.priority,
      ])
      const ws1 = XLSX.utils.aoa_to_sheet([farmHeaders, ...farmRows])
      XLSX.utils.book_append_sheet(wb, ws1, 'Farm Visits')

      // ── Sheet 2: Consultant Visits ────────────────────────
      const consultantHeaders = [
        'Date',
        'Profession',
        'Name of Consultant / VET / AHA',
        'Practice Number',
        'Contacts',
        'Type of Clients Served',
        'Key Clients',
        'Number of Clients',
        'Coverage Area',
        'Estimated Animals Under Influence',
        'County',
        'Technical Discussion',
        'Opportunity',
        'Action and Remarks',
      ]
      const consultantRows = (consultantVisits || []).map((r) => [
        r.date,
        r.profession,
        r.full_name,
        r.practice_number,
        r.contacts,
        Array.isArray(r.client_types) ? r.client_types.join(', ') : (r.client_types ?? ''),
        r.key_clients,
        r.num_clients,
        r.coverage_area,
        r.animals_under_influence,
        r.county,
        r.topics_discussed,
        r.products_introduced,
        r.remarks,
      ])
      const ws2 = XLSX.utils.aoa_to_sheet([consultantHeaders, ...consultantRows])
      XLSX.utils.book_append_sheet(wb, ws2, 'Consultant Visits')

      const today = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `Agrikima_Field_Data_${today}.xlsx`)

      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalCard}>
        <h3 className={styles.modalTitle}>Download Field Data</h3>
        <label className={styles.label}>Access code</label>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter access code"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        {error && <p className={styles.modalError}>{error}</p>}
        <button
          className={styles.modalConfirmBtn}
          onClick={handleConfirm}
          disabled={loading || !password}
        >
          {loading ? 'Downloading…' : 'Download'}
        </button>
        <button className={styles.modalCancel} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
