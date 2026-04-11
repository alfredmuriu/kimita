'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/form.module.css'
import FarmVisitForm from '@/components/form/FarmVisitForm'
import ConsultantForm from '@/components/form/ConsultantForm'

export default function FormPage() {
  const [formType, setFormType] = useState('farm')
  const [rep, setRep] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/form/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.rep) setRep(d.rep) })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/form/auth', { method: 'DELETE' })
    window.location.href = '/form/login'
  }

  return (
    <div className={styles.page}>
      {/* ── Sticky header ── */}
      <div className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <img src="/logo.png" alt="Agrikima" className={styles.siteHeaderImg} />
          <div className={styles.siteHeaderActions}>
            {rep && (
              <span className={styles.returningBadge} style={{ marginTop: 0 }}>
                {rep.code} — {rep.name}
              </span>
            )}
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={() => router.push('/form/records')}
            >
              My Records
            </button>
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={handleLogout}
              style={{ color: '#888', borderColor: '#ddd' }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>

          {/* ── Toggle ── */}
          <div className={styles.toggleGroup} style={{ marginBottom: 28 }}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${formType === 'farm' ? styles.active : ''}`}
              onClick={() => setFormType('farm')}
            >
              Farm Visit
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${formType === 'consultant' ? styles.active : ''}`}
              onClick={() => setFormType('consultant')}
            >
              Consultant Visit
            </button>
          </div>

          {/* ── Form ── */}
          {formType === 'farm'
            ? <FarmVisitForm key="farm" rep={rep} />
            : <ConsultantForm key="consultant" rep={rep} />
          }
      </div>
    </div>
  )
}
