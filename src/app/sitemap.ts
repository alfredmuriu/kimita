import { MetadataRoute } from 'next';
import { getSupabase } from '@/lib/supabase';

const baseUrl = 'https://www.agrikima.co.ke';

// All product page slugs
const productSlugs = [
  'ade-3',
  'advice',
  'agrifinisher',
  'agrigrower',
  'agrilayer',
  'agripig-sow',
  'agristarter',
  'agritonic',
  'agritoxinilstop',
  'agrivitam',
  'antistrs-300',
  'betaine',
  'bio-gar',
  'biogard-99',
  'choline-chloride',
  'dcp-18',
  'dl-methionine',
  'gonat',
  'immusol',
  'k-digest',
  'lysine',
  'methionine',
  'mix-5',
  'nitritic',
  'optimum-24',
  're-cover',
  'threonine',
  'toxinil',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Static pages ---
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agrikima-academy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/whats-new`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // --- Individual product pages ---
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // --- Dynamic blog posts from Supabase ---
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (posts) {
        blogPages = posts.map((post) => ({
          url: `${baseUrl}/whats-new/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
