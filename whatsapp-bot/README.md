# Agrikima WhatsApp Bot (open-wa bridge)

A small standalone service that connects a **spare** WhatsApp number to the
Agrikima marketing-agent chat brain. Incoming WhatsApp messages are forwarded to
the deployed `/api/chat` endpoint; the AI reply is sent back to the sender.

It does **not** contain the AI logic — that stays in the Next.js app and keeps
improving on its own. This is just the bridge.

## ⚠️ Read first

- **Runs on a VPS, not Vercel.** open-wa keeps a live headless-browser WhatsApp
  Web session running 24/7. Serverless can't do that. Budget ~$5/mo.
- **Spare number only.** open-wa violates WhatsApp's ToS; the number it runs on
  can be banned. Never use the main business line (+254 111 410 639).
- **Temporary bridge.** The real fix is clearing the Meta business-verification
  restriction and using the official WhatsApp Business API. Retire this once that
  lands.

## How it works

```
WhatsApp message
   → open-wa session (this bot, on the VPS)
      → POST {CHAT_API_URL}   header x-cron-secret: {AGENT_CRON_SECRET}
         → Claude brain replies (same as the marketing-agent chat box)
      ← reply
   → sent back to the WhatsApp sender
```

Each contact gets a session id `whatsapp:<their-number>`, so the brain keeps
per-contact conversation history (it already persists history in Supabase).

Auth: the Next.js middleware already lets `x-cron-secret: AGENT_CRON_SECRET`
through for `/api/chat` (same as the cron jobs), so no password/cookie is needed.

## Deploy to a VPS (Ubuntu example)

1. **Provision** any small Ubuntu VPS (Hetzner / DigitalOcean / etc.), SSH in.

2. **Install Node 18+ and Chromium deps** (open-wa drives a real browser):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   # Chromium runtime libraries open-wa/puppeteer needs:
   sudo apt-get install -y libgbm-dev libnss3 libatk-bridge2.0-0 \
     libgtk-3-0 libasound2 libx11-xcb1 libxcomposite1 libxdamage1 \
     libxrandr2 libxss1 fonts-liberation
   ```

3. **Copy this folder up** and install:
   ```bash
   cd whatsapp-bot
   npm install
   cp .env.example .env
   nano .env   # set AGENT_CRON_SECRET (and CHAT_API_URL if not the default)
   ```

4. **First run — scan the QR** (once):
   ```bash
   npm start
   ```
   A QR code prints in the terminal. On the **spare** phone: WhatsApp →
   Settings → Linked Devices → Link a Device → scan it. The session is saved, so
   future restarts won't need the QR.

5. **Keep it running** with pm2 so it survives reboots:
   ```bash
   sudo npm install -g pm2
   pm2 start index.js --name agrikima-whatsapp
   pm2 save
   pm2 startup        # run the command it prints
   ```

   Logs: `pm2 logs agrikima-whatsapp`. Restart: `pm2 restart agrikima-whatsapp`.

## Config (.env)

| Var | Required | What |
|-----|----------|------|
| `CHAT_API_URL` | yes | Deployed brain endpoint. Default `https://www.agrikima.co.ke/api/chat`. |
| `AGENT_CRON_SECRET` | yes | Must match the Vercel project's value. Auths the bot to `/api/chat`. |
| `ALLOWED_NUMBERS` | no | Comma-separated allowlist (digits, country code, no `+`). Empty = reply to everyone. |

## Notes

- Group messages, status broadcasts, and non-text messages are ignored.
- If `ALLOWED_NUMBERS` is empty the bot answers **anyone** who messages the spare
  number — set the allowlist before pointing the public at it.
- Never commit `.env` or the open-wa session files (see `.gitignore`).
