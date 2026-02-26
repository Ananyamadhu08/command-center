import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase"
import { semanticSearch } from "@/lib/mind/search"
import { SAMPLE_MIND_ITEMS } from "@/lib/mind/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim()
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50)

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Missing query parameter: q" },
      { status: 400 },
    )
  }

  if (!isSupabaseConfigured()) {
    const terms = query.toLowerCase().split(/\s+/)
    const filtered = SAMPLE_MIND_ITEMS.filter((item) => {
      const haystack = [item.title, item.content, item.summary, ...item.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return terms.some((t) => haystack.includes(t))
    }).slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filtered.map((item) => ({ item, similarity: 0.5 })),
    })
  }

  try {
    const results = await semanticSearch(query, limit)
    return NextResponse.json({ success: true, data: results })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed"
    // Table doesn't exist — fall back to sample text search
    if (message.includes("mind_items") || message.includes("mind_search")) {
      const terms = query.toLowerCase().split(/\s+/)
      const filtered = SAMPLE_MIND_ITEMS.filter((item) => {
        const haystack = [item.title, item.content, item.summary, ...item.tags]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return terms.some((t) => haystack.includes(t))
      }).slice(0, limit)
      return NextResponse.json({
        success: true,
        data: filtered.map((item) => ({ item, similarity: 0.5 })),
      })
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
