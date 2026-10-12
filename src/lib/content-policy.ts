// Single source of truth for which content types the social agent is allowed to
// post. Enforced twice: at plan time (/api/marketing/run) so the digest matches
// what ships, and at dispatch time (publish-next, publish-scheduled) so posts
// already sitting pending in the DB from an earlier policy never go out.
// Carousels are disabled because the agent only ever attaches a single poster
// image — the "Slide 1… Slide 2…" caption promised a slideshow that never
// existed. Pending carousels from earlier cycles sit out, same as articles.
export const DISABLED_CONTENT_TYPES = ['article', 'carousel'] as const

export function isDisabledContentType(contentType: string | null | undefined): boolean {
  return !!contentType && (DISABLED_CONTENT_TYPES as readonly string[]).includes(contentType)
}

// ── Deliverability guardrail ─────────────────────────────────────────────────
// The planner LLM happily invents things Agrikima can't back up: webinars that
// aren't scheduled, "success stories" from farmers who don't exist (a fabricated
// "Karanja from Nakuru" testimonial went live on Facebook 2026-10-06), giveaways
// nobody approved. Rule: only post content that stands on its own without a
// real-world commitment, a real person, or a promise we'd have to keep.
//
// Injected into the strategy and generator prompts, and backed by a pattern check
// at plan time (topic + brief) and again at dispatch (final copy) so a slip by the
// model is dropped rather than published.
export const CONTENT_GUARDRAILS = `CONTENT GUARDRAILS — these are hard rules, never break them:
Only plan/write content Agrikima can stand behind TODAY with no follow-up action:
farmer education and practical tips, animal-health and disease awareness, AMR and
responsible antibiotic use, product explainers (what Advice, Biogar, Agritonic,
Agrivitam do and how to use them), seasonal advice, and commentary on real industry news.

NEVER plan or write any of the following — Agrikima cannot deliver them:
- Webinars, live sessions, livestreams, workshops, trainings, field days, events,
  "join us", "register now", "save the date" — none are scheduled.
- Testimonials, success stories, case studies, customer quotes, "meet [farmer]",
  "a day in the life of" a farmer, or ANY named or quoted farmer/customer —
  real or fictional. We have no consented stories to share.
- Giveaways, contests, competitions, discounts, promo codes, free samples, prices or offers.
- Partnership, award, new-product or company announcements.
- Precise statistics you cannot attribute to a real source (e.g. "80% of diseases
  start in the gut"). Use well-established facts or qualitative wording instead.
- Medical guarantees or promises of specific results ("double your yields", "cures").`

// Belt-and-braces check for the categories above. Kept to phrases that are
// unambiguous in a farming post, so ordinary copy ("join the fight against AMR")
// doesn't trip it. Returns a short label for the first violation, or null.
const UNDELIVERABLE_PATTERNS: Array<[label: string, re: RegExp]> = [
  ['webinar/event', /\b(webinars?|live ?stream|live session|workshops?|field days?|save the date|register (now|today|here)|sign up (now|today|here)|join us (for|on|at|live))\b/i],
  ['testimonial', /\b(testimonials?|success stor(y|ies)|case stud(y|ies)|customer stor(y|ies)|day in the life)\b/i],
  ['named farmer', /\b(meet [A-Z][a-z]+,|[A-Z][a-z]+, an? (\w+ )?farmer (from|in)\b)/],
  ['giveaway/offer', /\b(giveaways?|contests?|promo codes?|free samples?|\d+% off|discount)\b/i],
]

export function findUndeliverableContent(text: string | null | undefined): string | null {
  if (!text) return null
  for (const [label, re] of UNDELIVERABLE_PATTERNS) {
    if (re.test(text)) return label
  }
  return null
}
