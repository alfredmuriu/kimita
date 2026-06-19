import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

// Diagnostic endpoint — confirms whether the blog image pipeline is configured
// to use Vertex (Gemini 2.5 Flash Image / "Nano Banana") and whether the call
// actually succeeds. Does NOT upload to Supabase; just reports.
//
// Hit it with: /api/debug/blog-image?secret=<CRON_SECRET>
// Returns JSON: { provider, env, vertexCall? } so you can see the failure path
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
  const aiStudioKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
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
          generationConfig: { responseModalities: ['IMAGE'] },
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

  const projectId = process.env.BLOG_VERTEX_PROJECT_ID;
  const location = process.env.BLOG_VERTEX_LOCATION || 'us-central1';
  const clientEmail = process.env.BLOG_GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.BLOG_GOOGLE_PRIVATE_KEY;

  const env = {
    BLOG_VERTEX_PROJECT_ID: projectId ? `set (${projectId})` : 'MISSING',
    BLOG_VERTEX_LOCATION: location,
    BLOG_GOOGLE_CLIENT_EMAIL: clientEmail ? `set (${clientEmail})` : 'MISSING',
    BLOG_GOOGLE_PRIVATE_KEY: privateKeyRaw
      ? `set (length=${privateKeyRaw.length}, contains \\\\n=${privateKeyRaw.includes('\\n')}, contains real newline=${privateKeyRaw.includes('\n')})`
      : 'MISSING',
  };

  if (!projectId || !clientEmail || !privateKeyRaw) {
    return NextResponse.json({
      provider: 'pollinations (fallback)',
      reason: 'one or more BLOG_VERTEX_* env vars are missing',
      env,
    });
  }

  try {
    const auth = new JWT({
      email: clientEmail,
      key: privateKeyRaw.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const { token } = await auth.getAccessToken();
    if (!token) throw new Error('No access token returned');

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-2.5-flash-image:generateContent`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'A single brown hen on a Kenyan farm at golden hour, photoreal.' }],
          },
        ],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        provider: 'vertex (FAILED — would fall back to pollinations)',
        env,
        vertexCall: {
          status: res.status,
          error: errText.slice(0, 1000),
        },
      });
    }

    const data = await res.json();
    const parts: Array<{ inlineData?: { data?: string; mimeType?: string } }> =
      data?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p?.inlineData?.data);

    return NextResponse.json({
      provider: imagePart ? 'vertex (OK)' : 'vertex (no image in response — would fall back to pollinations)',
      env,
      vertexCall: {
        status: 200,
        gotImage: Boolean(imagePart),
        imageBytes: imagePart?.inlineData?.data ? imagePart.inlineData.data.length : 0,
        mimeType: imagePart?.inlineData?.mimeType ?? null,
        rawResponseSnippet: imagePart ? undefined : JSON.stringify(data).slice(0, 500),
      },
    });
  } catch (err) {
    return NextResponse.json({
      provider: 'vertex (THREW — would fall back to pollinations)',
      env,
      vertexCall: {
        error: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
