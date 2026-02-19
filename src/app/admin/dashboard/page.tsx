'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase, BlogPost } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/admin'); return; }

      supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setPosts(data || []);
          setLoading(false);
        });
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
      router.push('/admin');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
        <p style={{ color: '#9ca3af' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: '#fff' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#1f2937', borderBottom: '1px solid #374151' }}>
        <img src="/logo.png" alt="Agrikima" style={{ height: '40px', marginTop:'20px' }} />
        <button onClick={handleLogout} style={{
          padding: '8px 16px', background: 'transparent', border: '1px solid #4b5563',
          borderRadius: '6px', color: '#9ca3af', fontSize: '10px', cursor: 'pointer', 
          justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center', height: '45px'
        }}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: '16px', color: '#9ca3af', fontWeight: '500', marginBottom: '16px' }}>
          All Posts ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '60px 0' }}>No blog posts yet.</p>
        ) : (
          <div style={{ background: '#1f2937', borderRadius: '2px', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 130px 70px',
              padding: '12px 20px', background: '#374151', fontSize: '12px',
              fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              <span>Title</span>
              <span>Status</span>
              <span>Published</span>
              <span>Action</span>
            </div>

            {/* Rows */}
            {posts.map((post) => (
              <div key={post.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 100px 130px 70px',
                padding: '14px 20px', borderTop: '1px solid #374151', alignItems: 'center', fontSize: '14px',
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '16px', color: '#e5e7eb' }}>
                  {post.title}
                </span>
                <span>
                  <span style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                    background: post.status === 'published' ? '#064e3b' : '#7c2d12',
                    color: post.status === 'published' ? '#6ee7b7' : '#fdba74',
                  }}>
                    {post.status}
                  </span>
                </span>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
                </span>
                <Link href={`/admin/edit/${post.id}`} style={{
                  color: '#60a5fa', textDecoration: 'none', fontSize: '13px', fontWeight: '500',
                }}>
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

