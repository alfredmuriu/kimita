# WhatsApp Bot — Afternoon Setup Checklist

A plain, do-it-in-order checklist for getting the bot live on a Hetzner server,
from a Windows PC. Tick each box as you go. The exact commands for steps 1–5 are
in [DEPLOY-HETZNER-WINDOWS.md](DEPLOY-HETZNER-WINDOWS.md) — this page is the map;
that page is the detail.

If anything errors or looks different from what's described, stop and ask before
continuing.

---

## First, the key facts (read once)

- **The bot answers on a real WhatsApp number** — the spare SIM. You link it by
  scanning the "Linked Devices" QR (like WhatsApp Web). Customers chat that
  number normally; the bot replies from it.
- **Spare number only — it can be banned.** open-wa automates a normal account,
  which breaks WhatsApp's terms. NEVER use the main line +254 111 410 639. This
  is a temporary bridge until the official Meta API is unblocked.
- The spare number **can't also be logged into the WhatsApp app on another phone**
  at the same time as the bot (Linked Devices is fine; a second full login isn't).

## Have these ready before you start

- [ ] A credit/debit card or PayPal (for Hetzner).
- [ ] The **spare phone** with the spare number's WhatsApp set up and working.
- [ ] Your **`AGENT_CRON_SECRET`** value (✅ you have this) — copy it from Vercel
      → Project → Settings → Environment Variables if you need it again.
- [ ] ~30–45 minutes, uninterrupted.

---

## The 5 steps

### Step 1 — Create the Hetzner server
- [ ] Sign up at <https://www.hetzner.com/cloud>, add a payment method.
- [ ] *(Possible wait)* If Hetzner asks for ID verification, complete it and wait
      for the approval email. You can't create a server until it clears.
- [ ] In the Cloud Console: **New Project** → `agrikima` → **Add Server**.
- [ ] Choose: **Ubuntu 24.04**, type **CX22** (2 vCPU / 4 GB RAM), keep Public
      IPv4, name it `whatsapp-bot`. **Create & Buy now.**
- [ ] Save the **IP address** and **root password** Hetzner gives you.

### Step 2 — Connect & install (PowerShell)
- [ ] Open Windows PowerShell, run `ssh root@YOUR_SERVER_IP`, accept the prompt
      (`yes`), paste the password (nothing shows while typing — normal).
- [ ] Run the update, Node 20, and Chromium-library install commands from the
      deploy guide (Part 3).

### Step 3 — Get the code & configure
- [ ] Clone the repo and `cd agrikimawebsiterevamp/whatsapp-bot`, run
      `npm install` (Part 4).
- [ ] `cp .env.example .env`, then `nano .env` and set `AGENT_CRON_SECRET=`
      (leave `CHAT_API_URL` default). Save: Ctrl+O, Enter, Ctrl+X (Part 5).

### Step 4 — Link WhatsApp (the QR scan)
- [ ] Run `npm start`. A QR code prints in PowerShell.
- [ ] On the **spare phone**: WhatsApp → Settings → Linked Devices → Link a
      Device → scan the QR.
- [ ] Wait for `Connected. Listening for messages…`.
- [ ] Test: message the spare number from a different phone → expect an AI reply.
- [ ] Press **Ctrl+C** to stop (the login is saved).

### Step 5 — Keep it running 24/7
- [ ] Install pm2 and start the bot under it (Part 7):
      `npm install -g pm2`, `pm2 start index.js --name agrikima-whatsapp`,
      `pm2 save`, `pm2 startup` (then run the line it prints).
- [ ] Confirm with `pm2 status` (should show `online`).
- [ ] You can now close PowerShell — it keeps running.

---

## Before you share the number publicly
- [ ] Set `ALLOWED_NUMBERS` in `.env` (your team's numbers) while testing, OR
      accept that it replies to everyone once the number is shared.
      Edit with `nano .env`, then `pm2 restart agrikima-whatsapp`.

## If you get stuck this afternoon
Reconnect (`ssh root@YOUR_SERVER_IP`), run `pm2 logs agrikima-whatsapp`, and send
me the recent lines plus what step you were on. Common ones:
- **401 / Unauthorized in logs** → `AGENT_CRON_SECRET` in `.env` ≠ Vercel. Fix,
  then `pm2 restart agrikima-whatsapp`.
- **Asks for QR again** → session dropped: `pm2 stop agrikima-whatsapp`,
  `npm start`, rescan, Ctrl+C, `pm2 restart agrikima-whatsapp`.
