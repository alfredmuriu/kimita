// Generate a blog featured image using Pollinations.ai (free, no API key, Flux.1-schnell under the hood)
// Returns the image as a Buffer ready for upload to Supabase Storage
export async function generateBlogImageGemini(topic: string, category?: string | null): Promise<Buffer> {
  const cat = (category || '').toLowerCase();
  const isFeedMilling = cat === 'feed milling' || cat === 'feed manufacturing';

  const prompt = isFeedMilling
    ? `Photorealistic natural photograph illustrating this feed milling topic: "${topic}". Real feed mill scene — hammer mill or roller mill grinding grain, pellet mill extruding feed, ribbon or paddle mixer in operation, conditioner with steam, bagged finished feed stacked on pallets, bulk ingredient silos, or raw materials (maize, soya cake, sunflower meal, fishmeal) on a receiving bay. Industrial feed manufacturing environment: stainless steel or painted steel equipment, conveyors, ducting, concrete floors, warehouse lighting. No humans, no operators in frame. Realistic textures of grain, pellets, mash, dust, and metal. Candid industrial photography — natural, unposed, authentic. No text overlays, no watermarks, no logos.`
    : `Photorealistic natural photograph of the specific animal related to this topic: "${topic}". Animal in its natural farm setting — grazing, resting, or simply standing — no humans, no farmers, no actions involving people. The animal is the clear subject. Natural farm environment: open pasture, dirt yard, or barn background. Golden hour or soft daylight, realistic fur/feather/skin textures, slight film grain. Candid wildlife or farm photography — natural, unposed, authentic. No text overlays, no watermarks, no logos.`;

  const seed = Math.floor(Math.random() * 1_000_000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=800&model=flux&seed=${seed}&nologo=true&enhance=true`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Pollinations request failed: ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
