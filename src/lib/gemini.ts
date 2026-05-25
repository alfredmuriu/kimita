// Generate a blog featured image using Pollinations.ai (free, no API key, Flux.1-schnell under the hood)
// Returns the image as a Buffer ready for upload to Supabase Storage
export async function generateBlogImageGemini(topic: string, category?: string | null): Promise<Buffer> {
  const cat = (category || '').toLowerCase();
  const isFeedMilling = cat === 'feed milling' || cat === 'feed manufacturing';

  const prompt = isFeedMilling
    ? `Photorealistic photograph of a feed mill relevant to: "${topic}". Show feed milling equipment and scenes — hammer mills, pellet mills, mixers, conditioners, ingredient silos, bagged feed, or raw materials (maize, soya, sunflower meal). Real industrial feed mill environment. No humans, no text, no watermarks, no logos.`
    : `Photorealistic photograph of the specific animal referenced in this topic: "${topic}". The animal is the clear subject, in a natural farm setting. No humans, no text, no watermarks, no logos.`;

  const seed = Math.floor(Math.random() * 1_000_000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=800&model=flux&seed=${seed}&nologo=true&enhance=true`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Pollinations request failed: ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
