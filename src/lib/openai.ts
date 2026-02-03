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

export async function generateBlogPost(
  topic: string,
  primaryKeyword: string,
  secondaryKeywords: string[]
): Promise<GeneratedBlogContent> {
  const prompt = `You are an expert agricultural content writer for Agrikima, a Kenyan company selling veterinary and agricultural products. Their products include natural animal health solutions, supplements, and feed additives for dairy, poultry, and livestock farmers.

Write a comprehensive blog post about: "${topic}"

Target primary keyword: "${primaryKeyword}"
Secondary keywords to include: ${secondaryKeywords.join(', ')}

Requirements:
1. Write 1000-1200 words
2. Use simple, educational language suitable for Kenyan farmers
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
        content: 'You are an expert agricultural content writer. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2500,
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

export default openai;

