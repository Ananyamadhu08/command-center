import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_MIND_ITEMS } from "@/lib/mind/sample-data"

export async function GET() {
  if (!isSupabaseConfigured()) {
    const tagCounts = new Map<string, number>()
    for (const item of SAMPLE_MIND_ITEMS) {
      for (const tag of item.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
    }
    const tags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({ success: true, data: tags })
  }

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("mind_items")
    .select("tags")

  if (error) {
    // Table doesn't exist — fall back to sample data tags
    if (error.message.includes("mind_items")) {
      const tagCounts = new Map<string, number>()
      for (const item of SAMPLE_MIND_ITEMS) {
        for (const tag of item.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
        }
      }
      const tags = Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
      return NextResponse.json({ success: true, data: tags })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  const tagCounts = new Map<string, number>()
  for (const row of data ?? []) {
    const tags = row.tags as string[] | null
    if (tags) {
      for (const tag of tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
    }
  }

  const tags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ success: true, data: tags })
}
