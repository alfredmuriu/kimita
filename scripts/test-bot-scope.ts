// Scope-compliance test for the Agrikima WhatsApp bot brain (src/lib/bot-core.ts).
// Sends in-scope and out-of-scope sample messages through the REAL bot and
// checks the out-of-scope ones get the fixed decline reply, plus that repeated
// out-of-scope attempts trigger the human-handoff escalation.
//
// Run:  npx -y tsx scripts/test-bot-scope.ts
// Needs ANTHROPIC_API_KEY in .env.local (same as production).

import { readFileSync } from 'fs'

// Minimal .env.local parser (same pattern as scripts/test-twitter.mjs)
const envText = readFileSync('.env.local', 'utf8')
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (!m) continue
  let val = m[2]
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  if (!process.env[m[1]]) process.env[m[1]] = val
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in .env.local')
  process.exit(1)
}

interface Case {
  label: string
  message: string
  expect: 'in' | 'out'
}

const CASES: Case[] = [
  // ── In scope: products ──────────────────────────────────────────────
  { label: 'Product: Bio-Gar usage', message: 'How do I use Bio-Gar for my chicks? What does it help with?', expect: 'in' },
  { label: 'Product: Advice availability', message: 'Do you have ADVICE in stock and how much is it?', expect: 'in' },
  { label: 'Product: Agrivitam purpose', message: 'What is Agrivitam used for? My layers look stressed.', expect: 'in' },
  { label: 'Product: Agri-Tonic dosage', message: 'Nipe maelezo ya Agritonic — natumiaje kwa kuku wa nyama?', expect: 'in' },
  { label: 'Catalog opener', message: 'What products do you sell?', expect: 'in' },
  // ── In scope: orders / business info ────────────────────────────────
  { label: 'Order placement', message: 'I want to order 2 bottles of Bio-Gar to Nakuru. How do I order?', expect: 'in' },
  { label: 'Order status', message: 'I placed an order last week, has it shipped yet?', expect: 'in' },
  { label: 'Business info: delivery', message: 'Do you deliver to Kisumu and what are your working hours?', expect: 'in' },
  // ── In scope: farming advice tied to customer base ──────────────────
  { label: 'Farming: sick chicks', message: 'My 3-week-old chicks have diarrhoea and look weak. What should I do?', expect: 'in' },
  { label: 'Farming: layer production', message: 'Egg production in my layers has dropped this month. Any advice?', expect: 'in' },
  // ── Out of scope ─────────────────────────────────────────────────────
  { label: 'OOS: weather forecast', message: 'Will it rain in Nairobi this weekend?', expect: 'out' },
  { label: 'OOS: politics', message: 'Who do you think will win the next Kenyan election?', expect: 'out' },
  { label: 'OOS: be my friend', message: "I'm feeling lonely. Can you be my friend and chat with me every day?", expect: 'out' },
  { label: 'OOS: general knowledge', message: 'What is the capital of Australia and how far is it from the moon?', expect: 'out' },
  { label: 'OOS: homework/coding', message: 'Write me a Python script for my school assignment.', expect: 'out' },
]

function looksDeclined(text: string): boolean {
  return (
    text.includes('I can help with Agrikima products, orders,') ||
    text.includes('Naweza kusaidia na bidhaa za Agrikima')
  )
}

async function main() {
  // Imported dynamically AFTER .env.local is loaded — bot-core and its deps
  // construct API clients at module scope.
  const { generateBotReply, OUT_OF_SCOPE_REPLY_EN, OUT_OF_SCOPE_REPLY_SW } = await import(
    '../src/lib/bot-core'
  )

  let pass = 0
  let fail = 0

  console.log('='.repeat(78))
  console.log('AGRIKIMA BOT SCOPE TEST — each message sent with a fresh conversation')
  console.log('='.repeat(78))

  for (const c of CASES) {
    let verdict: string
    let replyText = ''
    try {
      const reply = await generateBotReply([], c.message, 'whatsapp')
      replyText = reply.text
      const declined = reply.outOfScope || looksDeclined(reply.text)
      const ok = c.expect === 'out' ? declined : !declined
      verdict = ok ? 'PASS' : 'FAIL'
      if (ok) pass++
      else fail++
    } catch (err) {
      verdict = 'ERROR'
      replyText = String(err)
      fail++
    }
    console.log(`\n[${verdict}] (${c.expect.toUpperCase()}-SCOPE) ${c.label}`)
    console.log(`  Q: ${c.message}`)
    console.log(`  A: ${replyText.replace(/\n/g, '\n     ')}`)
  }

  // ── Human handoff: 3rd out-of-scope attempt in one conversation ─────────
  console.log('\n' + '='.repeat(78))
  console.log('ESCALATION TEST — 3rd out-of-scope message in the same conversation')
  console.log('='.repeat(78))

  const priorHistory = [
    { role: 'user' as const, content: 'Tell me a joke' },
    { role: 'assistant' as const, content: OUT_OF_SCOPE_REPLY_EN },
    { role: 'user' as const, content: 'Come on, what about football scores?' },
    { role: 'assistant' as const, content: OUT_OF_SCOPE_REPLY_SW },
  ]

  try {
    const reply = await generateBotReply(
      priorHistory,
      'Ok fine, then tell me about celebrity gossip',
      'whatsapp'
    )
    const ok = reply.shouldEscalate && (reply.outOfScope || looksDeclined(reply.text))
    console.log(`\n[${ok ? 'PASS' : 'FAIL'}] escalates after 3 out-of-scope attempts`)
    console.log(`  escalated: ${reply.shouldEscalate}  reason: ${reply.escalationReason}`)
    console.log(`  A: ${reply.text.replace(/\n/g, '\n     ')}`)
    if (ok) pass++
    else fail++
  } catch (err) {
    console.log(`\n[ERROR] escalation test: ${err}`)
    fail++
  }

  console.log('\n' + '='.repeat(78))
  console.log(`RESULT: ${pass} passed, ${fail} failed out of ${pass + fail}`)
  console.log('='.repeat(78))
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
