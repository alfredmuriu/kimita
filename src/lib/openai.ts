import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedBlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  featuredImageDescription: string;
}

/**
 * Get an embedding vector for a piece of text using OpenAI's text-embedding-3-small model.
 * Used for semantic similarity comparison between topics.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.trim(),
  });
  return response.data[0].embedding;
}

/**
 * Compute cosine similarity between two embedding vectors.
 * Returns a value between -1 and 1, where 1 means identical.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function generateBlogPost(
  topic: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
  existingPostTitles: string[] = [],
  existingPostExcerpts: string[] = []
): Promise<GeneratedBlogContent> {
  // Build a combined list of existing posts with titles + excerpts for maximum context
  let existingPostsContext = '';
  if (existingPostTitles.length > 0) {
    const postEntries = existingPostTitles.map((title, i) => {
      const excerpt = existingPostExcerpts[i] || '';
      return excerpt ? `- "${title}" — ${excerpt}` : `- "${title}"`;
    });

    existingPostsContext = `\n\n⚠️ CRITICAL CONSTRAINT — DUPLICATE AVOIDANCE ⚠️
The following ${existingPostTitles.length} blog posts have ALREADY been published on this site. You MUST NOT repeat, rephrase, or overlap with ANY of these topics — not even from a different angle:

${postEntries.join('\n')}

Your article MUST cover a genuinely DIFFERENT subject. If the assigned topic above is too similar to any existing post, focus on a completely unique sub-topic or angle that has ZERO overlap with the above posts. Do NOT rehash the same advice, tips, or information.\n`;
  }

  const prompt = `You are an expert agricultural content writer for Agrikima, a company selling veterinary and agricultural products. Their products include natural animal health solutions, supplements, and feed additives for dairy, poultry, and livestock farmers.

Write a comprehensive blog post about: "${topic}"

Target primary keyword: "${primaryKeyword}"
Secondary keywords to include: ${secondaryKeywords.join(', ')}
${existingPostsContext}
Requirements:
1. Write 1000-1200 words
2. Use simple, educational language suitable for farmers
3. Include practical, actionable tips
4. Structure with clear H2 and H3 headings (use HTML tags)
5. Where relevant, naturally mention that quality veterinary products and supplements can help
6. Make it SEO-optimized with the keywords naturally integrated

Respond in this exact JSON format:
{
  "title": "SEO-optimized title (max 60 characters)",
  "slug": "url-friendly-slug-with-hyphens",
  "excerpt": "Compelling meta description (max 155 characters)",
  "content": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li> tags",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "featuredImageDescription": "Description for featured image"
}

Return ONLY valid JSON, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert agricultural content writer. Always respond with valid JSON only. You must ensure your content is completely unique and does not overlap with any existing published content.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 6000,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  // Parse the JSON response
  const parsed = JSON.parse(content);

  return {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: parsed.content,
    keywords: parsed.keywords,
    featuredImageDescription: parsed.featuredImageDescription,
  };
}

// Generate a blog featured image using DALL·E 3
export async function generateBlogImage(
  topic: string,
  keywords: string[]
): Promise<string> {
  const prompt = `A professional, high-quality photograph of the specific animal discussed in this topic: "${topic}". Show a realistic, close-up or medium shot of the animal (e.g. chickens if poultry, cows if dairy, pigs if swine, goats if mentioned, etc.) in a clean farm setting. The animal should be healthy and well-kept. Bright natural lighting, sharp focus, editorial photography style. No text, no watermarks, no humans in the frame.`;

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

