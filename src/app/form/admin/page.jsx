'use client'
import { useState, useEffect, useCallback } from 'react'
import styles from '@/styles/form.module.css'
import DownloadPanel from '@/components/form/DownloadPanel'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPage() {
  const [tab, setTab] = useState('records')  // 'records' | 'reps'
  const [recordType, setRecordType] = useState('farm')
  const [repFilter, setRepFilter] = useState('')
  const [farmVisits, setFarmVisits] = useState([])
  const [consultantVisits, setConsultantVisits] = useState([])
  const [reps, setReps] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDownload, setShowDownload] = useState(false)

  // New rep form
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newPass, setNewPass] = useState('')
  const [repMsg, setRepMsg] = useState('')

  // Reset password
  const [editRepId, setEditRepId] = useState(null)
  const [editPass, setEditPass] = useState('')

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (repFilter) params.set('rep_code', repFilter)
      const res = await fetch(`/api/form/admin?${params}`)
      const data = await res.json()
      setFarmVisits(data.farmVisits ?? [])
      setConsultantVisits(data.consultantVisits ?? [])
    } finally {
      setLoading(false)
    }
  }, [repFilter])

  const fetchReps = useCallback(async () => {
    const res = await fetch('/api/form/admin/reps')
    const data = await res.json()
    setReps(data.reps ?? [])
  }, [])

  useEffect(() => { fetchRecords() }, [fetchRecords])
  useEffect(() => { fetchReps() }, [fetchReps])

  const handleLogout = async () => {
    await fetch('/api/form/admin/auth', { method: 'DELETE' })
    window.location.href = '/form/admin/login'
  }

  const handleAddRep = async (e) => {
    e.preventDefault()
    setRepMsg('')
    const res = await fetch('/api/form/admin/reps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode, name: newName, password: newPass }),
    })
    const data = await res.json()
    if (data.rep) {
      setRepMsg('Rep added successfully')
      setNewCode(''); setNewName(''); setNewPass('')
      fetchReps()
    } else {
      setRepMsg(data.error || 'Failed to add rep')
    }
  }

  const handleResetPass = async (id) => {
    if (!editPass.trim()) return
    const res = await fetch('/api/form/admin/reps', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password: editPass }),
    })
    if ((await res.json()).success) {
      setEditRepId(null); setEditPass(''); fetchReps()
    }
  }

  const handleDeleteRep = async (id) => {
    if (!confirm('Remove this rep?')) return
    await fetch('/api/form/admin/reps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchReps()
  }

  const records = recordType === 'farm' ? farmVisits : consultantVisits

  return (
    <div className={styles.page}>
      {/* ── Sticky header ── */}
      <div className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <img src="/logo.png" alt="Agrikima" className={styles.siteHeaderImg} />
          <div className={styles.siteHeaderActions}>
            <button type="button" className={styles.downloadBtn} onClick={() => setShowDownload(true)}>Download Excel</button>
            <button type="button" className={styles.downloadBtn} onClick={handleLogout} style={{ color: '#888', borderColor: '#ddd' }}>Log out</button>
          </div>
        </div>
      </div>

      <div className={styles.container}>

        {/* Toggle */}
        <div className={styles.toggleGroup} style={{ marginBottom: 24 }}>
          <button type="button" className={`${styles.toggleBtn} ${tab === 'records' ? styles.active : ''}`} onClick={() => setTab('records')}>Records</button>
          <button type="button" className={`${styles.toggleBtn} ${tab === 'reps' ? styles.active : ''}`} onClick={() => setTab('reps')}>Manage Reps</button>
        </div>

        {/* ── Records tab ── */}
        {tab === 'records' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className={styles.toggleGroup}>
                <button type="button" className={`${styles.toggleBtn} ${recordType === 'farm' ? styles.active : ''}`} onClick={() => setRecordType('farm')}>Farm Visits</button>
                <button type="button" className={`${styles.toggleBtn} ${recordType === 'consultant' ? styles.active : ''}`} onClick={() => setRecordType('consultant')}>Consultant Visits</button>
              </div>
              <div className={styles.selectWrapper} style={{ minWidth: 160 }}>
                <select
                  size={1}
                  className={styles.select}
                  value={repFilter}
                  onChange={(e) => setRepFilter(e.target.value)}
                >
                  <option value="">All Reps</option>
                  {reps.map((r) => (
                    <option key={r.id} value={r.code}>{r.code} — {r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <p style={{ color: '#888', fontSize: 14 }}>Loading...</p>
            ) : records.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: 14 }}>No records found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {records.map((record) => {
                  const name = recordType === 'farm'
                    ? record.farms?.farm_name || '—'
                    : record.consultants?.full_name || '—'
                  const county = recordType === 'farm'
                    ? record.farms?.county
                    : record.consultants?.county
                  return (
                    <div key={record.id} style={{
                      border: '1px solid #eee', borderRadius: 10, padding: '14px 16px',
                      display: 'flex', alignItems: 'center', gap: 12, background: '#fff',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {formatDate(record.date)}
                          {county ? ` · ${county}` : ''}
                          {record.rep_name ? ` · ${record.rep_name}` : ''}
                        </div>
                      </div>
                      {record.outcome && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: '#f0fdf4', color: '#16a34a', flexShrink: 0 }}>
                          {record.outcome}
                        </span>
                      )}
                      {record.rep_code && (
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: '#f5f5f5', color: '#555', flexShrink: 0 }}>
                          {record.rep_code}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ── Reps tab ── */}
        {tab === 'reps' && (
          <>
            <p className={styles.sectionHeading} style={{ marginTop: 8 }}>Sales Reps</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {reps.map((r) => (
                <div key={r.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: '12px 16px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, minWidth: 48 }}>{r.code}</span>
                    <span style={{ fontSize: 14, flex: 1 }}>{r.name}</span>
                    {editRepId === r.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="New password"
                          value={editPass}
                          onChange={(e) => setEditPass(e.target.value)}
                          style={{ width: 140 }}
                        />
                        <button type="button" className={styles.downloadBtn} onClick={() => handleResetPass(r.id)}>Save</button>
                        <button type="button" className={styles.downloadBtn} onClick={() => setEditRepId(null)} style={{ color: '#888', borderColor: '#ddd' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button type="button" className={styles.downloadBtn} onClick={() => { setEditRepId(r.id); setEditPass('') }}>Reset Password</button>
                        {r.code !== 'E000' && (
                          <button type="button" className={styles.downloadBtn} onClick={() => handleDeleteRep(r.id)} style={{ color: '#dc2626', borderColor: '#fca5a5' }}>Remove</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new rep */}
            <p className={styles.sectionHeading}>Add New Rep</p>
            <form onSubmit={handleAddRep} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 100px' }}>
                  <label className={styles.label}>Code</label>
                  <input type="text" className={styles.input} placeholder="E010" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
                </div>
                <div style={{ flex: '2 1 160px' }}>
                  <label className={styles.label}>Full Name</label>
                  <input type="text" className={styles.input} placeholder="Jane Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <label className={styles.label}>Password</label>
                  <input type="text" className={styles.input} placeholder="Jane" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                </div>
              </div>
              {repMsg && <div style={{ fontSize: 12, color: repMsg.includes('success') ? '#16a34a' : '#dc2626' }}>{repMsg}</div>}
              <button type="submit" className={styles.submitBtn} disabled={!newCode || !newName || !newPass}>Add Rep</button>
            </form>
          </>
        )}
      </div>

      {showDownload && <DownloadPanel reps={reps} onClose={() => setShowDownload(false)} />}
    </div>
  )
}
