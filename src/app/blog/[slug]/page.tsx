import Layout from '@/components/Layout';
import Link from 'next/link';
import { getSupabase, BlogPost } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRecommendedProduct } from '@/lib/product-recommendations';

interface PageProps {
  params: { slug: string };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Agrikima Blog`,
    description: post.excerpt || undefined,
    keywords: post.keywords?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image ? [post.featured_image] : undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <Layout>
      <main>
        <article style={{maxWidth: '800px', margin: '0 auto', padding: '150px 20px 60px'}}>
          {/* Back link */}
          <Link href="/blog" style={{color: '#0d4a3f', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px'}}>
            ← Back
          </Link>

          {/* Featured Image */}
          <img
            src={post.featured_image || 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=2000&auto=format&fit=crop'}
            alt={post.title}
            style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '30px'}}
          />

          {/* Title and Meta */}
          <h1 style={{fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', lineHeight: '1.2'}}>
            {post.title}
          </h1>
          <div style={{display: 'flex', gap: '20px', color: '#9ca3af', fontSize: '14px', marginBottom: '40px'}}>
            <span>{formattedDate}</span>
            <span>By Agrikima Team</span>
          </div>

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Recommended Product */}
          {(() => {
            const product = getRecommendedProduct(
              post.keywords || [],
              post.title
            );
            return (
              <Link
                href={`/products/${product.slug}`}
                style={{
                  display: 'block',
                  marginTop: '50px',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                />
              </Link>
            );
          })()}

          {/* CTA Section */}
          <div style={{
            marginTop: '60px',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            textAlign: 'center'
          }}>
            <h3 style={{fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '16px'}}>
              Need Quality Veterinary Products?
            </h3>
            <p style={{color: '#9ca3af', fontSize: '16px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px'}}>
              Agrikima offers a wide range of veterinary medicines, feeds, and farm equipment to keep your livestock healthy and productive.
            </p>
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link
                href="/products"
                className="btn btn--primary"
                style={{fontSize: '14px', padding: '14px 28px'}}
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="btn btn--stroke"
                style={{fontSize: '14px', padding: '14px 28px'}}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Related Topics CTA */}
          <div style={{
            marginTop: '40px',
            padding: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h4 style={{fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px'}}>
                Want to learn more?
              </h4>
              <p style={{color: '#9ca3af', fontSize: '14px', margin: 0}}>
                Explore more articles on poultry health, livestock care, and farming tips.
              </p>
            </div>
            <Link
              href="/blog"
              className="btn btn--stroke"
              style={{fontSize: '12px', padding: '12px 24px'}}
            >
              View All Articles
            </Link>
          </div>
        </article>
      </main>
    </Layout>
  );
}

