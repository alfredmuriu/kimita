'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'
import SearchBox from '@/components/form/SearchBox'
import SuccessMessage from '@/components/form/SuccessMessage'
import { KENYA_COUNTIES } from '@/lib/counties'

const PROFESSION_OPTIONS = ['Vet', 'AHA', 'Nutritionist', 'Consultant', 'Other']
const CLIENT_TYPE_OPTIONS = ['Farms', 'Feed Miller', 'Distributor', 'Other']

const initialForm = {
  // Profile
  profession: '',
  full_name: '',
  practice_number: '',
  contacts: '',
  client_types: '',
  num_clients: '',
  key_clients: '',
  coverage_area: '',
  animals_under_influence: '',
  county: '',
  // Visit
  date: '',
  topics_discussed: '',   // Technical Discussion
  products_introduced: '', // Opportunity
  remarks: '',            // Action and Remarks
}

export default function ConsultantForm() {
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
      full_name: record.full_name || '',
      profession: record.profession || '',
      practice_number: record.practice_number || '',
      contacts: record.contacts || '',
      county: record.county || '',
      client_types: Array.isArray(record.client_types) ? (record.client_types[0] || '') : (record.client_types || ''),
      num_clients: record.num_clients != null ? String(record.num_clients) : '',
      key_clients: record.key_clients || '',
      coverage_area: record.coverage_area || '',
      animals_under_influence: record.animals_under_influence != null ? String(record.animals_under_influence) : '',
    }))
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'This field is required.'
    if (!form.date) e.date = 'This field is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consultant',
          isReturning: !!selectedRecord,
          consultantId: selectedRecord?.id ?? null,
          data: {
            ...form,
            client_types: form.client_types ? [form.client_types] : [],
            num_clients: form.num_clients !== '' ? parseInt(form.num_clients, 10) : null,
            animals_under_influence: form.animals_under_influence !== '' ? parseInt(form.animals_under_influence, 10) : null,
            submitted_by: null,
            // unused columns — nulled out
            field_challenges: null,
            products_recommended: null,
            competitors_mentioned: null,
            interest_level: null,
            trial_opportunity: null,
            referral_potential: null,
            next_action: null,
            support_needed: null,
            followup_date: null,
            outcome: null,
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

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <SearchBox type="consultant" onSelect={handleRecordSelect} />

      {selectedRecord && (
        <div className={styles.returningBadge}>
          Returning record — profile pre-filled. Fill in today's visit details.
        </div>
      )}

      {/* ── CONSULTANT PROFILE ────────────────────────────── */}
      <div className={styles.sectionHeading} style={{ marginTop: selectedRecord ? 24 : 0 }}>
        Consultant Profile
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Profession</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.profession}
            onChange={(e) => set('profession', e.target.value)}
          >
            <option value="">Select profession</option>
            {PROFESSION_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Name of Consultant / VET / AHA <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={`${styles.input} ${errors.full_name ? styles.inputError : ''}`}
          value={form.full_name}
          onChange={(e) => set('full_name', e.target.value)}
        />
        {errors.full_name && <p className={styles.errorMsg}>{errors.full_name}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Practice Number <span style={{ color: '#999', fontWeight: 400 }}>(if available)</span></label>
        <input
          type="text"
          className={styles.input}
          value={form.practice_number}
          onChange={(e) => set('practice_number', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Contacts</label>
        <input
          type="tel"
          className={styles.input}
          value={form.contacts}
          onChange={(e) => set('contacts', e.target.value)}
          placeholder="+254"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Type of Clients Served</label>
        <div className={styles.selectWrapper}>
          <select
            size={1}
            className={styles.select}
            value={form.client_types}
            onChange={(e) => set('client_types', e.target.value)}
          >
            <option value="">Select client type</option>
            {CLIENT_TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Key Clients</label>
        <textarea
          className={styles.textarea}
          value={form.key_clients}
          onChange={(e) => set('key_clients', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Number of Clients</label>
        <input
          type="number"
          className={styles.input}
          value={form.num_clients}
          onChange={(e) => set('num_clients', e.target.value)}
          min="0"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Coverage Area</label>
        <input
          type="text"
          className={styles.input}
          value={form.coverage_area}
          onChange={(e) => set('coverage_area', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Estimated Animals Under Influence <span style={{ color: '#999', fontWeight: 400 }}>(if possible)</span></label>
        <input
          type="number"
          className={styles.input}
          value={form.animals_under_influence}
          onChange={(e) => set('animals_under_influence', e.target.value)}
          min="0"
        />
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
        />
        {errors.date && <p className={styles.errorMsg}>{errors.date}</p>}
      </div>

      {/* ── TECHNICAL DISCUSSION ──────────────────────────── */}
      <div className={styles.sectionHeading}>Technical Discussion</div>

      <div className={styles.fieldGroup}>
        <textarea
          className={styles.textarea}
          style={{ minHeight: 100 }}
          value={form.topics_discussed}
          onChange={(e) => set('topics_discussed', e.target.value)}
          placeholder="Topics discussed, field challenges, products recommended, competitors mentioned…"
        />
      </div>

      {/* ── OPPORTUNITY ───────────────────────────────────── */}
      <div className={styles.sectionHeading}>Opportunity</div>

      <div className={styles.fieldGroup}>
        <textarea
          className={styles.textarea}
          style={{ minHeight: 100 }}
          value={form.products_introduced}
          onChange={(e) => set('products_introduced', e.target.value)}
          placeholder="Products introduced, interest level, trial opportunity, referral potential…"
        />
      </div>

      {/* ── ACTION AND REMARKS ────────────────────────────── */}
      <div className={styles.sectionHeading}>Action and Remarks</div>

      <div className={styles.fieldGroup}>
        <textarea
          className={styles.textarea}
          style={{ minHeight: 100 }}
          value={form.remarks}
          onChange={(e) => set('remarks', e.target.value)}
          placeholder="Next action, support needed, follow-up date, outcome, remarks…"
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Visit'}
      </button>
    </form>
  )
}
