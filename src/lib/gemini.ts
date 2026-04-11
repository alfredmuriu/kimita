import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Generate a blog featured image using Nano Banana Pro (Gemini image generation)
// Returns the image as a Buffer ready for upload to Supabase Storage
export async function generateBlogImageGemini(topic: string): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });

  const prompt = `Generate a photorealistic natural photograph of the specific animal related to this topic: "${topic}". Show the animal in its natural farm setting — grazing, resting, or simply standing — no humans, no farmers, no actions involving people. The animal should be the clear subject of the image. Natural farm environment: open pasture, dirt yard, or barn background. Golden hour or soft daylight, realistic fur/feather/skin textures, slight film grain. Style: candid wildlife or farm photography — natural, unposed, authentic. NOT an illustration, NOT AI-generated looking. No text overlays, no watermarks, no logos.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    } as any,
  });

  const parts = result.response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart?.inlineData?.data) {
    throw new Error('No image data returned from Gemini');
  }

  return Buffer.from(imagePart.inlineData.data, 'base64');
}
