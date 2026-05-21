import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-search-preview',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 1500,
  });

  const raw = response.choices[0]?.message?.content || '';
  // The search-preview model sometimes wraps JSON in prose; extract the JSON object.
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

function buildSourcesHtml(sources: ArticleSource[]): string {
  if (sources.length === 0) return '';
  const items = sources
    .map((s, i) => {
      const label = s.publisher ? `${escapeHtml(s.title)} — ${escapeHtml(s.publisher)}` : escapeHtml(s.title);
      return `<li id="source-${i + 1}"><a href="${escapeAttr(s.url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a></li>`;
    })
    .join('');
  return `<h2>Sources</h2><ol>${items}</ol>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
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
  const sources = await researchSources(topic, primaryKeyword, secondaryKeywords);

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

  // Append the Sources section to the rendered HTML so it appears at the bottom
  // of every article with clickable, no-follow external links.
  const sourcesHtml = buildSourcesHtml(sources);
  const finalContent = sourcesHtml ? `${parsed.content}\n${sourcesHtml}` : parsed.content;

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

// Generate a blog featured image using DALL·E 3
export async function generateBlogImage(
  topic: string,
  keywords: string[]
): Promise<string> {
  const prompt = `A photorealistic, documentary-style photograph related to the agricultural topic: "${topic}". Shot on a Canon EOS R5 with an 85mm f/1.4 lens, shallow depth of field. Show the relevant farm animal (e.g. chickens if poultry, dairy cows if dairy, pigs if swine, goats if mentioned) in a natural farm environment with real dirt, grass, and natural imperfections. Golden hour natural lighting, slight film grain, realistic skin/feather/fur textures. The style should look like a National Geographic documentary photo — NOT an illustration, NOT AI-generated looking, NOT overly clean or perfect. No text overlays, no watermarks, no logos.`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1792x1024',
    quality: 'standard',
  });

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error('No image generated from DALL·E');
  }

  return imageUrl;
}

export default openai;
