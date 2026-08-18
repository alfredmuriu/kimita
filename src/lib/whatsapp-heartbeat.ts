// Shared identity for the Baileys WhatsApp bridge's heartbeat row.
//
// Lives here rather than in the heartbeat route because Next's App Router only
// allows a fixed set of exports from a route.ts — exporting this constant from
// there fails the production type check, even though the dev server tolerates it.
export const BOT_ID = 'whatsapp-bot'
