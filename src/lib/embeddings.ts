import OpenAI from 'openai'
import { getSupabaseAdmin } from './supabase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const EMBEDDING_MODEL = 'text-embedding-3-small'

export interface MatchedArticle {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string | null
  similarity: number
}

export async function embedText(text: string): Promise<number[]> {
  const input = text.replace(/\s+/g, ' ').trim().slice(0, 8000)
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input })
  return res.data[0].embedding
}

export async function findRelevantArticles(
  query: string,
  limit = 3,
  minSimilarity = 0.4
): Promise<MatchedArticle[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []
  try {
    const queryEmbedding = await embedText(query)
    const { data, error } = await supabase.rpc('match_articles', {
      query_embedding: queryEmbedding,
      match_count: limit,
      min_similarity: minSimilarity,
    })
    if (error) {
      console.error('match_articles RPC failed:', error.message)
      return []
    }
    return (data || []) as MatchedArticle[]
  } catch (err) {
    console.error('findRelevantArticles failed:', err)
    return []
  }
}

export async function embedAndStoreArticle(
  id: string,
  title: string,
  excerpt: string | null,
  content: string | null
): Promise<void> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return
  const stripped = (content || '').replace(/<[^>]+>/g, ' ')
  const text = [title, excerpt || '', stripped].filter(Boolean).join('\n\n')
  if (!text.trim()) return
  const embedding = await embedText(text)
  const { error } = await supabase
    .from('blog_posts')
    .update({ embedding })
    .eq('id', id)
  if (error) console.error(`Failed to store embedding for ${id}:`, error.message)
}
