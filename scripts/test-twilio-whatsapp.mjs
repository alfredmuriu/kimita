import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_FROM;
const to = process.env.TWILIO_WHATSAPP_TEST_TO;

if (!sid || !token || !from || !to) {
  console.error('Missing TWILIO_* env vars in .env.local');
  process.exit(1);
}

const body = process.argv.slice(2).join(' ') || 'Hello from Agrikima via Twilio sandbox.';

const params = new URLSearchParams({ To: to, From: from, Body: body });

const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
  method: 'POST',
  headers: {
    Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: params,
});

const json = await res.json();
console.log('status:', res.status);
console.log(JSON.stringify(json, null, 2));
process.exit(res.ok ? 0 : 1);
