import Layout from '@/components/Layout';
import { getSupabase, BlogPost } from '@/lib/supabase';
import { Metadata } from 'next';
import ArticlesClient from './ArticlesClient';

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

async function getAllBlogPosts(): Promise<BlogPost[]> {
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

export default async function Blog({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = await getAllBlogPosts();
  const activeCategory = searchParams.category || 'All';

  const filteredPosts =
    activeCategory === 'All'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const counts: Record<string, number> = {
    All: allPosts.length,
    Poultry: allPosts.filter((p) => p.category === 'Poultry').length,
    Dairy: allPosts.filter((p) => p.category === 'Dairy').length,
    Pigs: allPosts.filter((p) => p.category === 'Pigs').length,
  };

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
        <ArticlesClient
          posts={filteredPosts}
          activeCategory={activeCategory}
          counts={counts}
        />
      </main>
    </Layout>
  );
}

