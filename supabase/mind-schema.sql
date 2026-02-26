-- The Mind — Personal Knowledge Base
-- Run this after enabling pgvector: create extension if not exists vector;

create extension if not exists vector;

create table mind_items (
  id               uuid primary key default gen_random_uuid(),
  type             text not null check (type in ('article','highlight','image','code','thought','screenshot')),
  title            text,
  content          text,
  summary          text,
  url              text,
  source_domain    text,
  image_url        text,
  language         text,
  tags             text[] default '{}',
  embedding        vector(1536),
  access_count     int default 0,
  last_accessed_at timestamptz,
  created_at       timestamptz default now()
);

-- Vector similarity index for semantic search
create index mind_items_embedding_idx
  on mind_items using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Fast filtering indexes
create index mind_items_tags_idx on mind_items using gin (tags);
create index mind_items_type_idx on mind_items (type);
create index mind_items_created_idx on mind_items (created_at desc);
create index mind_items_domain_idx on mind_items (source_domain);

-- Semantic search function (cosine similarity via pgvector)
create or replace function mind_search(
  query_embedding vector(1536),
  match_count int default 20
)
returns table (
  id uuid,
  type text,
  title text,
  content text,
  summary text,
  url text,
  source_domain text,
  image_url text,
  language text,
  tags text[],
  access_count int,
  last_accessed_at timestamptz,
  created_at timestamptz,
  similarity float
)
language plpgsql as $$
begin
  return query
  select
    mi.id, mi.type, mi.title, mi.content, mi.summary,
    mi.url, mi.source_domain, mi.image_url, mi.language,
    mi.tags, mi.access_count, mi.last_accessed_at, mi.created_at,
    1 - (mi.embedding <=> query_embedding) as similarity
  from mind_items mi
  where mi.embedding is not null
  order by mi.embedding <=> query_embedding
  limit match_count;
end;
$$;
