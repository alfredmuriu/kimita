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
            src={post.featured_image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2000&auto=format&fit=crop'}
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

          {/* Content with product recommendation inserted before Conclusion */}
          {(() => {
            const content = post.content || '';
            const product = getRecommendedProduct(
              post.keywords || [],
              post.title
            );

            // Find the last <h2> (usually "Conclusion") to insert the product image before it
            const lastH2Index = content.lastIndexOf('<h2');
            const beforeConclusion = lastH2Index > 0 ? content.slice(0, lastH2Index) : content;
            const conclusion = lastH2Index > 0 ? content.slice(lastH2Index) : '';

            return (
              <>
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: beforeConclusion }}
                />

                {/* Recommended Product */}
                <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                  Recommended Product
                </h3>
                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    display: 'block',
                    margin: '40px 0',
                    textDecoration: 'none',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      height: '300px',
                      width: '250px',
                      maxWidth: '400px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      cursor: 'pointer',
                    }}
                  />
                </Link>

                {conclusion && (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: conclusion }}
                  />
                )}
              </>
            );
          })()}


        </article>
      </main>
    </Layout>
  );
}

