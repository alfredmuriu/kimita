'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'

export default function FormLoginPage() {
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [customName, setCustomName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isE000 = code.toUpperCase() === 'E000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim() || !password.trim()) return
    if (isE000 && !customName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/form/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password, customName }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = '/form'
      } else {
        setError(data.error || 'Invalid code or password')
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
            <div style={{ fontSize: 13, color: '#888' }}>Field Portal — Sign in</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Rep Code</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. E001"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError('') }}
                autoFocus
                autoCapitalize="characters"
              />
            </div>

            {isE000 && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Your Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter your full name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
              />
            </div>

            {error && (
              <div className={styles.errorMsg} style={{ marginTop: 8 }}>{error}</div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !code.trim() || !password.trim() || (isE000 && !customName.trim())}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <a href="/form/admin/login" style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>
              Admin access →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
