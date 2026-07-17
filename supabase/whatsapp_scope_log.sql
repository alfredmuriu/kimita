-- Audit log of out-of-scope attempts declined by the customer assistant.
-- Used to verify the bot stays within its business-task scope before/after
-- Meta WhatsApp Business review. Written by src/lib/bot-core.ts (service role).
--
-- Run once in the Supabase SQL editor.

create table if not exists whatsapp_scope_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  channel text not null,                 -- 'whatsapp' | 'web'
  user_message text not null,            -- what the customer asked
  bot_reply text,                        -- the decline/redirect the bot sent
  off_topic_subject text,                -- model's 2-4 word topic label
  escalated boolean not null default false -- true when it triggered human handoff
);

create index if not exists whatsapp_scope_log_created_at_idx
  on whatsapp_scope_log (created_at desc);

-- Service-role client bypasses RLS; enabling it keeps anon/authed users out.
alter table whatsapp_scope_log enable row level security;
