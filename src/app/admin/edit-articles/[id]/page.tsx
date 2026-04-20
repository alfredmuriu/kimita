'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { products } from '@/lib/product-recommendations';
import styles from '@/styles/admin.module.css';

export default function AdminEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('published');
  const [featuredImage, setFeaturedImage] = useState('');
  const [recommendedProductSlug, setRecommendedProductSlug] = useState('');

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/admin'); return; }

      supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) { router.replace('/admin/dashboard'); return; }
          setTitle(data.title);
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setKeywords(data.keywords?.join(', ') || '');
          setStatus(data.status);
          setFeaturedImage(data.featured_image || '');
          setRecommendedProductSlug(data.recommended_product_slug || '');
          setLoading(false);
        });
    });
  }, [params.id, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) { setMessage({ type: 'error', text: 'Database not configured' }); setSaving(false); return; }

    const { error } = await supabase
      .from('blog_posts')
      .update({
        title,
        excerpt,
        content,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        status,
        recommended_product_slug: recommendedProductSlug || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Saved' });
    }
    setSaving(false);
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
          <Link href="/admin/dashboard" className={styles.backLink}>← Dashboard</Link>
          <div className={styles.siteHeaderActions}>
            {message && (
              <span className={message.type === 'success' ? styles.statusOk : styles.statusErr}>
                {message.text}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={styles.primaryBtn}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Featured image */}
        {featuredImage && (
          <div className={styles.featuredPreview}>
            <img src={featuredImage} alt="Featured" />
          </div>
        )}

        {/* Title */}
        <div className={styles.fieldGroup}>
          <label htmlFor="post-title" className={styles.label}>Title</label>
          <input
            id="post-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title"
            className={styles.input}
          />
        </div>

        {/* Excerpt */}
        <div className={styles.fieldGroup}>
          <label htmlFor="post-excerpt" className={styles.label}>Excerpt</label>
          <textarea
            id="post-excerpt"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Short SEO description"
            className={styles.textarea}
          />
        </div>

        {/* Keywords + Status */}
        <div className={styles.fieldGroup}>
          <div className={styles.editGrid}>
            <div>
              <label htmlFor="post-keywords" className={styles.label}>Keywords (comma-separated)</label>
              <input
                id="post-keywords"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="poultry, vaccination, broilers"
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="post-status" className={styles.label}>Status</label>
              <select
                id="post-status"
                value={status}
                onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                className={styles.select}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommended product */}
        <div className={styles.fieldGroup}>
          <label htmlFor="post-product" className={styles.label}>Recommended product</label>
          <select
            id="post-product"
            value={recommendedProductSlug}
            onChange={e => setRecommendedProductSlug(e.target.value)}
            className={styles.select}
          >
            <option value="">Auto (from keywords)</option>
            {products.map(p => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Content editor */}
        <div className={styles.fieldGroup}>
          <label htmlFor="post-content" className={styles.label}>Content (HTML) — edit on left, preview on right</label>
          <div className={styles.contentEditorGrid}>
            <textarea
              id="post-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="<h2>Introduction</h2><p>...</p>"
              className={`${styles.textarea} ${styles.codeArea}`}
            />
            <div
              className={`blog-content ${styles.previewPane}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
