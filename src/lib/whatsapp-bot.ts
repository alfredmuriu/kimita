// WhatsApp-specific wrapper around the shared bot brain in ./bot-core.
// Exports are kept for backward compatibility with the webhook route.

import { generateBotReply as coreGenerate, type BotReply, type ConversationTurn } from './bot-core'

export type { BotReply, ConversationTurn }

export async function generateBotReply(
  conversationHistory: ConversationTurn[],
  newUserMessage: string
): Promise<BotReply> {
  return coreGenerate(conversationHistory, newUserMessage, 'whatsapp')
}
