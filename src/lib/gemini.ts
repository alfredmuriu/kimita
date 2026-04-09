import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Generate a blog featured image using Nano Banana Pro (Gemini image generation)
// Returns the image as a Buffer ready for upload to Supabase Storage
export async function generateBlogImageGemini(topic: string): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });

  const prompt = `Generate a photorealistic, documentary-style photograph related to the agricultural topic: "${topic}". Shot on a Canon EOS R5 with an 85mm f/1.4 lens, shallow depth of field. Show the relevant farm animal (e.g. chickens if poultry, dairy cows if dairy, pigs if swine, goats if mentioned) in a natural farm environment with real dirt, grass, and natural imperfections. Golden hour natural lighting, slight film grain, realistic skin/feather/fur textures. The style should look like a National Geographic documentary photo — NOT an illustration, NOT AI-generated looking, NOT overly clean or perfect. No text overlays, no watermarks, no logos.`;

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
