import Layout from '@/components/Layout';
import Link from 'next/link';
import { getSupabase, BlogPost } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRecommendedProduct } from '@/lib/product-recommendations';
import { getRelatedVideos } from '@/lib/related-videos';
import ArticleContactForm from '@/components/ArticleContactForm';

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

  const relatedVideos = getRelatedVideos(post.keywords || [], post.title);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const wordCount = (post.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.min(4, Math.max(1, Math.round(wordCount / 200)));

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
        .s-header__menu-toggle span, .s-header__menu-toggle span::before, .s-header__menu-toggle span::after { background-color: #111111 !important; }
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
            <span>{readMinutes} min read</span>
          </div>

          {/* Content with product recommendation above Introduction */}
          {(() => {
            const content = post.content || '';
            const product = getRecommendedProduct(
              post.keywords || [],
              post.title,
              post.category,
              post.recommended_product_slug,
              post.slug
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

                {/* Inline contact form for the team */}
                <ArticleContactForm />

                {/* Sources — first link visible, rest behind a "Read more" disclosure. */}
                {post.sources && post.sources.length > 0 && (
                  <div style={{ marginTop: '50px', fontSize: '14px', color: '#444' }}>
                    <div style={{ fontWeight: 600, color: '#0d4a3f', marginBottom: '8px' }}>
                      Sources
                    </div>
                    <ol style={{ margin: 0, paddingLeft: '20px' }}>
                      <li style={{ marginBottom: '6px' }}>
                        <a
                          href={post.sources[0].url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          style={{ color: '#0d4a3f', textDecoration: 'underline' }}
                        >
                          {post.sources[0].title}{post.sources[0].publisher ? ` — ${post.sources[0].publisher}` : ''}
                        </a>
                      </li>
                    </ol>
                    {post.sources.length > 1 && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{
                          cursor: 'pointer',
                          color: '#0d4a3f',
                          fontWeight: 600,
                          listStyle: 'none',
                          userSelect: 'none',
                        }}>
                          Read more
                        </summary>
                        <ol start={2} style={{ marginTop: '8px', paddingLeft: '20px' }}>
                          {post.sources.slice(1).map((s, i) => (
                            <li key={i} style={{ marginBottom: '6px' }}>
                              <a
                                href={s.url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                style={{ color: '#0d4a3f', textDecoration: 'underline' }}
                              >
                                {s.title}{s.publisher ? ` — ${s.publisher}` : ''}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </div>
                )}

                {/* Related Academy Videos */}
                {relatedVideos.length > 0 && (
                  <section className="related-videos-section">
                    <p className="related-videos-pretitle">Agrikima Academy</p>
                    <h2 className="related-videos-title">Watch related videos</h2>
                    <div className="related-videos-grid">
                      {relatedVideos.map(video => (
                        <a key={video.id} href={`/agrikima-academy?category=${video.anchor}`} className="related-video-card">
                          <div className="related-video-thumb">
                            <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} />
                            <div className="related-video-play">
                              <div className="related-video-play-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                          </div>
                          <div className="related-video-body">
                            <p>{video.title}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="related-videos-footer">
                      <Link href="/agrikima-academy">Browse all videos →</Link>
                    </div>
                  </section>
                )}

                {/* Auto-generated article video (Veo slideshow + voiceover) at the
                    bottom of the article. Shows the featured image as poster until
                    the visitor presses play — browsers block autoplay-with-sound,
                    and this video has narration. */}
                {post.video_url && (
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster={post.featured_image || undefined}
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px',
                      marginTop: '50px',
                      backgroundColor: '#000',
                    }}
                  >
                    <source src={post.video_url} type="video/mp4" />
                  </video>
                )}
              </>
            );
          })()}


        </article>
      </main>
    </Layout>
  );
}

