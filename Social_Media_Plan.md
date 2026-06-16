# Agrikima Social Media Plan

_Last updated: 2026-06-16_

## Summary

Two separate tracks: (1) a WhatsApp bot on a spare number using open-wa, and
(2) Zernio for LinkedIn + Instagram posting. Twitter and Facebook stay as they
are.

---

## 1. Social Media Posting

| Platform   | How it posts            | Status            |
|------------|-------------------------|-------------------|
| Twitter    | Our own publisher       | Live — unchanged  |
| Facebook   | Our own publisher       | Live — unchanged  |
| LinkedIn   | **Zernio**              | Code wired — needs API key |
| Instagram  | **Zernio**              | Code wired — needs API key |
| TikTok     | (later)                 | Stub — not in use yet      |

**Why Zernio:** Handles the platform API access we were blocked on.
LinkedIn + Instagram = **2 connected accounts = free tier ($0/month)**.
Confirmed 2026-06-16: free tier = first 2 accounts, unlimited posts, full API
access, no card (zernio.com/social-media-api).

**Code: DONE (2026-06-16).** `src/lib/publishers/zernio.ts` posts to
`https://zernio.com/api/v1/posts` with `publishNow: true` (+ `mediaItems` for
images). `linkedin.ts` and `instagram.ts` delegate to it (dispatchers unchanged
— same function names). Instagram skips cleanly if no image. Stays dormant until
creds set. `publish-next` only adds LinkedIn/Instagram to its publishable list
when `ZERNIO_API_KEY` is present. TikTok reverted to its pending-approval stub.

**Accounts connected in Zernio (2026-06-16):**
- LinkedIn — `Agrikima Africa` (org) — account ID `6a30ee095f7d1751abd1a8d7`
- Instagram — `Agrikima Kenya` (@agrikima.ke) — account ID `6a2a6f2d5f7d1751ab7c87d2`

**To go live (you) — set these env vars in Vercel:**
- `ZERNIO_API_KEY` — your `sk_` key
- `ZERNIO_LINKEDIN_ACCOUNT_ID=6a30ee095f7d1751abd1a8d7`
- `ZERNIO_INSTAGRAM_ACCOUNT_ID=6a2a6f2d5f7d1751ab7c87d2`

---

## 2. WhatsApp Bot

**Tool:** open-wa (automates WhatsApp Web via QR scan).

**Why:** Our Meta WhatsApp Business account is restricted (business
verification), which blocks the official API. open-wa bypasses this because it
logs in like a normal phone.

**Important conditions:**
- **Use a SPARE number**, not our main +254 111 410 639 — open-wa breaks
  WhatsApp's terms, so the number it runs on can get banned.
- **Needs an always-on host (a VPS, ~$5/month)** — it cannot run on Vercel.
- Treat it as a **temporary bridge** while we work on clearing the Meta
  restriction for a proper, official bot later.

**To do:**
- Pick a host (VPS) for the bot.
- Confirm open-wa's free tier covers our needs.
- Build the bot host — it reuses our existing bot "brain" unchanged.

---

## Open Questions

- **Meta restriction:** The real long-term fix for WhatsApp is resolving the
  business-verification restriction in Meta Business Manager.
- **Zernio pricing:** Confirm the free-tier details on Zernio's site before
  relying on $0.
