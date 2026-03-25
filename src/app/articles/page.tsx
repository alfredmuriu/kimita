import Layout from '@/components/Layout';
import { getSupabase, BlogPost } from '@/lib/supabase';
import BlogCard from './BlogCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What\'s New | Agricultural Insights & Farming Tips | Agrikima',
  description: 'Read the latest agricultural insights, farming tips, and poultry health articles from the experts at Agrikima. Stay updated on best practices for African farmers.',
  keywords: 'Agrikima blog, agricultural news Kenya, farming tips Africa, poultry health articles, livestock insights',
  openGraph: {
    title: 'What\'s New | Agricultural Insights & Farming Tips | Agrikima',
    description: 'Read the latest agricultural insights, farming tips, and poultry health articles from the experts at Agrikima. Stay updated on best practices for African farmers.',
    url: 'https://www.agrikima.co.ke/articles',
    siteName: 'Agrikima',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Agrikima Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

// Revalidate every 60 seconds to show new blog posts
export const revalidate = 60;

async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export default async function Blog() {
  const posts = await getBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "What's New | Agrikima Blog",
    "url": "https://www.agrikima.co.ke/articles",
    "description": "Agricultural insights and farming tips for African farmers.",
    "publisher": {
      "@type": "Organization",
      "name": "Agrikima",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.agrikima.co.ke/favicon.png"
      }
    }
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <h1 className="s-intro__content-title page-title">
          What's New
        </h1>
        <p className="page-subtitle">
          Agricultural insights and tips for farmers
        </p>

        <div className="blog-listing">
          {posts.length === 0 ? (
            <p style={{color: '#666', fontSize: '16px'}}>
              No blog posts yet. Check back soon for agricultural tips and insights!
            </p>
          ) : (
            posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>
    </Layout>
  );
}

