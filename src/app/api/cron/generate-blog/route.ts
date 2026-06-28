import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateBlogPost } from '@/lib/openai';
import { generateBlogImageGemini } from '@/lib/gemini';
import { generateBlogImageAIStudio } from '@/lib/blog-imagen';
import { embedAndStoreArticle } from '@/lib/embeddings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store'; // Prevent Next.js from caching Supabase fetch calls
export const maxDuration = 120;

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200&auto=format&fit=crop';

// Detect the real image format from the buffer's magic bytes. AI Studio returns
// PNG, but it silently falls back to Pollinations (JPEG) on failure — so we can't
// trust the requested format. Tagging a JPEG as image/png produces broken,
// "bad" images downstream, which is the bug this guards against.
function detectImageFormat(buf: Buffer): { ext: string; contentType: string } {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { ext: 'png', contentType: 'image/png' };
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: 'jpg', contentType: 'image/jpeg' };
  }
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return { ext: 'webp', contentType: 'image/webp' };
  }
  // Unknown — default to JPEG, the most permissive choice for browsers.
  return { ext: 'jpg', contentType: 'image/jpeg' };
}

// Generate image with Gemini 2.5 Flash Image (free tier), upload to Supabase Storage, return permanent URL
async function generateAndUploadImage(
  topic: string,
  _keywords: string[],
  slug: string,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  category?: string | null
): Promise<string> {
  if (!supabaseAdmin) return DEFAULT_IMAGE;

  try {
    // 1. Generate image — Google AI Studio's Gemini 2.5 Flash Image ("Nano
    //    Banana", single API key) if GOOGLE_AI_API_KEY / GOOGLE_AI_STUDIO_API_KEY
    //    is set, else fall back to Pollinations. AI Studio returns PNG,
    //    Pollinations returns JPEG — pick file extension + content-type to match.
    const useAIStudio = Boolean(process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_AI_API_KEY);
    const imageBuffer = useAIStudio
      ? await generateBlogImageAIStudio(topic, category)
      : await generateBlogImageGemini(topic, category);
    // Pick extension + content-type from the actual bytes, not the requested
    // generator — AI Studio falls back to Pollinations (JPEG) internally, so the
    // buffer may not be the PNG we asked for.
    const { ext, contentType } = detectImageFormat(imageBuffer);
    const fileName = `${slug}-${Date.now()}.${ext}`;

    // 2. Upload to Supabase Storage (blog-images bucket)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(fileName, imageBuffer, {
        contentType,
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError.message);
      return DEFAULT_IMAGE;
    }

    // 3. Get the permanent public URL
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

    // Guard: skip once today's cap (BLOG_POSTS_PER_DAY, default 1) is reached.
    // cron-job.org fires this route several times a day; this cap is what
    // limits the actual number of posts produced per UTC day.
    const maxPerDay = Math.max(1, parseInt(process.env.BLOG_POSTS_PER_DAY || '1', 10));
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const { count: todayCount } = await supabaseAdmin
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .gte('published_at', todayStart.toISOString());

    if (typeof todayCount === 'number' && todayCount >= maxPerDay) {
      return NextResponse.json({
        success: true,
        message: `Daily cap reached (${todayCount}/${maxPerDay})`,
      });
    }

    // Get all existing blog post titles (for AI context — avoids repeating phrasing)
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('title');
    const existingTitles = (existingPosts || []).map((p: { title: string }) => p.title);

    // Find the highest priority already posted — this is the single source of truth
    const { data: lastPosted } = await supabaseAdmin
      .from('blog_posts')
      .select('source_priority')
      .not('source_priority', 'is', null)
      .order('source_priority', { ascending: false })
      .limit(1);

    const lastPriority = lastPosted?.[0]?.source_priority ?? 0;

    // Next topic = smallest priority greater than lastPriority (handles gaps automatically)
    const { data: topic, error: topicError } = await supabaseAdmin
      .from('blog_topics')
      .select('*')
      .gt('priority', lastPriority)
      .order('priority', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (topicError) {
      console.error('Failed to fetch next topic:', topicError.message);
      return NextResponse.json({ error: 'Failed to fetch topic', details: topicError.message }, { status: 500 });
    }

    if (!topic) {
      return NextResponse.json(
        { error: 'No more topics available', lastPriority },
        { status: 404 }
      );
    }

    console.log(`Next topic: "${topic.topic}" (priority ${topic.priority}) — last posted was ${lastPriority}`);

    // Heavy work (OpenAI draft + Gemini image + Supabase insert) takes 40-90s and
    // exceeds cron-job.org's ~30s HTTP timeout. Fire it in the background via
    // waitUntil(): the HTTP response returns immediately, Vercel keeps the function
    // alive until this promise resolves.
    waitUntil(
      (async () => {
        try {
          const generatedContent = await generateBlogPost(
            topic.topic,
            topic.primary_keyword || topic.topic,
            topic.secondary_keywords || [],
            existingTitles
          );

          const featuredImage = await generateAndUploadImage(
            topic.topic,
            generatedContent.keywords,
            generatedContent.slug,
            supabaseAdmin,
            topic.category
          );

          const slug = generatedContent.slug;
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
                category: topic.category || null,
                source_priority: topic.priority,
                sources: generatedContent.sources && generatedContent.sources.length > 0 ? generatedContent.sources : null,
                status: 'published',
                published_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (!error) {
              console.log(`Blog post saved: "${data.title}" (${data.slug})`);
              try {
                await embedAndStoreArticle(data.id, data.title, data.excerpt, data.content);
              } catch (embedErr) {
                console.error('Embedding failed (post still published):', embedErr);
              }
              return;
            }

            if (error.message.includes('source_priority')) {
              console.log(`Priority ${topic.priority} was posted by a concurrent run — exiting cleanly`);
              return;
            }

            if (error.message.includes('duplicate key')) {
              continue;
            }

            console.error('Failed to save blog post:', error.message);
            return;
          }

          console.error('Failed to save blog post after 3 slug attempts');
        } catch (err) {
          console.error('Background blog generation failed:', err);
        }
      })()
    );

    // Respond immediately — cron-job.org sees a fast 200, real work continues in the background.
    return NextResponse.json({
      success: true,
      message: 'Blog generation started in background',
      topic: topic.topic,
      priority: topic.priority,
    });
  } catch (error) {
    console.error('Error starting blog generation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
