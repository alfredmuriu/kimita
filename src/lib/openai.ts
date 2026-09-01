import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model used for the web-grounded research step. Overridable via env so a future
// deprecation can be worked around without a deploy.
const RESEARCH_MODEL = process.env.BLOG_RESEARCH_MODEL || 'gpt-4.1';

export interface ArticleSource {
  title: string;
  url: string;
  publisher?: string;
  snippet?: string;
}

export interface GeneratedBlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  featuredImageDescription: string;
  sources: ArticleSource[];
}

// Step A — collect reputable web sources for the topic using OpenAI's web-search model.
// We deliberately do NOT pass any uploaded/internal documents into this step; the
// generator must be grounded only in publicly citable sources.
async function researchSources(
  topic: string,
  primaryKeyword: string,
  secondaryKeywords: string[]
): Promise<ArticleSource[]> {
  const prompt = `Find 4-6 reputable, citable web sources that a farmer-facing article about "${topic}" should reference.

Primary keyword: "${primaryKeyword}"
Secondary keywords: ${secondaryKeywords.join(', ')}

Prefer: agricultural extension services, FAO, university ag departments, government livestock/veterinary bodies, peer-reviewed journals, well-known farming publications. Avoid: forum posts, Wikipedia, low-quality content farms, and any source you cannot link to directly.

Return ONLY valid JSON of this shape (no prose, no markdown fences):
{
  "sources": [
    { "title": "page title", "url": "https://...", "publisher": "site or org name", "snippet": "1-2 sentence factual claim from this source relevant to the topic" }
  ]
}`;

  // Web grounding runs through the Responses API's built-in `web_search` tool.
  // The old `gpt-4o-search-preview` model was retired by OpenAI in Aug 2026 and
  // now 404s; `web_search` on a current model is its supported replacement.
  const response = await openai.responses.create({
    model: RESEARCH_MODEL,
    input: prompt,
    tools: [{ type: 'web_search' }],
    max_output_tokens: 2000,
  });

  const raw = response.output_text || '';
  // The model sometimes wraps JSON in prose or a markdown fence; extract the object.
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return [];

  try {
    const parsed = JSON.parse(match[0]) as { sources?: ArticleSource[] };
    const sources = Array.isArray(parsed.sources) ? parsed.sources : [];
    return sources
      .filter((s) => s && typeof s.url === 'string' && /^https?:\/\//i.test(s.url))
      .slice(0, 6);
  } catch {
    return [];
  }
}

// Strip the inline [1], [2] citation markers from the rendered HTML.
// The article page exposes sources via a separate collapsible "Sources" disclosure
// at the bottom of the page, so we don't want the bracketed numbers polluting prose.
function stripCitationMarkers(html: string): string {
  // Remove " [1]", "[1,2]", "[1, 2]", "[1-3]" etc. — leave surrounding punctuation intact.
  return html.replace(/\s*\[\d+(?:\s*[-,]\s*\d+)*\]/g, '');
}

export async function generateBlogPost(
  topic: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
  existingPostTitles: string[] = []
): Promise<GeneratedBlogContent> {
  // Build a reference list of existing posts so GPT can differentiate its content
  let existingPostsContext = '';
  if (existingPostTitles.length > 0) {
    const postList = existingPostTitles
      .map((title, i) => `${i + 1}. "${title}"`)
      .join('\n');

    existingPostsContext = `\n\nREFERENCE — Already published posts:\n${postList}\n\nYour article must cover the ASSIGNED TOPIC above. To avoid repetition, make sure your specific tips, examples, and recommendations are DIFFERENT from what these existing posts likely cover. Do NOT change the subject — stay on the assigned topic.\n`;
  }

  // Step A: gather public web sources for grounding.
  // Research is best-effort ONLY. The prompt below already handles an empty list
  // by asking for a careful general overview, so a search outage must never stop
  // the article from being written -- an unguarded throw here silently halted all
  // publishing for two weeks when gpt-4o-search-preview was retired.
  let sources: ArticleSource[] = [];
  try {
    sources = await researchSources(topic, primaryKeyword, secondaryKeywords);
  } catch (err) {
    console.error('Source research failed, publishing without sources:', err);
  }

  const sourcesBlock = sources.length
    ? sources
        .map(
          (s, i) =>
            `[${i + 1}] ${s.title}${s.publisher ? ` (${s.publisher})` : ''}\nURL: ${s.url}\nKey fact: ${s.snippet || '(no snippet)'}\n`
        )
        .join('\n')
    : '(no sources were returned — write a careful, general overview without inventing specific statistics, names, dates, or studies)';

  const prompt = `You are an expert agricultural content writer for Agrikima, a company selling veterinary and agricultural products. Their products include natural animal health solutions, supplements, and feed additives for dairy, poultry, and livestock farmers.

Write a comprehensive blog post about: "${topic}"

Target primary keyword: "${primaryKeyword}"
Secondary keywords to include: ${secondaryKeywords.join(', ')}
${existingPostsContext}

SOURCES (use ONLY these — do NOT invent facts, statistics, or studies that are not supported here):
${sourcesBlock}

Hard rules:
1. Ground every specific factual claim (statistics, studies, names, dates, recommendations) in one of the numbered sources above. Cite it inline with [1], [2], etc. immediately after the claim.
2. You may add general educational framing, practical tips, and Agrikima product framing without citations, but DO NOT fabricate numeric data or research findings.
3. You MUST NOT use, quote, paraphrase, or rely on any internal, proprietary, uploaded, or private documents. The numbered web sources above are the ONLY external information you may draw on.
4. Do not include a "Sources" section yourself — it will be appended automatically.

Writing requirements:
1. Write 1000-1200 words
2. Use simple, educational language suitable for farmers
3. Include practical, actionable tips
4. Structure with clear H2 and H3 headings (use HTML tags)
5. Where relevant, naturally mention that quality veterinary products and supplements can help
6. Make it SEO-optimized with the keywords naturally integrated
7. You MUST write about the assigned topic "${topic}" — do NOT write about a different subject

Respond in this exact JSON format:
{
  "title": "SEO-optimized title (max 60 characters)",
  "slug": "url-friendly-slug-with-hyphens",
  "excerpt": "Compelling meta description (max 155 characters)",
  "content": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li> tags and inline [n] citation markers",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "featuredImageDescription": "Description for featured image"
}

Return ONLY valid JSON, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert agricultural content writer. Always respond with valid JSON only. Write ONLY about the specific topic you are assigned. Never deviate to a different subject. Ground factual claims ONLY in the numbered sources provided by the user — never use uploaded, internal, or proprietary documents, and never fabricate studies or statistics.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  const parsed = JSON.parse(content);

  // Strip inline [n] citation markers from the body — sources are surfaced via a
  // separate collapsible "Sources" disclosure on the article page (below the
  // contact form), not inline in the prose.
  const finalContent = stripCitationMarkers(parsed.content);

  return {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: finalContent,
    keywords: parsed.keywords,
    featuredImageDescription: parsed.featuredImageDescription,
    sources,
  };
}

export default openai;
