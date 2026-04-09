'use client'
import styles from '@/styles/form.module.css'

export default function MultiSelect({ options, value = [], onChange }) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className={styles.pillGroup}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`${styles.pill} ${value.includes(option) ? styles.pillSelected : ''}`}
          onClick={() => toggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
