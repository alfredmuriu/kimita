'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from '@/styles/form.module.css'
import { KENYA_COUNTIES } from '@/lib/counties'

const ENTERPRISE_OPTIONS = ['Dairy', 'Poultry', 'Piggery', 'Mixed', 'Other']
const ACTIVITY_OPTIONS = ['Prospecting', 'Follow-Up', 'Complaint', 'Routine', 'Delivery Support']
const OUTCOME_OPTIONS = ['Interested', 'Not Interested', 'Order Placed', 'Needs Follow-Up']
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']
const PROFESSION_OPTIONS = ['Vet', 'AHA', 'Nutritionist', 'Consultant', 'Other']
const CLIENT_TYPE_OPTIONS = ['Farms', 'Feed Miller', 'Distributor', 'Other']

export default function EditRecordPage() {
  const router = useRouter()
  const { type, id } = useParams()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [record, setRecord] = useState(null)
  const [form, setForm] = useState(null)

  useEffect(() => {
    fetch(`/api/form/records/${type}/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setRecord(d.record)

        if (type === 'farm') {
          const v = d.record
          const p = v.farms || {}
          setForm({
            // profile
            farm_name: p.farm_name || '',
            county: p.county || '',
            location: p.location || '',
            enterprise_type: Array.isArray(p.enterprise_type) ? (p.enterprise_type[0] || '') : (p.enterprise_type || ''),
            farm_size: p.farm_size != null ? String(p.farm_size) : '',
            owner_name: p.owner_name || '',
            owner_contacts: p.owner_contacts || '',
            manager_name: p.manager_name || '',
            manager_contacts: p.manager_contacts || '',
            // visit
            date: v.date || '',
            activity: v.activity || '',
            products_currently_used: v.products_currently_used || '',
            potential_demand: v.potential_demand || '',
            outcome: v.outcome || '',
            next_followup_date: v.next_followup_date || '',
            priority: v.priority || '',
          })
        } else {
          const v = d.record
          const p = v.consultants || {}
          setForm({
            // profile
            full_name: p.full_name || '',
            profession: p.profession || '',
            practice_number: p.practice_number || '',
            contacts: p.contacts || '',
            county: p.county || '',
            client_types: Array.isArray(p.client_types) ? (p.client_types[0] || '') : (p.client_types || ''),
            num_clients: p.num_clients != null ? String(p.num_clients) : '',
            key_clients: p.key_clients || '',
            coverage_area: p.coverage_area || '',
            animals_under_influence: p.animals_under_influence != null ? String(p.animals_under_influence) : '',
            // visit
            date: v.date || '',
            topics_discussed: v.topics_discussed || '',
            products_introduced: v.products_introduced || '',
            remarks: v.remarks || '',
          })
        }
      })
      .catch(() => setError('Failed to load record'))
      .finally(() => setLoading(false))
  }, [type, id])

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.date || (type === 'farm' ? !form.farm_name : !form.full_name)) {
      setError('Name and date are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const body = type === 'farm'
        ? {
            farmId: record.farms?.id,
            profile: {
              farm_name: form.farm_name,
              county: form.county,
              location: form.location,
              enterprise_type: form.enterprise_type ? [form.enterprise_type] : [],
              farm_size: form.farm_size !== '' ? parseInt(form.farm_size, 10) : null,
              owner_name: form.owner_name,
              owner_contacts: form.owner_contacts,
              manager_name: form.manager_name,
              manager_contacts: form.manager_contacts,
            },
            visit: {
              date: form.date,
              activity: form.activity,
              products_currently_used: form.products_currently_used,
              potential_demand: form.potential_demand,
              outcome: form.outcome,
              next_followup_date: form.next_followup_date,
              priority: form.priority,
            },
          }
        : {
            consultantId: record.consultants?.id,
            profile: {
              full_name: form.full_name,
              profession: form.profession,
              practice_number: form.practice_number,
              contacts: form.contacts,
              county: form.county,
              client_types: form.client_types ? [form.client_types] : [],
              num_clients: form.num_clients !== '' ? parseInt(form.num_clients, 10) : null,
              key_clients: form.key_clients,
              coverage_area: form.coverage_area,
              animals_under_influence: form.animals_under_influence !== '' ? parseInt(form.animals_under_influence, 10) : null,
            },
            visit: {
              date: form.date,
              topics_discussed: form.topics_discussed,
              products_introduced: form.products_introduced,
              remarks: form.remarks,
            },
          }

      const res = await fetch(`/api/form/records/${type}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Save failed')
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const siteHeader = (backLabel = '← Back') => (
    <div className={styles.siteHeader}>
      <div className={styles.siteHeaderInner}>
        <img src="/logo.png" alt="Agrikima" className={styles.siteHeaderImg} />
        <div className={styles.siteHeaderActions}>
          <button type="button" className={styles.downloadBtn} onClick={() => router.push('/form/records')}>
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div className={styles.page}>
      {siteHeader()}
      <div className={styles.container}>
        <p style={{ color: '#888', fontSize: 14, marginTop: 40 }}>Loading…</p>
      </div>
    </div>
  )

  if (saved) return (
    <div className={styles.page}>
      {siteHeader('← Back to Records')}
      <div className={styles.container}>
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#2D6A4F', marginBottom: 8 }}>Record updated</div>
        </div>
      </div>
    </div>
  )

  if (!form) return (
    <div className={styles.page}>
      {siteHeader()}
      <div className={styles.container}>
        <p style={{ color: '#dc2626', fontSize: 14, marginTop: 40 }}>{error || 'Record not found'}</p>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      {siteHeader()}
      <div className={styles.container}>

        <p style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a', marginBottom: 8 }}>
          Edit {type === 'farm' ? 'Farm Visit' : 'Consultant Visit'}
        </p>

        {error && <p className={styles.errorMsg} style={{ marginTop: 8 }}>{error}</p>}

        <form className={styles.form} onSubmit={handleSave} noValidate>

          {type === 'farm' ? (
            <>
              <div className={styles.sectionHeading}>Farm Profile</div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Name of Farm / Ranch / Institution <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} value={form.farm_name} onChange={(e) => set('farm_name', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>County</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.county} onChange={(e) => set('county', e.target.value)}>
                    <option value="">Select county</option>
                    {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Location</label>
                <input type="text" className={styles.input} value={form.location} onChange={(e) => set('location', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Type of Enterprise</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.enterprise_type} onChange={(e) => set('enterprise_type', e.target.value)}>
                    <option value="">Select enterprise type</option>
                    {ENTERPRISE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Farm Size / Number of Animals</label>
                <input type="number" className={styles.input} value={form.farm_size} onChange={(e) => set('farm_size', e.target.value)} min="0" />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Name of Owner</label>
                <input type="text" className={styles.input} value={form.owner_name} onChange={(e) => set('owner_name', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Owner Contacts</label>
                <input type="tel" className={styles.input} value={form.owner_contacts} onChange={(e) => set('owner_contacts', e.target.value)} placeholder="+254" />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Name of Manager / Decision Maker</label>
                <input type="text" className={styles.input} value={form.manager_name} onChange={(e) => set('manager_name', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Manager Contacts</label>
                <input type="tel" className={styles.input} value={form.manager_contacts} onChange={(e) => set('manager_contacts', e.target.value)} placeholder="+254" />
              </div>

              <div className={styles.sectionHeading}>Visit Details</div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Date <span className={styles.required}>*</span></label>
                <input type="date" className={styles.input} value={form.date} onChange={(e) => set('date', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Activity Type</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.activity} onChange={(e) => set('activity', e.target.value)}>
                    <option value="">Select activity</option>
                    {ACTIVITY_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.sectionHeading}>Insights</div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Products Currently Used</label>
                <textarea className={styles.textarea} value={form.products_currently_used} onChange={(e) => set('products_currently_used', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Potential Demand</label>
                <textarea className={styles.textarea} value={form.potential_demand} onChange={(e) => set('potential_demand', e.target.value)} />
              </div>

              <div className={styles.sectionHeading}>Outcome & Follow-Up</div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Outcome</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.outcome} onChange={(e) => set('outcome', e.target.value)}>
                    <option value="">Select outcome</option>
                    {OUTCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Next Follow-Up Date</label>
                <input type="date" className={styles.input} value={form.next_followup_date} onChange={(e) => set('next_followup_date', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Priority</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                    <option value="">Select priority</option>
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.sectionHeading}>Consultant Profile</div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Profession</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.profession} onChange={(e) => set('profession', e.target.value)}>
                    <option value="">Select profession</option>
                    {PROFESSION_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Name of Consultant / VET / AHA <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Practice Number</label>
                <input type="text" className={styles.input} value={form.practice_number} onChange={(e) => set('practice_number', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Contacts</label>
                <input type="tel" className={styles.input} value={form.contacts} onChange={(e) => set('contacts', e.target.value)} placeholder="+254" />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Type of Clients Served</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.client_types} onChange={(e) => set('client_types', e.target.value)}>
                    <option value="">Select client type</option>
                    {CLIENT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Key Clients</label>
                <textarea className={styles.textarea} value={form.key_clients} onChange={(e) => set('key_clients', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Number of Clients</label>
                <input type="number" className={styles.input} value={form.num_clients} onChange={(e) => set('num_clients', e.target.value)} min="0" />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Coverage Area</label>
                <input type="text" className={styles.input} value={form.coverage_area} onChange={(e) => set('coverage_area', e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Estimated Animals Under Influence</label>
                <input type="number" className={styles.input} value={form.animals_under_influence} onChange={(e) => set('animals_under_influence', e.target.value)} min="0" />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>County</label>
                <div className={styles.selectWrapper}>
                  <select size={1} className={styles.select} value={form.county} onChange={(e) => set('county', e.target.value)}>
                    <option value="">Select county</option>
                    {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.sectionHeading}>Visit Details</div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Date <span className={styles.required}>*</span></label>
                <input type="date" className={styles.input} value={form.date} onChange={(e) => set('date', e.target.value)} />
              </div>

              <div className={styles.sectionHeading}>Technical Discussion</div>

              <div className={styles.fieldGroup}>
                <textarea className={styles.textarea} style={{ minHeight: 100 }} value={form.topics_discussed} onChange={(e) => set('topics_discussed', e.target.value)} placeholder="Topics discussed, field challenges, products recommended, competitors mentioned…" />
              </div>

              <div className={styles.sectionHeading}>Opportunity</div>

              <div className={styles.fieldGroup}>
                <textarea className={styles.textarea} style={{ minHeight: 100 }} value={form.products_introduced} onChange={(e) => set('products_introduced', e.target.value)} placeholder="Products introduced, interest level, trial opportunity, referral potential…" />
              </div>

              <div className={styles.sectionHeading}>Action and Remarks</div>

              <div className={styles.fieldGroup}>
                <textarea className={styles.textarea} style={{ minHeight: 100 }} value={form.remarks} onChange={(e) => set('remarks', e.target.value)} placeholder="Next action, support needed, follow-up date, outcome, remarks…" />
              </div>
            </>
          )}

          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
