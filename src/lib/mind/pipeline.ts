/**
 * The Mind — Save processing pipeline.
 * Orchestrates: type detection → content extraction → summary → tags → embedding → store.
 */

import { getSupabase } from "@/lib/supabase"
import { detectContentType, detectLanguage, extractDomain } from "./extract"
import { generateSummary, generateTags, generateEmbedding } from "./ai"
import type { MindItem } from "@/lib/types"

export interface SaveInput {
  url?: string | null
  content?: string | null
  title?: string | null
  type?: string | null
  image_url?: string | null
}

export interface SaveResult {
  item: MindItem
  ai_processed: boolean
}

export async function processSave(input: SaveInput): Promise<SaveResult> {
  const supabase = getSupabase()
  if (!supabase) throw new Error("Supabase not configured")

  const type = detectContentType(input)
  let content = input.content ?? ""
  let title = input.title ?? null
  const url = input.url ?? null
  const image_url = input.image_url ?? null
  const source_domain = url ? extractDomain(url) : null
  let language: string | null = null

  // ── Content extraction based on type ──
  if (type === "article" && url && !content) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "CommandCenter/1.0" },
        signal: AbortSignal.timeout(10000),
      })
      if (res.ok) {
        const html = await res.text()
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        if (!title && titleMatch) {
          title = titleMatch[1].trim()
        }
        content = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 10000)
      }
    } catch {
      // Failed to fetch — save with URL only
    }
  }

  if (type === "code" && content) {
    language = detectLanguage(content)
  }

  if (!title && type === "article" && source_domain) {
    title = `Article from ${source_domain}`
  }

  // ── AI processing (summary, tags, embedding) ──
  const textForAI = [title, content].filter(Boolean).join("\n\n")
  let aiProcessed = false

  let summary: string | null = null
  let tags: string[] = []
  let embedding: number[] | null = null

  if (textForAI.length > 0) {
    const [summaryResult, tagsResult, embeddingResult] = await Promise.allSettled([
      generateSummary(textForAI, title),
      generateTags(textForAI, title),
      generateEmbedding(textForAI),
    ])

    summary = summaryResult.status === "fulfilled" ? summaryResult.value : null
    tags = tagsResult.status === "fulfilled" ? tagsResult.value : []
    embedding = embeddingResult.status === "fulfilled" ? embeddingResult.value : null
    aiProcessed = embedding !== null
  }

  // ── Store in Supabase ──
  const record: Record<string, unknown> = {
    type,
    title,
    content: content || null,
    summary,
    url,
    source_domain,
    image_url,
    language,
    tags,
    access_count: 0,
  }

  if (embedding) {
    record.embedding = JSON.stringify(embedding)
  }

  const { data, error } = await supabase
    .from("mind_items")
    .insert(record)
    .select("id, type, title, content, summary, url, source_domain, image_url, language, tags, access_count, last_accessed_at, created_at")
    .single()

  if (error) throw new Error(error.message)

  return {
    item: data as MindItem,
    ai_processed: aiProcessed,
  }
}
