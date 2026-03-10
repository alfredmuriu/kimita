import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateBlogPost, generateBlogImage } from '@/lib/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Prevent build-time evaluation
export const maxDuration = 120; // Allow up to 120 seconds for AI generation + image generation

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';

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

    // Get all existing blog post titles (for GPT reference context only)
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('title');
    const existingTitles = (existingPosts || []).map((p: { title: string }) => p.title);

    // Get the NEXT unused topic by strict priority order
    const { data: nextTopics, error: topicError } = await supabaseAdmin
      .from('blog_topics')
      .select('*')
      .eq('used', false)
      .order('priority', { ascending: true })
      .limit(1);

    if (topicError || !nextTopics || nextTopics.length === 0) {
      return NextResponse.json(
        { error: 'No unused topics available', details: topicError?.message },
        { status: 404 }
      );
    }

    const topic = nextTopics[0];
    console.log(`Generating blog for topic: "${topic.topic}" (priority ${topic.priority})`);

    // Mark the topic as used BEFORE generating (prevents double-generation if cron fires twice)
    await supabaseAdmin
      .from('blog_topics')
      .update({ used: true })
      .eq('id', topic.id);

    // Generate blog content using OpenAI — pass existing titles for reference
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
        priority: topic.priority,
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
