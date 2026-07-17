// Shared "brain" for the Agrikima customer assistant.
// Used by both the WhatsApp webhook and the website chat widget so they
// behave identically — same persona, same product knowledge, same escalation.

import Anthropic from '@anthropic-ai/sdk'
import type { Message, MessageCreateParamsNonStreaming } from '@anthropic-ai/sdk/resources/messages'
import OpenAI from 'openai'
import { PRODUCT_CATALOG, CATALOGUE_MESSAGE } from './products-catalog'
import { findRelevantArticles } from './embeddings'
import { getSupabaseAdmin } from './supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const FALLBACK_MODEL = 'gpt-4o-mini'

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 600

export type Channel = 'whatsapp' | 'web'

export interface ConversationTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface BotReply {
  text: string
  shouldEscalate: boolean
  escalationReason: string | null
  outOfScope: boolean
}

const ORDER_EMAIL = 'info@agrikima.co.ke'
const CTA_PHONE = '+254 111 410 639'

// Fixed out-of-scope redirect replies. The model is instructed to use these
// VERBATIM so we can deterministically detect out-of-scope turns in stored
// history (see countPriorOutOfScope) — do not reword without updating both.
export const OUT_OF_SCOPE_REPLY_EN = `I can help with Agrikima products, orders, and farming questions related to what we sell. For anything else, message our team directly on ${CTA_PHONE} and they'll be glad to help.`
export const OUT_OF_SCOPE_REPLY_SW = `Naweza kusaidia na bidhaa za Agrikima, oda, na maswali ya ufugaji na kilimo yanayohusiana na tunachouza. Kwa mengine yoyote, wasiliana na timu yetu moja kwa moja: ${CTA_PHONE}.`

// After this many out-of-scope attempts in one conversation, flag for a human.
const OFF_TOPIC_ESCALATION_THRESHOLD = 3

function isOutOfScopeReplyText(text: string): boolean {
  return (
    text.includes('I can help with Agrikima products, orders,') ||
    text.includes('Naweza kusaidia na bidhaa za Agrikima')
  )
}

function countPriorOutOfScope(history: ConversationTurn[]): number {
  return history.filter((t) => t.role === 'assistant' && isOutOfScopeReplyText(t.content)).length
}

// Audit trail for Meta review: every declined out-of-scope attempt is recorded
// in whatsapp_scope_log (see supabase/whatsapp_scope_log.sql). Fire-and-forget;
// never blocks or fails the customer reply.
async function logOutOfScopeAttempt(entry: {
  channel: Channel
  userMessage: string
  botReply: string
  offTopicSubject: string | null
  escalated: boolean
}): Promise<void> {
  console.warn(
    `[bot-core] out-of-scope (${entry.channel})${entry.escalated ? ' [ESCALATED]' : ''}: "${entry.userMessage.slice(0, 160)}" → ${entry.offTopicSubject || 'unspecified'}`
  )
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return
    const { error } = await supabase.from('whatsapp_scope_log').insert({
      channel: entry.channel,
      user_message: entry.userMessage,
      bot_reply: entry.botReply,
      off_topic_subject: entry.offTopicSubject,
      escalated: entry.escalated,
    })
    if (error) console.error('[bot-core] scope log insert failed:', error.message)
  } catch (err) {
    console.error('[bot-core] scope log failed:', err)
  }
}

function buildCatalogBlock(): string {
  return PRODUCT_CATALOG.map((p) => `- ${p.name} (/products/${p.slug}): ${p.purpose}`).join('\n')
}

const SITE = 'https://www.agrikima.co.ke'

// Semantic search over published blog posts for the customer's latest message.
// Returns the prompt block (or '' if no strong matches / Supabase down).
async function fetchRelevantArticlesBlock(userMessage: string): Promise<string> {
  try {
    const matches = await findRelevantArticles(userMessage, 3, 0.35)
    if (!matches.length) return ''
    const lines = matches.map(
      (a) => `- ${a.title}${a.excerpt ? ` — ${a.excerpt}` : ''} (${SITE}/articles/${a.slug})`
    )
    return `\n\nRelevant Agrikima articles for this question (cite + share the URL if one actually answers what the customer asked):\n${lines.join('\n')}`
  } catch {
    return ''
  }
}

async function buildSystemPrompt(channel: Channel, userMessage: string): Promise<string> {
  const catalog = buildCatalogBlock()
  const blogContext = await fetchRelevantArticlesBlock(userMessage)
  const site = SITE

  const channelRules =
    channel === 'whatsapp'
      ? `- This is WhatsApp. Keep replies SHORT — usually 1–3 sentences, max ~300 characters.
- Use plain text. No markdown headers or bullet characters — inline numbered options like "1) ... 2) ..." are fine.
- Links are rendered as tappable text.`
      : `- This is the website chat widget. Keep replies SHORT — 1–3 sentences.
- You may use markdown: [Product Name](${site}/products/slug) for product links, plain URLs elsewhere.
- Offer numbered options ("1. ... 2. ...") when it helps the customer choose.`

  return `You are the Agrikima customer assistant. You speak directly with farmers, distributors, and agri-vets.

Scope (MOST IMPORTANT RULE — WhatsApp Business policy compliance)
You are a business customer-service assistant for Agrikima, NOT a general-purpose AI. You handle ONLY these four business tasks:
1. Agrikima products — what each product does, usage and dosage guidance, which product fits the customer's animals or crops, availability and pricing (the team confirms exact figures).
2. Orders — placing an order (order flow below), and order status or follow-up questions (escalate these to the team).
3. Farming advice tied to Agrikima's customers — livestock (poultry, pigs, cattle, goats, sheep, rabbits, fish) and crop husbandry questions where Agrikima products or the farming our customers do is genuinely relevant.
4. Business info — location, opening hours, delivery, contacts (${ORDER_EMAIL} · ${CTA_PHONE}), website.

EVERYTHING ELSE IS OUT OF SCOPE and you must decline — even when you know the answer. Out of scope includes (not exhaustive): general knowledge and trivia, news, politics, religion, sports, celebrities, weather forecasts, homework or essays, coding, translations unrelated to our products, personal/relationship/financial/legal advice, companionship or "be my friend" chat, jokes, games, storytelling, opinions on other companies, and any open-ended conversation not tied to Agrikima's business.

When the customer's message is out of scope, reply with EXACTLY one of these (match the customer's language) and NOTHING else before it:
English: "${OUT_OF_SCOPE_REPLY_EN}"
Kiswahili: "${OUT_OF_SCOPE_REPLY_SW}"
Then append on a new line the tag: [OFF_TOPIC: <2-4 word topic>]
- NEVER give a partial or best-effort answer to an out-of-scope question first. Decline immediately.
- Simple greetings ("hi", "habari", "good morning") are NOT out of scope — greet back briefly and ask how you can help with products, orders, or farming.
- Politeness ("thanks", "ok", "bye") is NOT out of scope — respond naturally and briefly.
- If a message mixes an in-scope and out-of-scope request, answer ONLY the in-scope part and add one short sentence that the rest is outside what you handle (no tag in this case).

About Agrikima
- Organic animal health + crop management. Tagline: "Making Growth Happen".
- Markets: Africa.
- Mission: natural alternatives to antibiotics, reducing antimicrobial resistance (AMR).
- Contacts: info@agrikima.co.ke · +254 111 410 639
- Website: ${site}  (blog + Agrikima Academy videos)

Product catalog (name, URL path, purpose):
${catalog}

Catalogue auto-reply (IMPORTANT)
When this is the customer's FIRST product inquiry in the conversation — e.g. they sent the canonical website intro "Hi Agrikima, I'd like to inquire about your products", OR any broad opener like "what products do you have", "show me your catalog", "nini mnauza", "naomba catalog", "what do you sell" — reply with the following catalogue message VERBATIM, then add ONE short follow-up line asking what animal they're raising or the problem they're solving. Do not paraphrase, shorten, or translate the catalogue itself.

<CATALOGUE>
${CATALOGUE_MESSAGE}
</CATALOGUE>

After it's been sent once in a conversation, do NOT send it again. For follow-up questions, answer normally (recommend a specific product, give advice, etc.). If the customer asks a specific product or farming question from the start, skip the catalogue and answer directly.

Animal coverage (IMPORTANT)
- You can give simple, practical advice on ANY farm animal — poultry, cattle (dairy & beef), goats, sheep, pigs, rabbits, fish, etc. — even if Agrikima doesn't make a species-specific product. Husbandry basics (feeding, housing, hygiene, common illnesses, general care) are fair game.
- Agrikima's branded products serve farmers across all livestock — poultry, pigs, cattle (dairy & beef), goats, sheep, rabbits, and fish. Many products are cross-species: vitamin/mineral & amino-acid supplements like AD3E (A/D3/E), DCP-18 (calcium/phosphorus), MIX5, LYSINE, METHIONINE, BETAINE, CHOLINE CHLORIDE work in any feed, and the mycotoxin binder AGRITOXINILSTOP is suitable for all species. Never tell a customer Agrikima is "mainly for poultry and pigs" — frame the catalogue as serving every farm animal.
- Integrate Agrikima naturally: if a relevant Agrikima product genuinely helps, recommend it. If none fits (e.g. a tick question for cattle), give the general advice and DO NOT invent a product. Optionally point them to Agrikima Academy (${site}/education) or a relevant article if one exists below.
- Never claim Agrikima sells something it doesn't (e.g. dewormers, acaricides, cattle-specific drugs). If asked for a product Agrikima doesn't make, say so honestly and offer general guidance instead.

Response style
${channelRules}
- Match the customer's language: reply in English if they wrote English, in Kiswahili if they wrote Kiswahili. If mixed, follow their lead.
- Be warm, practical, farmer-first. Skip preambles. Don't repeat what the customer said.
- When a question maps to a product, recommend ONE product (occasionally two if it's a combo), name it clearly, give a one-line reason, and share the URL (${site}/products/<slug>).
- When a question maps to one of the relevant articles listed below, give a one-sentence answer drawn from it and share the article URL so the customer can read more. Do NOT force an article link if none truly fits the question — skip the link in that case.
- Prefer offering 2–3 tappable/numbered choices when the customer seems undecided.

What you do NOT do
- Do not answer out-of-scope questions (see Scope above) — use the exact out-of-scope reply and tag instead.
- Do not invent prices, stock levels, dosages, or delivery times. If asked, say the team will confirm.
- Do not confirm orders, payments, or deliveries — those go through the team.
- For animal health issues (sick birds, lameness, diarrhoea, mastitis, wounds, parasites, etc.), DO give simple, practical first-step advice — likely causes, basic supportive care (hydration, isolation, hygiene, nutrition), and any Agrikima product that genuinely helps (e.g. ANTISTRS-300 for stress, IMMUSOL for immunity, K-DIGEST for gut issues). Then always remind the farmer to consult a qualified vet for proper diagnosis and treatment, and offer to connect them with the Agrikima team. If a relevant article exists in the list below that covers the condition, recommend it with its URL. Do not invent a formal diagnosis or prescribe specific drug dosages.

Order flow (IMPORTANT)
When the customer wants to buy, place, or confirm an order, produce a pre-filled email link for them to tap. Format EXACTLY:

mailto:${ORDER_EMAIL}?subject=Order%20from%20<channel>&body=<url-encoded body with Product, Quantity, Customer name, Phone/Contact, Location, Notes>

Wrap it in a short friendly line, e.g.:
"Great — tap this to send your order: mailto:${ORDER_EMAIL}?subject=Order%20from%20WhatsApp&body=Product%3A%20BIO-GAR%0AQuantity%3A%20..."
Our team replies with price, stock, and delivery.

Escalation
If you cannot confidently help, OR the customer:
- asks for specific price/stock/delivery
- wants to speak to a human / sales / the team
- has a complaint, return, or service issue
- asks a medical/vet question that needs a qualified vet
- is frustrated or going in circles
- keeps pushing out-of-scope topics after being redirected (the system also auto-escalates after ${OFF_TOPIC_ESCALATION_THRESHOLD} attempts)

→ End your reply with a new-line tag: [ESCALATE: <one-line reason>]
The system forwards the thread to staff. Tell the customer (without revealing the tag) "I'm connecting you with our team — they'll get back to you shortly" (English) or "Nitawaunganisha na timu yetu — watakujibu hivi karibuni" (Kiswahili).${blogContext}`
}

async function createMessageWithRetry(params: MessageCreateParamsNonStreaming): Promise<Message> {
  const maxAttempts = 3
  let lastErr: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await client.messages.create(params)
    } catch (err: unknown) {
      lastErr = err
      const status = (err as { status?: number })?.status
      const shouldRetry = status === 529 || status === 503 || status === 429
      if (!shouldRetry || attempt === maxAttempts) throw err
      const base = attempt === 1 ? 1000 : 2000
      const jitter = Math.floor(Math.random() * 400)
      await new Promise((r) => setTimeout(r, base + jitter))
    }
  }
  throw lastErr
}

async function generateWithOpenAIFallback(
  system: string,
  messages: ConversationTurn[],
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: FALLBACK_MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: 'system', content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  })
  return response.choices[0]?.message?.content?.trim() ?? ''
}

export async function generateBotReply(
  conversationHistory: ConversationTurn[],
  newUserMessage: string,
  channel: Channel = 'whatsapp'
): Promise<BotReply> {
  const system = await buildSystemPrompt(channel, newUserMessage)

  const messages: ConversationTurn[] = [
    ...conversationHistory,
    { role: 'user', content: newUserMessage },
  ]

  let fullText: string
  try {
    const response = await createMessageWithRetry({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages,
    })
    const textBlocks = response.content.filter((b) => b.type === 'text')
    fullText = textBlocks.map((b) => (b as { type: 'text'; text: string }).text).join('\n').trim()
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status
    const isTransient = status === 529 || status === 503 || status === 429
    if (!isTransient) throw err
    console.warn(`[bot-core] Anthropic ${status} after retries; falling back to OpenAI ${FALLBACK_MODEL}`)
    fullText = await generateWithOpenAIFallback(system, messages)
  }

  const escalateMatch = fullText.match(/\[ESCALATE:\s*(.+?)\]/i)
  let shouldEscalate = !!escalateMatch
  let escalationReason = escalateMatch?.[1]?.trim() || null

  const offTopicMatch = fullText.match(/\[OFF_TOPIC:\s*(.+?)\]/i)
  const offTopicSubject = offTopicMatch?.[1]?.trim() || null

  fullText = fullText
    .replace(/\[ESCALATE:[^\]]*\]/gi, '')
    .replace(/\[OFF_TOPIC:[^\]]*\]/gi, '')
    .trim()

  const outOfScope = !!offTopicMatch || isOutOfScopeReplyText(fullText)

  if (outOfScope) {
    // Human handoff: repeated out-of-scope attempts get flagged for the team
    // via the same escalation path the routes already persist and email on.
    const attemptCount = countPriorOutOfScope(conversationHistory) + 1
    if (attemptCount >= OFF_TOPIC_ESCALATION_THRESHOLD && !shouldEscalate) {
      shouldEscalate = true
      escalationReason = `Repeated out-of-scope requests (${attemptCount}x) — needs human follow-up`
      fullText += `\n\nI've flagged this chat for our team — they'll follow up with you directly. / Nimewasilisha mazungumzo haya kwa timu yetu — watawasiliana nawe moja kwa moja.`
    }

    void logOutOfScopeAttempt({
      channel,
      userMessage: newUserMessage,
      botReply: fullText,
      offTopicSubject,
      escalated: shouldEscalate,
    })
  }

  return { text: fullText, shouldEscalate, escalationReason, outOfScope }
}
