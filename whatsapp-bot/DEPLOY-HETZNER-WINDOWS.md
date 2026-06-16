# Deploying the WhatsApp Bot on Hetzner (Windows beginner walkthrough)

A complete, no-prior-experience guide to get the bot running 24/7 on a Hetzner
Cloud server, connecting from a **Windows** PC. Follow it top to bottom.

You'll need: a credit/debit card (for Hetzner), the **spare phone** with the spare
number's WhatsApp installed, and your `AGENT_CRON_SECRET` value (the same one set
in the Vercel project — ask whoever set up Vercel, or copy it from the Vercel
dashboard → Settings → Environment Variables).

Estimated time: ~30–45 minutes.

---

## Part 1 — Create the Hetzner server

1. Go to <https://www.hetzner.com/cloud> and click **Sign Up**. Create an
   account and add a payment method. (New accounts sometimes need a short manual
   verification — if so, wait for the approval email before continuing.)

2. In the Hetzner **Cloud Console** (<https://console.hetzner.cloud>), click
   **+ New Project**, name it `agrikima`, and open it.

3. Click **Add Server** and choose:
   - **Location:** any (Nuremberg or Falkenstein, Germany is fine).
   - **Image:** **Ubuntu 24.04**.
   - **Type:** **Shared vCPU → CX22** (2 vCPU, 4 GB RAM). This is the one to pick.
   - **Networking:** leave **Public IPv4** enabled (default).
   - **SSH keys:** skip for now — we'll use a password (simpler for a first time).
   - **Name:** `whatsapp-bot`.

4. Click **Create & Buy now**.

5. Hetzner emails you the server's **IP address** and a **root password**
   (or shows them in the console). Keep these two handy. The IP looks like
   `91.99.x.x`.

---

## Part 2 — Connect to the server from Windows

Windows 10/11 has SSH built in — no extra software needed.

1. Press the **Windows key**, type `powershell`, open **Windows PowerShell**.

2. Connect (replace `YOUR_SERVER_IP` with the IP from Hetzner):
   ```powershell
   ssh root@YOUR_SERVER_IP
   ```

3. The first time, it asks `Are you sure you want to continue connecting?` —
   type `yes` and press Enter.

4. Paste the root password when asked. **Note:** when typing/pasting a password
   in SSH, nothing shows on screen (no dots) — that's normal. Right-click pastes
   in PowerShell. Press Enter.

   If Hetzner forces a password change on first login, it'll ask you to type the
   current password again, then a new one twice. Save the new password.

You're now "inside" the server — the prompt changes to something like
`root@whatsapp-bot:~#`. Every command below runs **there**, not on your PC.

---

## Part 3 — Install what the bot needs

Copy–paste these one block at a time (right-click pastes), pressing Enter after
each. Wait for each to finish.

1. Update the system:
   ```bash
   apt-get update && apt-get upgrade -y
   ```

2. Install Node.js 20:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   ```

3. Install the Chromium libraries open-wa needs:
   ```bash
   apt-get install -y git libgbm-dev libnss3 libatk-bridge2.0-0 \
     libgtk-3-0 libasound2t64 libx11-xcb1 libxcomposite1 libxdamage1 \
     libxrandr2 libxss1 fonts-liberation
   ```
   (If `libasound2t64` errors, run the same line again with `libasound2`
   instead — package name varies by Ubuntu minor version.)

---

## Part 4 — Get the bot code onto the server

The bot lives in the `whatsapp-bot/` folder of the site repo. Clone the repo and
move into that folder:

```bash
git clone https://github.com/alfredmuriu/agrikimawebsiterevamp.git
cd agrikimawebsiterevamp/whatsapp-bot
npm install
```

`npm install` downloads open-wa and a bundled Chromium — it can take a few
minutes. Some warnings are normal; an actual error stops with `npm ERR!`.

---

## Part 5 — Configure the bot

1. Create the config file from the template:
   ```bash
   cp .env.example .env
   nano .env
   ```

2. `nano` is a simple text editor in the terminal. Fill in:
   - Leave `CHAT_API_URL` as the default (`https://www.agrikima.co.ke/api/whatsapp/bridge`).
   - Set `AGENT_CRON_SECRET=` to the exact value from Vercel.
   - Optionally set `ALLOWED_NUMBERS=` to a comma-separated list of numbers
     allowed to talk to the bot (digits, country code, no `+`). Leave blank to
     answer everyone while testing.

3. Save and exit nano: press **Ctrl+O**, then **Enter** (saves), then
   **Ctrl+X** (exits).

---

## Part 6 — First run & QR scan (one time)

1. Start the bot:
   ```bash
   npm start
   ```

2. After a moment, a **QR code** prints in the terminal (made of blocks).

3. On the **spare phone**: open WhatsApp → **Settings** → **Linked Devices** →
   **Link a Device** → point the camera at the QR code in the PowerShell window.

4. When it links, the terminal logs `Connected. Listening for messages…`.

5. Test it: from a *different* phone, send a WhatsApp message to the spare
   number. You should get an AI reply within a few seconds.

6. Stop the bot for now: press **Ctrl+C**. (The login is saved — you won't need
   to scan the QR again unless the session is lost.)

---

## Part 7 — Keep it running 24/7

Right now the bot only runs while that PowerShell window is open. We use **pm2**
so it runs in the background and restarts on reboot.

```bash
npm install -g pm2
pm2 start index.js --name agrikima-whatsapp
pm2 save
pm2 startup
```

`pm2 startup` prints **one more command** (starting with `sudo env ...`) — copy
that exact line, paste it, and run it. This makes the bot survive server reboots.

Useful pm2 commands later:
- See logs: `pm2 logs agrikima-whatsapp`
- Restart: `pm2 restart agrikima-whatsapp`
- Status: `pm2 status`

You can now close PowerShell — the bot keeps running on the server.

---

## Updating the bot later

When the bot code changes in the repo:
```bash
cd ~/agrikimawebsiterevamp
git pull
cd whatsapp-bot
npm install
pm2 restart agrikima-whatsapp
```

## If something breaks

- **Bot not replying?** Reconnect (`ssh root@YOUR_SERVER_IP`), run
  `pm2 logs agrikima-whatsapp`, and read the recent lines.
- **"Unauthorized" / 401 in logs?** `AGENT_CRON_SECRET` in `.env` doesn't match
  Vercel. Fix `.env` (`nano .env`), then `pm2 restart agrikima-whatsapp`.
- **Asks to scan QR again?** The WhatsApp session dropped. Run `pm2 stop
  agrikima-whatsapp`, then `npm start`, scan once more, Ctrl+C, then `pm2
  restart agrikima-whatsapp`.

## Reminders

- This runs on a **spare number** that can be banned by WhatsApp — never the main
  business line. It's a temporary bridge until the official Meta API is unblocked.
- Set `ALLOWED_NUMBERS` before sharing the number widely.
