-- Article-aware WhatsApp/web chat bot: vector search over published blog posts.
-- Run this once in the Supabase SQL editor.

create extension if not exists vector;

alter table blog_posts
  add column if not exists embedding vector(1536);

create index if not exists blog_posts_embedding_idx
  on blog_posts using hnsw (embedding vector_cosine_ops);

create or replace function match_articles(
  query_embedding vector(1536),
  match_count int default 3,
  min_similarity float default 0.4
)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  category text,
  similarity float
)
language sql stable
as $$
  select
    p.id,
    p.slug,
    p.title,
    p.excerpt,
    p.category,
    1 - (p.embedding <=> query_embedding) as similarity
  from blog_posts p
  where p.status = 'published'
    and p.embedding is not null
    and 1 - (p.embedding <=> query_embedding) >= min_similarity
  order by p.embedding <=> query_embedding
  limit match_count;
$$;
