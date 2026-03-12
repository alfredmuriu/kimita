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
7. You MUST write about the assigned topic "${topic}" — do NOT write about a different subject

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
        content: 'You are an expert agricultural content writer. Always respond with valid JSON only. Write ONLY about the specific topic you are assigned. Never deviate to a different subject.',
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
