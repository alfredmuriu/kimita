import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  isVideoEnabled,
  buildClipPrompts,
  uploadClip,
  uploadVoiceover,
  buildVideoUrl,
  CLIP_COUNT,
} from '@/lib/blog-video';
import { submitVeoClip, pollVeoClip } from '@/lib/blog-veo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
// Each invocation does ONE small step and returns. Veo takes minutes, so we never
// block on it — we submit jobs, then poll one op per tick. This keeps every run
// comfortably under Vercel Hobby's 60s function cap. Drive it with a frequent
// cron (every 1-2 min) so a video finishes over several ticks.
export const maxDuration = 60;

// Per-post job state stored in blog_posts.video_jobs (JSONB):
//   { clips: [{ op: string, publicId: string | null }], audioPublicId: string | null }
interface ClipJob {
  op: string;
  publicId: string | null;
}
interface VideoJobs {
  clips: ClipJob[];
  audioPublicId: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get('secret');
    const isAuthorized =
      authHeader === `Bearer ${process.env.CRON_SECRET}` ||
      secretParam === process.env.CRON_SECRET;
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isVideoEnabled()) {
      return NextResponse.json({
        success: true,
        message: 'Article video generation disabled (BLOG_VEO_ENABLED / Cloudinary creds not set)',
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Find the post to work on this tick: prefer one already in progress
    // ('submitting'/'polling'), else the oldest published post with no video yet
    // (video_status NULL). Posts marked 'done'/'failed' are skipped.
    const { data: inProgress } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, video_status, video_jobs')
      .in('video_status', ['submitting', 'polling'])
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    let post = inProgress;
    if (!post) {
      const { data: fresh } = await supabaseAdmin
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, video_status, video_jobs')
        .eq('status', 'published')
        .is('video_status', null)
        .is('video_url', null)
        .order('published_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      post = fresh || null;
    }

    if (!post) {
      return NextResponse.json({ success: true, message: 'No posts awaiting video' });
    }

    const markFailed = async (reason: string) => {
      console.error(`[generate-video] "${post!.slug}" failed: ${reason}`);
      await supabaseAdmin.from('blog_posts').update({ video_status: 'failed' }).eq('id', post!.id);
    };

    // ── STEP 1: submit all Veo jobs ────────────────────────────────────────────
    if (!post.video_status) {
      try {
        const prompts = buildClipPrompts(post.title, post.category);
        const clips: ClipJob[] = [];
        for (const prompt of prompts.slice(0, CLIP_COUNT)) {
          const op = await submitVeoClip(prompt);
          clips.push({ op, publicId: null });
        }
        const jobs: VideoJobs = { clips, audioPublicId: null };
        await supabaseAdmin
          .from('blog_posts')
          .update({ video_status: 'polling', video_jobs: jobs })
          .eq('id', post.id);
        return NextResponse.json({ success: true, slug: post.slug, step: 'submitted', clips: clips.length });
      } catch (err) {
        await markFailed(`submit: ${String(err)}`);
        return NextResponse.json({ success: false, slug: post.slug, step: 'submit-failed' });
      }
    }

    // ── STEP 2: poll ONE pending clip per tick; download + upload when ready ────
    const jobs = (post.video_jobs as VideoJobs | null) || { clips: [], audioPublicId: null };
    if (post.video_status === 'polling') {
      const pending = jobs.clips.findIndex((c) => !c.publicId);
      if (pending !== -1) {
        try {
          const bytes = await pollVeoClip(jobs.clips[pending].op);
          if (!bytes) {
            // Still rendering — try again next tick.
            return NextResponse.json({ success: true, slug: post.slug, step: 'polling', clip: pending });
          }
          const publicId = await uploadClip(bytes, post.slug, pending);
          jobs.clips[pending].publicId = publicId;
          await supabaseAdmin.from('blog_posts').update({ video_jobs: jobs }).eq('id', post.id);
          return NextResponse.json({ success: true, slug: post.slug, step: 'clip-uploaded', clip: pending });
        } catch (err) {
          await markFailed(`poll/upload clip ${pending}: ${String(err)}`);
          return NextResponse.json({ success: false, slug: post.slug, step: 'clip-failed' });
        }
      }

      // ── STEP 3: all clips uploaded → voiceover (once) then stitch + finish ────
      try {
        if (jobs.audioPublicId === null) {
          const audioId = await uploadVoiceover(post.title, post.excerpt, post.slug);
          jobs.audioPublicId = audioId; // may stay null if TTS unavailable — that's fine
          await supabaseAdmin.from('blog_posts').update({ video_jobs: jobs }).eq('id', post.id);
        }
        const clipIds = jobs.clips.map((c) => c.publicId!).filter(Boolean);
        const url = await buildVideoUrl(clipIds, jobs.audioPublicId);
        await supabaseAdmin
          .from('blog_posts')
          .update({ video_url: url, video_status: 'done' })
          .eq('id', post.id);
        return NextResponse.json({ success: true, slug: post.slug, step: 'done', url });
      } catch (err) {
        await markFailed(`stitch: ${String(err)}`);
        return NextResponse.json({ success: false, slug: post.slug, step: 'stitch-failed' });
      }
    }

    return NextResponse.json({ success: true, slug: post.slug, status: post.video_status });
  } catch (error) {
    console.error('Error in generate-video cron:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
