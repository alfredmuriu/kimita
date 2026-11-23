# WhatsApp Bot: Go-Live on +254 762 122 122

Moves the bot onto the company number, running on the Hetzner VPS. Once finished,
it needs no laptop. Allow about an hour, and do Step 2 early in the day because it
is the only step with waiting that nobody controls.

The server IP and passwords are not in this file, because this repo is public.

**Have ready:** the phone with the 762 SIM (it must receive SMS), a second phone
for testing, the Hetzner login, the server root password, and `AGENT_CRON_SECRET`.

---

## Step 1: Confirm the server is really ours

SSH refuses the server because its identity keys changed since this laptop last
connected. A rebuild explains that, but check it before sending a password.

1. In the Hetzner console, open the server and launch the web **Console**.
2. Log in as root and run:
   ```bash
   ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
   ```
3. Compare the `SHA256:` value with the one in your private notes. If they differ,
   stop and find out why.
4. If they match, clear the old key on your laptop, then connect:
   ```powershell
   ssh-keygen -R <SERVER-IP>
   ssh root@<SERVER-IP>
   ```

## Step 2: Free the number from Twilio and Meta

762 is registered on the WhatsApp Business Platform, so the WhatsApp Business app
will not accept it until that registration is gone. **Deleting the sender cannot
be undone**: going back to Twilio means a new signup.

1. In WhatsApp Manager, turn off two-step verification for 762. Meta emails a
   confirmation link to the business portfolio's address.
2. Delete the Twilio sender for `whatsapp:+254762122122`.
3. On the 762 phone, install **WhatsApp Business** and register the number by SMS.
   If it is refused, wait and retry: numbers removed from the API can take a while
   to release.
4. Set the profile: Agrikima Africa, address, hours, website.

If the app asks for a six-digit PIN nobody has, use its "Forgot PIN" option.
That can involve a waiting period, so the go-live date may move.

## Step 3: Install the bot on the server

```bash
curl -fsSL https://raw.githubusercontent.com/alfredmuriu/kimita/main/whatsapp-bot/deploy/setup-server.sh -o setup-server.sh
bash setup-server.sh
```

This installs Node, pm2 and the bot into `/opt/agrikima`, enables start on boot, and
checks the secret against the live site. It finishes with `Setup complete`.

## Step 4: Scan the QR

```bash
cd /opt/agrikima/whatsapp-bot
npm start
```

1. Maximise the terminal so the QR is not squashed.
2. On the 762 phone: WhatsApp Business > **Linked Devices** > **Link a Device**.
3. Scan. The QR refreshes about every 20 seconds, so use the newest one.
4. Wait for `[bot] Connected. Listening for messages…`.
5. From the second phone, send 762 "What products do you have for poultry?". A reply
   should arrive within about 10 seconds.
6. Press **Ctrl+C**. The session stays saved in `auth_info`.

## Step 5: Run it permanently and prove it

```bash
pm2 start ecosystem.config.cjs
pm2 save
reboot
```

The reboot is the real test. Wait a minute, **shut your laptop**, and message 762
from the second phone. A reply proves the bot no longer needs the laptop.

If there is no reply, reconnect and run `pm2 status` and
`pm2 logs agrikima-whatsapp --lines 50`.

## Step 6: Send customers to the bot

The website chat button currently opens the **retired** line +254 111 410 639,
because the Vercel variable overrides the code. Until this step is done, nobody
reaches the bot from the website.

1. In Vercel, set `NEXT_PUBLIC_WHATSAPP_NUMBER` to `254762122122` for Production.
2. Redeploy. The value is baked in at build time, so saving it alone changes nothing.
3. On the live site, click the chat button and confirm it opens 762.

## Step 7: Turn on the outage alert

The watchdog has never been scheduled, so nobody is told if the bot goes down. Do
this after Step 5, or the first run emails a false alarm from the old heartbeat.

1. In cron-job.org, add a job every 15 minutes calling
   `https://www.agrikima.co.ke/api/whatsapp/heartbeat-check` with an
   `x-cron-secret` header set to `AGENT_CRON_SECRET`.
2. Run it once. It should return `"state":"alive"`.
3. Confirm `AGENT_NOTIFY_EMAILS` in Vercel holds an inbox someone reads.

Also run `supabase/whatsapp_scope_log.sql` in the Supabase SQL editor. Without that
table, the audit log of declined off-topic chats silently records nothing.

---

## Keeping it running

- **Keep the 762 phone in use.** Linked devices are reported to sign out after about
  14 days without the main phone being used. Keep it charged and on data, and open
  WhatsApp Business at least weekly.
- **Do not log 762 out on the phone** or remove the linked device.
- **The number can be banned.** Baileys is an unofficial client and breaks WhatsApp's
  terms. This remains a temporary bridge until the official API is available.

## If it stops

Any computer works, or use the Hetzner web console from a browser.

| Symptom in `pm2 logs agrikima-whatsapp` | Fix |
| --- | --- |
| `Logged out` (code 401) | Rescan, see below |
| `Session taken over` (code 440) | Stop the other copy, then `pm2 restart agrikima-whatsapp` |
| `bridge API 401` | Secret differs from Vercel: fix `.env`, then restart |
| `bridge API 5xx` | Website side: check Vercel logs for `/api/whatsapp/bridge` |
| Repeated reconnecting | Usually WhatsApp rate limiting: wait a few minutes |

To rescan:
```bash
pm2 stop agrikima-whatsapp
cd /opt/agrikima/whatsapp-bot
rm -rf auth_info
npm start        # scan, wait for Connected, Ctrl+C
pm2 restart agrikima-whatsapp
```

## Updating the bot later

Re-run `bash setup-server.sh`, then `pm2 start ecosystem.config.cjs` and `pm2 save`.
The WhatsApp session is kept, so no scan is needed.
