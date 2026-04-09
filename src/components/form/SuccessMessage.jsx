'use client'
import styles from '@/styles/form.module.css'

export default function SuccessMessage({ onReset }) {
  return (
    <div className={styles.successWrapper}>
      <div className={styles.successIcon}>✓</div>
      <h2 className={styles.successTitle}>Submitted successfully</h2>
      <p className={styles.successSub}>Your visit has been recorded.</p>
      <button className={styles.resetLink} onClick={onReset}>
        Submit another
      </button>
    </div>
  )
}
