# WhatsApp Bot — Resume Checklist (finish the VPS setup)

Rechecked **2026-08-14**. Everything except the WhatsApp login is done and
verified. The only remaining steps are a **one-time QR scan** (needs the spare
phone in hand) and **pm2** for 24/7 running. ~10 minutes.

> ⚠️ This file previously described the **open-wa** host and its Google Chrome
> workaround. That is obsolete — commit `d7f2fd8` replaced open-wa with
> **Baileys**, which talks to WhatsApp over a WebSocket with **no browser at
> all**. Ignore any older instructions mentioning Chromium, `mime@3`,
> `useChrome`, or `_IGNORE_agrikima`; the thing that kept timing out is gone.

---

## Verified working as of 2026-08-14

- ✅ **Hetzner VPS is alive** — `<VPS-IP>` (CX23, Falkenstein, Ubuntu),
  TCP/22 answering. Project "Agrikima", ~$6.49/mo.
- ✅ **Bridge endpoint is deployed and correct** —
  `https://www.agrikima.co.ke/api/whatsapp/bridge` returns **401** without the
  secret and a full catalogue reply **with** it (tested live, 200 in ~10s).
- ✅ **`AGENT_CRON_SECRET` confirmed** — the local/Vercel value matches the one
  in the server `.env`, so there's no 401 risk. (Value deliberately not written
  here: `origin` is a **public** repo.)
- ✅ **Bot host rewritten to Baileys** — no Chromium dependency, QR prints
  straight to the terminal.

So the customer brain, the auth, and the server are all proven. The **only**
untested link in the chain is the WhatsApp session itself.

---

## Which number to use

Use a **disposable spare number**. Baileys is an unofficial WhatsApp client and
breaks WhatsApp's terms of service — the number can be banned without warning.

- ❌ **Never** the main business line **+254 111 410 639**.
- ❌ **Not** +254 762 122 122 either, unless you first delete the Twilio sender
  and de-register it from the Cloud API. A number registered to the WhatsApp
  Business Platform **cannot** be used in the normal WhatsApp app, and Linked
  Devices is what Baileys needs. Doing this also throws away the Meta/Twilio
  progress on that number.
- ✅ A spare SIM whose WhatsApp you can log into on a phone you're holding.

---

## Step 1 — Connect and update the server

In Windows PowerShell:
```powershell
ssh root@<VPS-IP>
```

Then on the server — **this pull is required**, the server still has the old
open-wa code:
```bash
cd ~/agrikimawebsiterevamp
git pull
cd whatsapp-bot
npm install
```

`npm install` will bring in Baileys and drop the old open-wa tree. If npm
complains about leftovers: `rm -rf node_modules package-lock.json && npm install`.

Sanity-check `.env` is still there (`cat .env`) — it needs:
```
CHAT_API_URL=https://www.agrikima.co.ke/api/whatsapp/bridge
AGENT_CRON_SECRET=<copy from Vercel>
ALLOWED_NUMBERS=
```

## Step 2 — Scan the QR (one time)

```bash
npm start
```

- A **QR code** prints within a few seconds — much faster than the old open-wa
  path, since there's no browser to boot. Maximise the PowerShell window if the
  blocks look squished.
- On the **spare phone**: WhatsApp → **Settings** → **Linked Devices** →
  **Link a Device** → scan.
- Wait for: `[bot] Connected. Listening for messages…`
- The QR expires every ~20s and reprints automatically — just scan the newest.
- **Test:** from a *different* phone, message the spare number
  "What products do you have for poultry?" → expect the catalogue reply within
  ~10 seconds. Logs show `[bot] ←` then `[bot] →`.

The session is saved to `./auth_info`, so this is the only scan you ever do
(unless that folder is deleted or WhatsApp logs the device out).

## Step 3 — Keep it running 24/7 (pm2)

`npm start` only runs while PowerShell is open. Make it permanent — Ctrl+C first,
then:
```bash
npm install -g pm2
pm2 start index.js --name agrikima-whatsapp
pm2 save
pm2 startup
```
`pm2 startup` prints **one more command** (starts with `sudo env ...`) — copy
that exact line, paste it, run it. That's what makes the bot survive reboots.

Confirm:
```bash
pm2 status
```
`agrikima-whatsapp` should read `online`. You can now close PowerShell.

---

## Before sharing the number publicly

While testing, restrict who gets answers:
```bash
nano .env
```
Set `ALLOWED_NUMBERS` to comma-separated digits (country code, no `+`), e.g.
`254712345678,254790600972`. Save (Ctrl+O, Enter, Ctrl+X), then:
```bash
pm2 restart agrikima-whatsapp
```
Leave blank to answer everyone.

---

## Troubleshooting

- **QR never appears** → check `npm install` finished cleanly and that
  `@whiskeysockets/baileys` is in `node_modules`. There is no Chrome involved
  any more, so old Chromium fixes are irrelevant.
- **`Connection closed (code 401)` / asks to rescan** → session was logged out:
  `rm -rf auth_info`, `npm start`, rescan.
- **Keeps reconnecting in a loop** → usually WhatsApp rate-limiting a fresh
  link; wait a few minutes before rescanning.
- **`bridge API 401`** in logs → `AGENT_CRON_SECRET` in `.env` ≠ Vercel. Fix and
  `pm2 restart agrikima-whatsapp`.
- **`bridge API 5xx`** → the Next.js side; check Vercel function logs for
  `/api/whatsapp/bridge`.
- **Logs anytime:** `pm2 logs agrikima-whatsapp`

## Updating the bot later

```bash
cd ~/agrikimawebsiterevamp && git pull
cd whatsapp-bot && npm install
pm2 restart agrikima-whatsapp
```

---

## Key facts

- Server: Hetzner project "Agrikima", user `root`. IP is in the Hetzner console
  and in the private notes — not recorded here, since `origin`
  (`alfredmuriu/kimita`) is a **public** repo. Keep secrets and host addresses
  out of this file.
- Bridge: `https://www.agrikima.co.ke/api/whatsapp/bridge` — same bot-core brain,
  conversation history and escalation emails as the official Meta webhook.
- The repo clone on the server came from the **vercel** remote
  (`github.com/alfredmuriu/agrikimawebsiterevamp.git`) — `origin` is `kimita.git`
  and does not carry this folder. Push to both remotes.
- This is a **temporary bridge** on a spare number until the official Meta
  WhatsApp Business API is unblocked.
