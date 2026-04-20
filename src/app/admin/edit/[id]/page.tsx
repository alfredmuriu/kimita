'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase, BlogPost } from '@/lib/supabase';
import { products } from '@/lib/product-recommendations';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#1f2937', border: '1px solid #374151',
  borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
};

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
      setMessage({ type: 'success', text: 'Post saved successfully!' });
    }
    setSaving(false);
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
      {/* Sticky top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px',
        background: '#1f2937', borderBottom: '1px solid #374151', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link href="/admin/dashboard" style={{ color: '#0d4a3f', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {message && (
            <span style={{ fontSize: '13px', color: message.type === 'success' ? '#6ee7b7' : '#fca5a5' }}>
              {message.text}
            </span>
          )}
          <button onClick={handleSave} disabled={saving} style={{
            padding: '8px 20px', background: saving ? '#374151' : '#0d4a3f', color: '#fff',
            border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer', justifyContent: 'center', textAlign: 'center', display: 'inline-flex', alignItems: 'center', height: '45px'
          }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* FORM — continued below */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Featured image preview */}
        {featuredImage && (
          <div style={{ marginBottom: '20px', borderRadius: '0px', overflow: 'hidden', maxHeight: '200px' }}>
            <img src={featuredImage} alt="Featured" style={{ width: '30%', height: '200px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600', width:'50%' }} />
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical', width:'50%' }} />
        </div>

        {/* Keywords + Status row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '4px'}}>Keywords</label>
            <input value={keywords} onChange={e => setKeywords(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ width: '240px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>Recommended product</label>
            <select
              value={recommendedProductSlug}
              onChange={e => setRecommendedProductSlug(e.target.value)}
              style={inputStyle}
            >
              <option value="">Auto (from keywords)</option>
              {products.map(p => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
          <div style={{ width: '160px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')} style={inputStyle}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Content editor + preview */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>Content (HTML) — edit on left, preview on right</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{
                ...inputStyle, minHeight: '600px', fontFamily: 'monospace', fontSize: '13px',
                lineHeight: '1.6', resize: 'vertical',
              }}
            />
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                padding: '14px', background: '#1f2937', border: '1px solid #374151',
                borderRadius: '8px', overflow: 'auto', maxHeight: '600px', fontSize: '15px', lineHeight: '1.7',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

