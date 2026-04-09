'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'
import SearchBox from '@/components/form/SearchBox'
import SuccessMessage from '@/components/form/SuccessMessage'
import { KENYA_COUNTIES } from '@/lib/counties'

const PROFESSION_OPTIONS = ['Vet', 'AHA', 'Nutritionist', 'Consultant', 'Other']
const CLIENT_TYPE_OPTIONS = ['Farms', 'Feed Miller', 'Distributor', 'Other']
const INTEREST_OPTIONS = ['High', 'Medium', 'Low', 'None']
const YES_NO_MAYBE = ['Yes', 'No', 'Maybe']

const initialForm = {
  full_name: '',
  profession: '',
  practice_number: '',
  contacts: '',
  county: '',
  client_types: '',
  num_clients: '',
  key_clients: '',
  coverage_area: '',
  animals_under_influence: '',
  submitted_by: '',
  date: '',
  topics_discussed: '',
  field_challenges: '',
  products_recommended: '',
  competitors_mentioned: '',
  products_introduced: '',
  interest_level: '',
  trial_opportunity: '',
  referral_potential: '',
  next_action: '',
  support_needed: '',
  followup_date: '',
  outcome: '',
  remarks: '',
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
      animals_under_influence:
        record.animals_under_influence != null ? String(record.animals_under_influence) : '',
    }))
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.submitted_by.trim()) e.submitted_by = 'This field is required.'
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
            animals_under_influence:
              form.animals_under_influence !== ''
                ? parseInt(form.animals_under_influence, 10)
                : null,
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
        <label className={styles.label}>
          Full Name <span className={styles.required}>*</span>
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
        <label className={styles.label}>Profession</label>
        <div className={styles.selectWrapper}>
          <select
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
        <label className={styles.label}>Practice Number <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span></label>
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
        <label className={styles.label}>County</label>
        <div className={styles.selectWrapper}>
          <select
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
        <label className={styles.label}>Type of Clients Served</label>
        <div className={styles.selectWrapper}>
          <select
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
        <label className={styles.label}>Key Clients</label>
        <textarea
          className={styles.textarea}
          value={form.key_clients}
          onChange={(e) => set('key_clients', e.target.value)}
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
        <label className={styles.label}>
          Estimated Animals Under Influence <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          type="number"
          className={styles.input}
          value={form.animals_under_influence}
          onChange={(e) => set('animals_under_influence', e.target.value)}
          min="0"
        />
      </div>

      {/* ── VISIT DETAILS ─────────────────────────────────── */}
      <div className={styles.sectionHeading}>Visit Details</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Your Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={`${styles.input} ${errors.submitted_by ? styles.inputError : ''}`}
          value={form.submitted_by}
          onChange={(e) => set('submitted_by', e.target.value)}
        />
        {errors.submitted_by && <p className={styles.errorMsg}>{errors.submitted_by}</p>}
      </div>

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
        <label className={styles.label}>Topics Discussed</label>
        <textarea
          className={styles.textarea}
          value={form.topics_discussed}
          onChange={(e) => set('topics_discussed', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Field Challenges</label>
        <textarea
          className={styles.textarea}
          value={form.field_challenges}
          onChange={(e) => set('field_challenges', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Products Recommended</label>
        <textarea
          className={styles.textarea}
          value={form.products_recommended}
          onChange={(e) => set('products_recommended', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Competitors Mentioned</label>
        <textarea
          className={styles.textarea}
          value={form.competitors_mentioned}
          onChange={(e) => set('competitors_mentioned', e.target.value)}
        />
      </div>

      {/* ── OPPORTUNITY ───────────────────────────────────── */}
      <div className={styles.sectionHeading}>Opportunity</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Products Introduced</label>
        <textarea
          className={styles.textarea}
          value={form.products_introduced}
          onChange={(e) => set('products_introduced', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Interest Level</label>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={form.interest_level}
            onChange={(e) => set('interest_level', e.target.value)}
          >
            <option value="">Select level</option>
            {INTEREST_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Trial Opportunity</label>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={form.trial_opportunity}
            onChange={(e) => set('trial_opportunity', e.target.value)}
          >
            <option value="">Select</option>
            {YES_NO_MAYBE.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Referral Potential</label>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={form.referral_potential}
            onChange={(e) => set('referral_potential', e.target.value)}
          >
            <option value="">Select</option>
            {YES_NO_MAYBE.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── ACTION PLAN ───────────────────────────────────── */}
      <div className={styles.sectionHeading}>Action Plan</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Next Action</label>
        <textarea
          className={styles.textarea}
          value={form.next_action}
          onChange={(e) => set('next_action', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Support Needed</label>
        <textarea
          className={styles.textarea}
          value={form.support_needed}
          onChange={(e) => set('support_needed', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Follow-Up Date</label>
        <input
          type="date"
          className={styles.input}
          value={form.followup_date}
          onChange={(e) => set('followup_date', e.target.value)}
        />
      </div>

      {/* ── OUTCOME ───────────────────────────────────────── */}
      <div className={styles.sectionHeading}>Outcome</div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Outcome</label>
        <textarea
          className={styles.textarea}
          value={form.outcome}
          onChange={(e) => set('outcome', e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Remarks</label>
        <textarea
          className={styles.textarea}
          value={form.remarks}
          onChange={(e) => set('remarks', e.target.value)}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Visit'}
      </button>
    </form>
  )
}
