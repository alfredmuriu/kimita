import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const RESEARCH_MODEL = 'claude-sonnet-4-6'
const GENERATION_MODEL = 'claude-haiku-4-5-20251001'

const AGRIKIMA_SYSTEM_PROMPT = `You are Agrikima's dedicated marketing intelligence assistant.

About Agrikima:
- Company: Agrikima — organic animal health solutions and crop management
- Tagline: Making Growth Happen
- Markets: Kenya, Uganda, Rwanda, Tanzania
- Key products: Advice (viral protection), Biogar (gut health), Agritonic, Agrivitam
- Mission: Natural alternatives to antibiotics, reducing AMR, sustainable farming
- Audience: Smallholder and commercial farmers, distributors, agri-vets, NGOs
- Tone: Knowledgeable, farmer-first, practical, Africa-rooted

Your responsibilities:
- Always search the web before answering questions about current events, trends, or competitor activity
- Proactively mention relevant market developments even if not directly asked
- When the user submits content for publishing, confirm and trigger the manual post flow
- Keep responses focused on marketing, agribusiness, and Agrikima's niche`

// ── Chat with the agent (used by the chat interface) ──────────────────────────
export async function chatWithAgent(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt?: string
) {
  const response = await client.messages.create({
    model: RESEARCH_MODEL,
    max_tokens: 2048,
    system: systemPrompt || AGRIKIMA_SYSTEM_PROMPT,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages,
  })

  // Extract text content from the response
  const textBlocks = response.content.filter((b) => b.type === 'text')
  return textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n')
}

// ── Research query (used by the research module) ──────────────────────────────
export async function researchQuery(query: string): Promise<string> {
  const response = await client.messages.create({
    model: RESEARCH_MODEL,
    max_tokens: 4096,
    system:
      'You are a market research specialist for Agrikima, an organic animal health company operating in East Africa. Search the web thoroughly and return detailed, structured findings.',
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: query }],
  })

  const textBlocks = response.content.filter((b) => b.type === 'text')
  return textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n')
}

// ── Generate content (used by the generators module) ─────────────────────────
export async function generateContent(prompt: string, maxTokens = 1024): Promise<string> {
  const response = await client.messages.create({
    model: GENERATION_MODEL,
    max_tokens: maxTokens,
    system:
      'You are a social media content writer for Agrikima, an organic animal health company in East Africa. Write platform-native, engaging content that resonates with farmers, agri-vets, and agribusiness professionals.',
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlocks = response.content.filter((b) => b.type === 'text')
  return textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n')
}
