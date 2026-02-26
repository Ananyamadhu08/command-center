/**
 * The Mind — Search & retrieval.
 * Semantic search via pgvector with re-ranking by recency and access frequency.
 * Falls back to text search when embeddings aren't available.
 */

import { getSupabase } from "@/lib/supabase"
import { generateEmbedding } from "./ai"
import type { MindItem } from "@/lib/types"

export interface SearchResult {
  item: MindItem
  similarity: number
}

export async function semanticSearch(
  query: string,
  limit: number = 20,
): Promise<SearchResult[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const embedding = await generateEmbedding(query)

  if (embedding) {
    // ── Vector similarity search ──
    const { data, error } = await supabase.rpc("mind_search", {
      query_embedding: JSON.stringify(embedding),
      match_count: limit,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data) {
      return (data as (MindItem & { similarity: number })[]).map((row) => ({
        item: {
          id: row.id,
          type: row.type,
          title: row.title,
          content: row.content,
          summary: row.summary,
          url: row.url,
          source_domain: row.source_domain,
          image_url: row.image_url,
          language: row.language,
          tags: row.tags,
          access_count: row.access_count,
          last_accessed_at: row.last_accessed_at,
          created_at: row.created_at,
        },
        similarity: row.similarity,
      }))
    }
  }

  // ── Fallback: text search ──
  return textSearch(query, limit)
}

export async function textSearch(
  query: string,
  limit: number = 20,
): Promise<SearchResult[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1)

  if (terms.length === 0) return []

  // Search across title, content, summary, and tags
  const orConditions = terms
    .flatMap((term) => [
      `title.ilike.%${term}%`,
      `content.ilike.%${term}%`,
      `summary.ilike.%${term}%`,
    ])
    .join(",")

  const { data, error } = await supabase
    .from("mind_items")
    .select("*")
    .or(orConditions)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return []

  return (data as MindItem[]).map((item) => ({
    item,
    similarity: 0.5,
  }))
}
