'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'
import FarmVisitForm from '@/components/form/FarmVisitForm'
import ConsultantForm from '@/components/form/ConsultantForm'
import DownloadModal from '@/components/form/DownloadModal'

export default function FormPage() {
  const [formType, setFormType] = useState('farm')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ── Top bar ──────────────────────────────────────── */}
        <div className={styles.topBar}>
          <div className={styles.toggleGroup}>
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
              Consultant / Vet / AHA Visit
            </button>
          </div>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={() => setShowModal(true)}
          >
            Download Excel
          </button>
        </div>

        {/* ── Form ─────────────────────────────────────────── */}
        {formType === 'farm' ? (
          <FarmVisitForm key="farm" />
        ) : (
          <ConsultantForm key="consultant" />
        )}
      </div>

      {/* ── Download modal ───────────────────────────────── */}
      {showModal && <DownloadModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
