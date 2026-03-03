import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateBlogPost, generateBlogImage } from '@/lib/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Prevent build-time evaluation
export const maxDuration = 120; // Allow up to 120 seconds for AI generation + image generation

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';

// Stop words to ignore when comparing topic similarity
const STOP_WORDS = new Set([
  'how', 'what', 'when', 'why', 'the', 'and', 'for', 'your', 'with',
  'from', 'that', 'this', 'best', 'guide', 'complete', 'tips', 'ways',
  'common', 'every', 'them', 'avoid', 'treat', 'manage', 'prevent',
  'improve', 'signs', 'causes', 'should', 'about', 'into', 'make',
  'keep', 'start', 'raise', 'build', 'write', 'set',
]);

/**
 * Multi-signal similarity check to catch duplicate/overlapping topics.
 * Returns true if the candidate topic is too similar to any existing content.
 */
function isSimilarTopic(
  candidateTopic: string,
  existingTitles: string[],
  usedTopicTexts: string[],
  existingExcerpts: string[],
  existingKeywordSets: string[][]
): boolean {
  const normalized = candidateTopic.toLowerCase().trim();
  const topicWords = normalized
    .split(/\s+/)
    .filter((w: string) => w.length > 2 && !STOP_WORDS.has(w));

  if (topicWords.length === 0) return false;

  // Check 1: Word overlap against titles, used topics, and excerpts (40% threshold)
  const allTexts = [...existingTitles, ...usedTopicTexts, ...existingExcerpts];
  for (const text of allTexts) {
    const matchCount = topicWords.filter((word: string) => text.includes(word)).length;
    if (matchCount >= Math.ceil(topicWords.length * 0.4)) {
      return true;
    }
  }

  // Check 2: Keyword overlap with existing posts (≥2 matching keywords)
  for (const kwSet of existingKeywordSets) {
    const matchingKws = topicWords.filter((word: string) =>
      kwSet.some((kw: string) => kw.includes(word))
    );
    if (matchingKws.length >= 2) {
      return true;
    }
  }

  return false;
}

// Generate image with DALL·E 3, download it, upload to Supabase Storage, return permanent URL
async function generateAndUploadImage(
  topic: string,
  keywords: string[],
  slug: string,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>
): Promise<string> {
  if (!supabaseAdmin) return DEFAULT_IMAGE;

  try {
    // 1. Generate image with DALL·E 3
    const tempUrl = await generateBlogImage(topic, keywords);

    // 2. Download the image from the temporary DALL·E URL
    const imageResponse = await fetch(tempUrl);
    if (!imageResponse.ok) {
      console.error('Failed to download DALL·E image:', imageResponse.status);
      return DEFAULT_IMAGE;
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const fileName = `${slug}-${Date.now()}.png`;

    // 3. Upload to Supabase Storage (blog-images bucket)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError.message);
      return DEFAULT_IMAGE;
    }

    // 4. Get the permanent public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error generating/uploading blog image:', error);
    return DEFAULT_IMAGE;
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

    // Guard: skip if a blog post was already generated today (UTC)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const { data: todayPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('id, title')
      .gte('published_at', todayStart.toISOString())
      .limit(1);

    if (todayPosts && todayPosts.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Blog post already generated today',
        post: { id: todayPosts[0].id, title: todayPosts[0].title },
      });
    }

    // Get all existing blog post titles, excerpts, and keywords to avoid duplicates
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('title, excerpt, keywords');
    const existingTitles = (existingPosts || []).map((p: { title: string }) => p.title.toLowerCase());
    const existingExcerpts = (existingPosts || []).map((p: { excerpt: string }) => (p.excerpt || '').toLowerCase());
    const existingKeywordSets = (existingPosts || []).map(
      (p: { keywords: string[] }) => (p.keywords || []).map((k: string) => k.toLowerCase())
    );

    // Get previously used topic texts to catch topics that generated posts with very different titles
    const { data: usedTopics } = await supabaseAdmin
      .from('blog_topics')
      .select('topic')
      .eq('used', true);
    const usedTopicTexts = (usedTopics || []).map((t: { topic: string }) => t.topic.toLowerCase().trim());

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

      // Multi-signal similarity check against titles, excerpts, keywords, and used topics
      if (isSimilarTopic(candidateTopic.topic, existingTitles, usedTopicTexts, existingExcerpts, existingKeywordSets)) {
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
      topic.secondary_keywords || [],
      existingTitles
    );

    // Generate a unique featured image with DALL·E 3 and upload to Supabase Storage
    const featuredImage = await generateAndUploadImage(
      topic.topic,
      generatedContent.keywords,
      generatedContent.slug,
      supabaseAdmin
    );

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

