import Layout from '@/components/Layout';
import { getSupabase, BlogPost } from '@/lib/supabase';
import { Metadata } from 'next';
import ArticlesClient from './ArticlesClient';

// The listing only needs these fields — never `content` or the heavy `embedding`
// vector. Pulling those on every load made the page take ~30s.
export type ListBlogPost = Pick<
  BlogPost,
  'id' | 'slug' | 'title' | 'excerpt' | 'featured_image' | 'keywords' | 'category' | 'published_at'
>;

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

async function getAllBlogPosts(): Promise<ListBlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase not configured');
    return [];
  }

  // Select only the columns the listing needs. Crucially this excludes the heavy
  // `embedding` vector (1536 floats/row) and full `content` HTML — pulling `*`
  // dragged megabytes per load and made the page take ~30s to render.
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, featured_image, keywords, category, published_at')
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

  const isLivestock = (p: ListBlogPost) =>
    p.category?.toLowerCase() === 'livestock' || !p.category;

  const isFeedMilling = (p: ListBlogPost) => {
    const c = p.category?.toLowerCase();
    return c === 'feed milling' || c === 'feed manufacturing';
  };

  const filteredPosts =
    activeCategory === 'All'
      ? allPosts
      : activeCategory.toLowerCase() === 'livestock'
      ? allPosts.filter(isLivestock)
      : activeCategory.toLowerCase() === 'feed milling'
      ? allPosts.filter(isFeedMilling)
      : allPosts.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const counts: Record<string, number> = {
    All: allPosts.length,
    Poultry: allPosts.filter((p) => p.category?.toLowerCase() === 'poultry').length,
    Dairy: allPosts.filter((p) => p.category?.toLowerCase() === 'dairy').length,
    Pigs: allPosts.filter((p) => p.category?.toLowerCase() === 'pigs').length,
    Livestock: allPosts.filter(isLivestock).length,
    Pets: allPosts.filter((p) => p.category?.toLowerCase() === 'pets').length,
    'Feed Milling': allPosts.filter(isFeedMilling).length,
    AMR: allPosts.filter((p) => p.category?.toLowerCase() === 'amr').length,
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

