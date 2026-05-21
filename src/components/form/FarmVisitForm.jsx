'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'
import SearchBox from '@/components/form/SearchBox'
import SuccessMessage from '@/components/form/SuccessMessage'
import { KENYA_COUNTIES } from '@/lib/counties'

const ENTERPRISE_OPTIONS = ['Dairy', 'Poultry', 'Piggery', 'Mixed', 'Other']
const ACTIVITY_OPTIONS = ['Prospecting', 'Follow-Up', 'Complaint', 'Routine', 'Delivery Support']
const OUTCOME_OPTIONS = ['Interested', 'Not Interested', 'Order Placed', 'Needs Follow-Up']
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']

const initialForm = {
  farm_name: '',
  county: '',
  location: '',
  enterprise_type: '',
  farm_size: '',
  owner_name: '',
  owner_contacts: '',
  manager_name: '',
  manager_contacts: '',
  date: '',
  activity: '',
  products_currently_used: '',
  potential_demand: '',
  outcome: '',
  next_followup_date: '',
  priority: '',
}

export default function FarmVisitForm() {
  const [form, setForm] = useState(initialForm)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleRecordSelect = (record) => {
    setSelectedRecord(record)
    setForm((prev) => ({
      ...prev,
      farm_name: record.farm_name || '',
      county: record.county || '',
      location: record.location || '',
      enterprise_type: Array.isArray(record.enterprise_type) ? (record.enterprise_type[0] || '') : (record.enterprise_type || ''),
      farm_size: record.farm_size != null ? String(record.farm_size) : '',
      owner_name: record.owner_name || '',
      owner_contacts: record.owner_contacts || '',
      manager_name: record.manager_name || '',
      manager_contacts: record.manager_contacts || '',
    }))
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.farm_name.trim()) e.farm_name = 'This field is required.'
    if (!form.date) e.date = 'This field is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErrEl = document.querySelector('[data-error="true"]')
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'farm',
          isReturning: !!selectedRecord,
          farmId: selectedRecord?.id ?? null,
          data: {
            ...form,
            enterprise_type: form.enterprise_type ? [form.enterprise_type] : [],
            farm_size: form.farm_size.trim() !== '' ? form.farm_size.trim() : null,
            submitted_by: null,
          },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      alert(err.message || 'Submission failed. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setSelectedRecord(null)
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) return <SuccessMessage onReset={handleReset} />

  const f = (field) => ({
    value: form[field],
    onChange: (e) => set(field, e.target.value),
    className: `${styles.input} ${errors[field] ? styles.inputError : ''}`,
    'data-error': errors[field] ? 'true' : undefined,
  })

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <SearchBox type="farm" onSelect={handleRecordSelect} />

      {selectedRecord && (
        <div className={styles.returningBadge}>
          Returning record — profile pre-filled. Fill in today's visit details.
        </div>
      )}

      {/* ── FARM PROFILE ──────────────────────────────────── */}
      <div className={styles.sectionHeading} style={{ marginTop: selectedRecord ? 24 : 0 }}>
        Farm Profile
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Name of Farm / Ranch / Institution <span className={styles.required}>*</span>
        </label>
        <input type="text" {...f('farm_name')} />
        {errors.farm_name && <p className={styles.errorMsg}>{errors.farm_name}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>County</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.county}
            onChange={(e) => set('county', e.target.value)}
          >
            <option value="">Select county</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Location</label>
        <input
          type="text"
          className={styles.input}
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Type of Enterprise</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.enterprise_type}
            onChange={(e) => set('enterprise_type', e.target.value)}
          >
            <option value="">Select enterprise type</option>
            {ENTERPRISE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Farm Size / Number of Animals</label>
        <input
          type="text"
          className={styles.input}
          value={form.farm_size}
          onChange={(e) => set('farm_size', e.target.value)}
          placeholder="e.g. 300 birds, 20 cows, 40 goats"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Name of Owner</label>
        <input
          type="text"
          className={styles.input}
          value={form.owner_name}
          onChange={(e) => set('owner_name', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Owner Contacts</label>
        <input
          type="tel"
          className={styles.input}
          value={form.owner_contacts}
          onChange={(e) => set('owner_contacts', e.target.value)}
          placeholder="+254"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Name of Manager / Decision Maker</label>
        <input
          type="text"
          className={styles.input}
          value={form.manager_name}
          onChange={(e) => set('manager_name', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Manager Contacts</label>
        <input
          type="tel"
          className={styles.input}
          value={form.manager_contacts}
          onChange={(e) => set('manager_contacts', e.target.value)}
          placeholder="+254"
        />
      </div>

      {/* ── VISIT DETAILS ─────────────────────────────────── */}
      <div className={styles.sectionHeading}>Visit Details</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Date <span className={styles.required}>*</span>
        </label>
        <input
          type="date"
          className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          data-error={errors.date ? 'true' : undefined}
        />
        {errors.date && <p className={styles.errorMsg}>{errors.date}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Activity Type</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.activity}
            onChange={(e) => set('activity', e.target.value)}
          >
            <option value="">Select activity</option>
            {ACTIVITY_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── INSIGHTS ──────────────────────────────────────── */}
      <div className={styles.sectionHeading}>Insights</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Products Currently Used</label>
        <textarea
          className={styles.textarea}
          value={form.products_currently_used}
          onChange={(e) => set('products_currently_used', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Potential Demand</label>
        <textarea
          className={styles.textarea}
          value={form.potential_demand}
          onChange={(e) => set('potential_demand', e.target.value)}
        />
      </div>

      {/* ── OUTCOME & FOLLOW-UP ───────────────────────────── */}
      <div className={styles.sectionHeading}>Outcome & Follow-Up</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Outcome</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.outcome}
            onChange={(e) => set('outcome', e.target.value)}
          >
            <option value="">Select outcome</option>
            {OUTCOME_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Next Follow-Up Date</label>
        <input
          type="date"
          className={styles.input}
          value={form.next_followup_date}
          onChange={(e) => set('next_followup_date', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Priority</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.priority}
            onChange={(e) => set('priority', e.target.value)}
          >
            <option value="">Select priority</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Visit'}
      </button>
    </form>
  )
}
