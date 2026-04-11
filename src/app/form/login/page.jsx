'use client'
import { useState } from 'react'
import styles from '@/styles/form.module.css'

export default function FormLoginPage() {
  const [mode, setMode] = useState('rep') // 'rep' | 'guest'
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [guestName, setGuestName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRepLogin = async (e) => {
    e.preventDefault()
    if (!code.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/form/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
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

  const handleGuestLogin = async (e) => {
    e.preventDefault()
    if (!guestName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/form/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest: true, name: guestName }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = '/form'
      } else {
        setError(data.error || 'Something went wrong')
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
            <img src="/logo.png" alt="Agrikima" style={{ height: 32, marginBottom: 8, objectFit: 'contain', display: 'inline-block' }} />
            <div style={{ fontSize: 13, color: '#888' }}>Field Portal — Sign in</div>
          </div>

          {/* Mode toggle */}
          <div className={styles.toggleGroup} style={{ marginBottom: 28, justifyContent: 'center' }}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${mode === 'rep' ? styles.active : ''}`}
              style={{ borderRadius: 8 }}
              onClick={() => { setMode('rep'); setError('') }}
            >
              Rep Login
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${mode === 'guest' ? styles.active : ''}`}
              style={{ borderRadius: 8 }}
              onClick={() => { setMode('guest'); setError('') }}
            >
              Continue as Guest
            </button>
          </div>

          {mode === 'rep' ? (
            <form onSubmit={handleRepLogin}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Rep Code</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. E001"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError('') }}
                  autoCapitalize="characters"
                  autoFocus
                />
              </div>
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
              {error && <div className={styles.errorMsg} style={{ marginTop: 8 }}>{error}</div>}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || !code.trim() || !password.trim()}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleGuestLogin}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Your Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter your full name"
                  value={guestName}
                  onChange={(e) => { setGuestName(e.target.value); setError('') }}
                  autoFocus
                />
              </div>
              {error && <div className={styles.errorMsg} style={{ marginTop: 8 }}>{error}</div>}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || !guestName.trim()}
              >
                {loading ? 'Signing in...' : 'Continue'}
              </button>
            </form>
          )}

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
