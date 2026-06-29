import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Provider switch ───────────────────────────────────────────────────────────
// Set AI_PROVIDER=openai in the environment to route the marketing agent through
// OpenAI instead of Anthropic (temporary stopgap while Anthropic credits are dry).
// Anything other than 'openai' (incl. unset) keeps the original Anthropic path.
// Revert by removing the env var (or setting it back to 'anthropic') + redeploy.
const USE_OPENAI = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase() === 'openai'

// Anthropic models
const RESEARCH_MODEL = 'claude-sonnet-4-6'
const GENERATION_MODEL = 'claude-haiku-4-5-20251001'

// OpenAI models (overridable via env so the account's exact model names can vary).
// The research model needs built-in web search — gpt-4o-search-preview searches
// the web automatically. The generation model is a cheap general model.
const OPENAI_RESEARCH_MODEL = process.env.OPENAI_RESEARCH_MODEL ?? 'gpt-4o-search-preview'
const OPENAI_GENERATION_MODEL = process.env.OPENAI_GENERATION_MODEL ?? 'gpt-4o-mini'

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

const RESEARCH_SYSTEM_PROMPT =
  'You are a market research specialist for Agrikima, an organic animal health company operating in East Africa. Search the web thoroughly and return detailed, structured findings.'

const GENERATION_SYSTEM_PROMPT =
  'You are a social media content writer for Agrikima, an organic animal health company in East Africa. Write platform-native, engaging content that resonates with farmers, agri-vets, and agribusiness professionals.'

// ── OpenAI helpers ────────────────────────────────────────────────────────────
type ChatTurn = { role: 'user' | 'assistant'; content: string }

// Web-search-backed chat via OpenAI. Uses the search-preview model (web search is
// built in). Falls back to a plain model if the search model errors, so the
// pipeline always returns something rather than crashing.
async function openaiSearchChat(system: string, messages: ChatTurn[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_RESEARCH_MODEL,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    })
    const text = response.choices[0]?.message?.content?.trim()
    if (text) return text
    throw new Error('Empty response from OpenAI search model')
  } catch (err) {
    console.warn('[AI] OpenAI search model unavailable, falling back to plain chat:', err)
    const response = await openai.chat.completions.create({
      model: OPENAI_GENERATION_MODEL,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    })
    return response.choices[0]?.message?.content?.trim() ?? ''
  }
}

// ── Chat with the agent (used by the chat interface) ──────────────────────────
export async function chatWithAgent(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt?: string
) {
  const system = systemPrompt || AGRIKIMA_SYSTEM_PROMPT

  if (USE_OPENAI) {
    return openaiSearchChat(system, messages)
  }

  const response = await client.messages.create({
    model: RESEARCH_MODEL,
    max_tokens: 2048,
    system,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages,
  })

  // Extract text content from the response
  const textBlocks = response.content.filter((b) => b.type === 'text')
  return textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n')
}

// ── Research query (used by the research module) ──────────────────────────────
export async function researchQuery(query: string): Promise<string> {
  if (USE_OPENAI) {
    return openaiSearchChat(RESEARCH_SYSTEM_PROMPT, [{ role: 'user', content: query }])
  }

  const response = await client.messages.create({
    model: RESEARCH_MODEL,
    max_tokens: 4096,
    system: RESEARCH_SYSTEM_PROMPT,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: query }],
  })

  const textBlocks = response.content.filter((b) => b.type === 'text')
  return textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n')
}

// ── Generate content (used by the generators module) ─────────────────────────
export async function generateContent(prompt: string, maxTokens = 1024): Promise<string> {
  if (USE_OPENAI) {
    const response = await openai.chat.completions.create({
      model: OPENAI_GENERATION_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    })
    return response.choices[0]?.message?.content?.trim() ?? ''
  }

  const response = await client.messages.create({
    model: GENERATION_MODEL,
    max_tokens: maxTokens,
    system: GENERATION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlocks = response.content.filter((b) => b.type === 'text')
  return textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n')
}
