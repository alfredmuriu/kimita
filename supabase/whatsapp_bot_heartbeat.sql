-- Liveness tracking for the Baileys WhatsApp bridge running on the Hetzner VPS.
--
-- The VPS bot POSTs /api/whatsapp/heartbeat every few minutes. A separate cron
-- hits /api/whatsapp/heartbeat-check, and if the last beat is too old it emails
-- staff — otherwise a dead bot is only discovered when a customer complains.
--
-- One row per bot id (currently just 'whatsapp-bot'), upserted in place.
--
-- ⚠️ Run this ONCE in the Supabase SQL editor. Until you do, the heartbeat
-- routes return 500 with a clear message (they check for the missing table),
-- rather than failing silently.

create table if not exists whatsapp_bot_heartbeat (
  id text primary key,                    -- bot identifier, e.g. 'whatsapp-bot'
  last_seen_at timestamptz not null,      -- last heartbeat received
  status text,                            -- 'connected' | 'starting' | free text
  -- Set when a down-alert email goes out; cleared on the next heartbeat. Stops
  -- the checker emailing every run for one outage, and lets it send exactly one
  -- "recovered" note when the bot comes back.
  alerted_at timestamptz
);

-- Service-role client bypasses RLS; enabling it keeps anon/authed users out.
alter table whatsapp_bot_heartbeat enable row level security;
