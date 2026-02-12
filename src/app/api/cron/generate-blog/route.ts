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
    return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';
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
      return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Pick a random image from the results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
      const image = data.results[randomIndex];
      // Use the regular size with auto formatting
      return `${image.urls.regular}&w=1200&fit=crop`;
    }

    return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';
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

    // Get all existing blog post titles to avoid duplicates
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('title');
    const existingTitles = (existingPosts || []).map((p: { title: string }) => p.title.toLowerCase());

    // Get unused topics batch (enough to find a unique one even with many duplicates)
    const { data: unusedTopics, error: topicError } = await supabaseAdmin
      .from('blog_topics')
      .select('*')
      .eq('used', false)
      .order('priority', { ascending: true })
      .limit(200);

    if (topicError || !unusedTopics || unusedTopics.length === 0) {
      return NextResponse.json(
        { error: 'No unused topics available', details: topicError?.message },
        { status: 404 }
      );
    }

    // Find the first topic that doesn't already have a blog post
    let topic = null;
    const topicsToMarkUsed: string[] = [];
    const seenTopicTexts = new Set<string>();

    for (const candidateTopic of unusedTopics) {
      const normalizedTopic = candidateTopic.topic.toLowerCase().trim();

      // Skip duplicate topic text (same topic seeded multiple times)
      if (seenTopicTexts.has(normalizedTopic)) {
        topicsToMarkUsed.push(candidateTopic.id);
        continue;
      }
      seenTopicTexts.add(normalizedTopic);

      // Check if any existing blog post title is similar
      const topicWords = normalizedTopic.split(' ').filter((w: string) => w.length > 3);
      const hasExisting = existingTitles.some((title: string) =>
        // Match if at least 60% of significant words appear in the title
        topicWords.filter((word: string) => title.includes(word)).length >= Math.ceil(topicWords.length * 0.6)
      );

      if (hasExisting) {
        topicsToMarkUsed.push(candidateTopic.id);
        continue;
      }

      topic = candidateTopic;
      break;
    }

    // Bulk mark duplicate/matched topics as used
    if (topicsToMarkUsed.length > 0) {
      await supabaseAdmin
        .from('blog_topics')
        .update({ used: true })
        .in('id', topicsToMarkUsed);
    }

    if (!topic) {
      return NextResponse.json(
        { error: 'No new unique topics available' },
        { status: 404 }
      );
    }

    // Mark ALL rows with the same topic text as used (handles duplicate seeded rows)
    await supabaseAdmin
      .from('blog_topics')
      .update({ used: true })
      .eq('used', false)
      .eq('topic', topic.topic)
      .neq('id', topic.id);

    // Generate blog content using OpenAI
    const generatedContent = await generateBlogPost(
      topic.topic,
      topic.primary_keyword || topic.topic,
      topic.secondary_keywords || []
    );

    // Get a relevant Unsplash image using topic-specific keywords for variety
    const categoryBase: Record<string, string> = {
      'poultry': 'chicken poultry',
      'dairy': 'dairy cow',
      'livestock': 'livestock farm',
      'nutrition': 'animal feed',
      'business': 'african farmer'
    };
    // Use primary keyword + category base for a unique, relevant image per blog
    const topicKeywords = (topic.primary_keyword || topic.topic)
      .split(' ')
      .filter((w: string) => w.length > 3)
      .slice(0, 3)
      .join(' ');
    const imageQuery = `${topicKeywords} ${categoryBase[topic.category] || 'kenya farm'}`;
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

