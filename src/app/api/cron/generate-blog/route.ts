import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateBlogPost } from '@/lib/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Prevent build-time evaluation
export const maxDuration = 60; // Allow up to 60 seconds for AI generation

// Fetch a relevant image from Unsplash based on search query
async function getUnsplashImage(query: string): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.log('No Unsplash API key, using default image');
    return 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=1200&auto=format&fit=crop';
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=1200&auto=format&fit=crop';
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Pick a random image from the results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
      const image = data.results[randomIndex];
      // Use the regular size with auto formatting
      return `${image.urls.regular}&w=1200&fit=crop`;
    }

    return 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=1200&auto=format&fit=crop';
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=1200&auto=format&fit=crop';
  }
}

export async function GET(request: NextRequest) {
  try {
    // Auth check - supports both header and query param
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get('secret');

    const isAuthorized =
      authHeader === `Bearer ${process.env.CRON_SECRET}` ||
      secretParam === process.env.CRON_SECRET;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get the next unused topic
    const { data: topic, error: topicError } = await supabaseAdmin
      .from('blog_topics')
      .select('*')
      .eq('used', false)
      .order('priority', { ascending: true })
      .limit(1)
      .single();

    if (topicError || !topic) {
      return NextResponse.json(
        { error: 'No unused topics available', details: topicError?.message },
        { status: 404 }
      );
    }

    // Generate blog content using OpenAI
    const generatedContent = await generateBlogPost(
      topic.topic,
      topic.primary_keyword || topic.topic,
      topic.secondary_keywords || []
    );

    // Get a relevant Unsplash image based on category and topic
    const searchQueries: Record<string, string> = {
      'poultry': 'chicken farm poultry',
      'dairy': 'dairy cow farm milk',
      'livestock': 'livestock farm animals',
      'nutrition': 'animal feed farm',
      'business': 'african farmer agriculture'
    };
    const imageQuery = searchQueries[topic.category] || 'kenya farm agriculture';
    const featuredImage = await getUnsplashImage(imageQuery);

    // Mark the topic as used first to prevent retrying the same topic on failure
    await supabaseAdmin
      .from('blog_topics')
      .update({ used: true })
      .eq('id', topic.id);

    // Save the blog post to database, handle duplicate slugs
    let slug = generatedContent.slug;
    let post = null;
    let postError = null;

    // Try original slug first, then with a suffix if duplicate
    for (let attempt = 0; attempt < 3; attempt++) {
      const trySlug = attempt === 0 ? slug : `${slug}-${Date.now()}`;
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .insert({
          slug: trySlug,
          title: generatedContent.title,
          excerpt: generatedContent.excerpt,
          content: generatedContent.content,
          featured_image: featuredImage,
          keywords: generatedContent.keywords,
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error) {
        post = data;
        postError = null;
        break;
      }

      if (error.message.includes('duplicate key')) {
        postError = error;
        continue;
      }

      postError = error;
      break;
    }

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Failed to save blog post', details: postError?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post generated and published',
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

