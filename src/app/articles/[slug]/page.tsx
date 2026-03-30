import Layout from '@/components/Layout';
import Link from 'next/link';
import { getSupabase, BlogPost } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRecommendedProduct } from '@/lib/product-recommendations';

// Revalidate every 60 seconds to show blog post edits
export const revalidate = 60;

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
      <style dangerouslySetInnerHTML={{ __html: `
        body, #page, .s-pagewrap, .s-content, main,
        .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, .dropdown-menu {
            background-color: #ffffff !important;
            color: #111111 !important;
        }
        .s-header__menu-links a, .s-header__social .email {
            color: #111111 !important;
        }
        .s-header__menu-links li.current > a {
            color: #014d4b !important;
        }
        .s-header__social svg path {
            fill: #111111 !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu {
            background-color: #ffffff !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a {
            color: #111111 !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover {
            color: #014d4b !important;
        }
      `}} />
      <main>
        <article className="blog-article">
          {/* Back link */}
          <Link href="/articles" style={{color: '#0d4a3f', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px'}}>
            ← Back
          </Link>

          {/* Title and Meta */}
          <h1 className="blog-post-title">
            {post.title}
          </h1>
          <div style={{display: 'flex', gap: '20px', color: '#9ca3af', fontSize: '14px', marginBottom: '40px'}}>
            <span>{formattedDate}</span>
            <span>By Agrikima Team</span>
          </div>

          {/* Content with product recommendation above Introduction */}
          {(() => {
            const content = post.content || '';
            const product = getRecommendedProduct(
              post.keywords || [],
              post.title
            );

            // Find the first <h2> (usually "Introduction") to insert the product above it
            const firstH2Index = content.indexOf('<h2');
            const beforeIntro = firstH2Index > 0 ? content.slice(0, firstH2Index) : '';
            const fromIntro = firstH2Index > 0 ? content.slice(firstH2Index) : content;

            return (
              <>
                {/* Content before first h2 (if any) */}
                {beforeIntro && (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: beforeIntro }}
                  />
                )}
                
                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    display: 'block',
                    margin: '0 0 40px 0',
                    textDecoration: 'none',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-rec-image"
                  />
                </Link>

                {/* Main blog content (Introduction through Conclusion) */}
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: fromIntro }}
                />

                {/* CTA Button after Conclusion */}
                <section style={{ textAlign: 'center', marginTop: '50px' }}>
                  <Link
                    href="/products"
                    className="btn btn--stroke s-intro__content-btn blog-cta-btn"
                  >
                    Explore Products
                  </Link>
                </section>
              </>
            );
          })()}


        </article>
      </main>
    </Layout>
  );
}

