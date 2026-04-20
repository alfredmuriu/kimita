'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import styles from '@/styles/admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/admin/dashboard');
      else setChecking(false);
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError('Database not configured');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
  };

  if (checking) {
    return (
      <div className={`${styles.page} ${styles.loginShell}`}>
        <p style={{ color: '#666' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${styles.loginShell}`}>
      <div className={styles.loginCard}>
        <div className={styles.loginIconWrap}>
          <svg width="28" height="28" fill="none" stroke="#2D6A4F" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 className={styles.loginTitle}>Admin sign in</h3>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.fieldGroup}>
            <label htmlFor="admin-email" className={styles.label}>Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="admin-password" className={styles.label}>Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryBtn}
            style={{ width: '100%', marginTop: 24 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
