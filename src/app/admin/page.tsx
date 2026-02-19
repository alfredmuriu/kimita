'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already logged in
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
        <p style={{ color: '#9ca3af' }}>Loading...</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '45px', padding: '2px 4px', background: '#1f2937', border: '1px solid #374151',
    borderRadius: '4px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
      <div style={{
        borderRadius: '4px', border: '1px solid #374151', padding: '32px 24px',
        maxWidth: '360px', width: '100%', background: '#1a2332',
      }}>
        {/* Lock icon */}
        <div style={{
          margin: '0 auto 24px', display: 'flex', height: '64px', width: '64px',
          alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(13,74,63,0.2)',
        }}>
          <svg width="32" height="32" fill="none" stroke="#0d4a3f" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '20px', fontWeight: '700', color: '#fff' }}>
          Admin
        </h3>

        {error && (
          <div style={{ background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#fca5a5', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '2px', fontSize: '14px', fontWeight: '500', color: '#9ca3af' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '2px', fontSize: '14px', fontWeight: '500', color: '#9ca3af' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100px',height: '45px', borderRadius: '4px', padding: '5px 8px', fontSize: '10px', fontWeight: '600',
            color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#374151' : '#0d4a3f', transition: 'background 0.3s', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

