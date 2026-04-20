'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase, BlogPost } from '@/lib/supabase';
import styles from '@/styles/admin.module.css';

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
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Sticky header */}
      <div className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <img src="/logo.png" alt="Agrikima" className={styles.siteHeaderImg} />
          <div className={styles.siteHeaderActions}>
            <button type="button" onClick={handleLogout} className={styles.ghostBtn}>
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <h2 className={styles.pageTitle}>All posts ({posts.length})</h2>

        {posts.length === 0 ? (
          <div className={styles.tableWrap}>
            <p className={styles.emptyState}>No blog posts yet.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <div className={styles.tableHead}>
              <span>Title</span>
              <span>Status</span>
              <span>Published</span>
              <span>Action</span>
            </div>

            {posts.map((post) => (
              <div key={post.id} className={styles.tableRow}>
                <span className={styles.titleCell}>{post.title}</span>
                <span>
                  <span
                    className={`${styles.statusPill} ${
                      post.status === 'published' ? styles.statusPublished : styles.statusDraft
                    }`}
                  >
                    {post.status}
                  </span>
                </span>
                <span className={styles.dateCell}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}
                </span>
                <Link href={`/admin/edit-articles/${post.id}`} className={styles.editLink}>
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
