'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/form/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = '/form/admin'
      } else {
        setError('Incorrect password')
      }
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page} style={{ padding: '0 16px 72px' }}>
      <div className={styles.container}>
        <div style={{ maxWidth: 360, margin: '0 auto', paddingTop: 60 }}>

          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <img src="/logo.png" alt="Agrikima" style={{ height: 32, marginBottom: 8, objectFit: 'contain' }} />
            <div style={{ fontSize: 13, color: '#888' }}>Admin — Sign in</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Admin password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                autoFocus
              />
            </div>
            {error && <div className={styles.errorMsg} style={{ marginTop: 8 }}>{error}</div>}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !password.trim()}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <a href="/form/login" style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>
              ← Rep login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
