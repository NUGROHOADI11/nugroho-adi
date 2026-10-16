-- ==============================================================================
-- PERSONAL AI RAG CHATBOT - POSTGRESQL / SUPABASE PGVECTOR SCHEMA
-- Author: Nugroho Adi
-- Purpose: Store chunked portfolio knowledge and vector embeddings for RAG
-- ==============================================================================

-- 1. Enable pgvector extension for high-performance vector similarity search
create extension if not exists vector;

-- 2. Create personal_knowledge table
create table if not exists personal_knowledge (
  id bigserial primary key,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(768),
  created_at timestamptz default now()
);

-- 3. Create HNSW (Hierarchical Navigable Small World) index for fast cosine similarity search
create index if not exists personal_knowledge_embedding_hnsw_idx
on personal_knowledge using hnsw (embedding vector_cosine_ops);

-- 4. Create Remote Procedure Call (RPC) matching function
create or replace function match_personal_knowledge (
  query_embedding vector(768),
  match_threshold float default 0.45,
  match_count int default 5
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    pk.id,
    pk.content,
    pk.metadata,
    1 - (pk.embedding <=> query_embedding) as similarity
  from personal_knowledge pk
  where 1 - (pk.embedding <=> query_embedding) > match_threshold
  order by (pk.embedding <=> query_embedding) asc
  limit match_count;
$$;
