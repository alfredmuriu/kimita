import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateBlogPost, generateBlogImage, getEmbedding, cosineSimilarity } from '@/lib/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Prevent build-time evaluation
export const maxDuration = 120; // Allow up to 120 seconds for AI generation + image generation

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';

// Cosine similarity threshold — topics scoring at or above this are considered duplicates.
// 0.82 is aggressive enough to catch "Mineral Supplements for Cows" vs "Feeding Practices for Dairy Cows"
// but permissive enough to allow genuinely different topics within the same category.
const SIMILARITY_THRESHOLD = 0.82;

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

/**
 * Compute embeddings for all existing posts (title + excerpt combined)
 * and return them alongside the text for logging.
 */
async function getExistingPostEmbeddings(
  titles: string[],
  excerpts: string[]
): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (let i = 0; i < titles.length; i++) {
    const combinedText = `${titles[i]}. ${excerpts[i] || ''}`.trim();
    try {
      const emb = await getEmbedding(combinedText);
      embeddings.push(emb);
    } catch (err) {
      console.error(`Failed to get embedding for post "${titles[i]}":`, err);
      // Push empty array so indices stay aligned
      embeddings.push([]);
    }
  }
  return embeddings;
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

    // Get all existing blog posts (title + excerpt) to check for semantic duplicates
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('title, excerpt');
    const existingTitles = (existingPosts || []).map((p: { title: string }) => p.title);
    const existingExcerpts = (existingPosts || []).map((p: { excerpt: string }) => (p.excerpt || ''));

    // Get previously used topic texts
    const { data: usedTopics } = await supabaseAdmin
      .from('blog_topics')
      .select('topic')
      .eq('used', true);
    const usedTopicTexts = (usedTopics || []).map((t: { topic: string }) => t.topic.toLowerCase().trim());

    // Pre-compute embeddings for all existing posts (title + excerpt)
    console.log(`Computing embeddings for ${existingTitles.length} existing posts...`);
    const existingEmbeddings = await getExistingPostEmbeddings(existingTitles, existingExcerpts);

    // Get unused topics batch
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

    // Find the first topic that doesn't semantically duplicate an existing post
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

      // Skip if this exact topic text was already used
      if (usedTopicTexts.includes(normalizedTopic)) {
        topicsToMarkUsed.push(candidateTopic.id);
        continue;
      }

      // Semantic similarity check using embeddings
      if (existingEmbeddings.length > 0) {
        try {
          const candidateEmbedding = await getEmbedding(candidateTopic.topic);
          let isTooSimilar = false;

          for (let i = 0; i < existingEmbeddings.length; i++) {
            if (existingEmbeddings[i].length === 0) continue; // skip failed embeddings
            const similarity = cosineSimilarity(candidateEmbedding, existingEmbeddings[i]);
            if (similarity >= SIMILARITY_THRESHOLD) {
              console.log(
                `Skipping topic "${candidateTopic.topic}" — too similar to existing post "${existingTitles[i]}" (cosine: ${similarity.toFixed(3)})`
              );
              isTooSimilar = true;
              break;
            }
          }

          if (isTooSimilar) {
            topicsToMarkUsed.push(candidateTopic.id);
            continue;
          }
        } catch (err) {
          console.error(`Embedding check failed for "${candidateTopic.topic}", falling through:`, err);
          // If embedding fails, allow the topic through rather than blocking
        }
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

    // Generate blog content using OpenAI — pass both titles and excerpts for full context
    const generatedContent = await generateBlogPost(
      topic.topic,
      topic.primary_keyword || topic.topic,
      topic.secondary_keywords || [],
      existingTitles,
      existingExcerpts
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


