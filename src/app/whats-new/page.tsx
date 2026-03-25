import Layout from '@/components/Layout';
import { getSupabase, BlogPost } from '@/lib/supabase';
import BlogCard from './BlogCard';

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

  return (
    <Layout>
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

