import { NextRequest, NextResponse } from 'next/server';

// Diagnostic endpoint — confirms whether the blog image pipeline is configured
// to use Google AI Studio's Gemini 2.5 Flash Image ("Nano Banana") and whether
// the call actually succeeds. Does NOT upload to Supabase; just reports.
//
// Hit it with: /api/debug/blog-image?secret=<CRON_SECRET>
// Returns JSON: { provider, aiStudioCall? } so you can see the failure path
// without digging through Vercel logs.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');
  const authHeader = request.headers.get('authorization');

  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretParam === process.env.CRON_SECRET;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Google AI Studio check (preferred path) ──────────────────────────────
  const aiStudioKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (aiStudioKey) {
    try {
      const endpoint =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': aiStudioKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'A single brown hen on a Kenyan farm at golden hour, photoreal.' }],
            },
          ],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({
          provider: 'ai-studio (FAILED — would fall back to pollinations)',
          hint: res.status === 429 || /billing|quota|FAILED_PRECONDITION/i.test(errText)
            ? 'Looks like billing/quota — make sure billing is enabled on the key\'s GCP project.'
            : undefined,
          aiStudioCall: { status: res.status, error: errText.slice(0, 1000) },
        });
      }

      const data = await res.json();
      const parts: Array<{ inlineData?: { data?: string; mimeType?: string } }> =
        data?.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p) => p?.inlineData?.data);

      return NextResponse.json({
        provider: imagePart ? 'ai-studio (OK)' : 'ai-studio (no image — would fall back to pollinations)',
        aiStudioCall: {
          status: 200,
          gotImage: Boolean(imagePart),
          imageBytes: imagePart?.inlineData?.data ? imagePart.inlineData.data.length : 0,
          mimeType: imagePart?.inlineData?.mimeType ?? null,
          rawResponseSnippet: imagePart ? undefined : JSON.stringify(data).slice(0, 500),
        },
      });
    } catch (err) {
      return NextResponse.json({
        provider: 'ai-studio (THREW — would fall back to pollinations)',
        aiStudioCall: { error: err instanceof Error ? err.message : String(err) },
      });
    }
  }

  // No AI Studio key set — the blog cron uses Pollinations (Flux) in this case.
  return NextResponse.json({
    provider: 'pollinations (fallback)',
    reason: 'no AI Studio key set (GOOGLE_AI_API_KEY / GOOGLE_AI_STUDIO_API_KEY)',
  });
}
