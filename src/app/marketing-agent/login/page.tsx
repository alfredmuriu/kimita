'use client'

import { useState } from 'react'
import s from '@/styles/agent.module.css'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/marketing/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.success) {
        window.location.href = '/marketing-agent'
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
    <div className={s.loginPage}>
      <div className={s.loginCard}>
        <div className={s.loginLogoWrap}>
          <div className={s.loginLogo}>A</div>
          <div className={s.loginTitle}>Marketing Agent</div>
          <div className={s.loginSub}>Agrikima internal tool</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={s.loginFieldWrap}>
            <label className={s.loginLabel}>Password</label>
            <input
              type="password"
              className={`${s.loginInput} ${error ? s.loginInputError : ''}`}
              placeholder="Enter access password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className={s.loginError}>{error}</div>}
          </div>

          <button
            type="submit"
            className={s.loginBtn}
            disabled={loading || !password.trim()}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
