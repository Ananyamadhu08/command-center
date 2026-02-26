import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_MIND_ITEMS } from "@/lib/mind/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const tag = searchParams.get("tag")
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100)
  const offset = Number(searchParams.get("offset") ?? 0)

  if (!isSupabaseConfigured()) {
    let filtered = SAMPLE_MIND_ITEMS
    if (type) filtered = filtered.filter((i) => i.type === type)
    if (tag) filtered = filtered.filter((i) => i.tags.includes(tag))
    return NextResponse.json({
      success: true,
      data: filtered.slice(offset, offset + limit),
      meta: { total: filtered.length },
    })
  }

  const supabase = getSupabase()!
  let query = supabase
    .from("mind_items")
    .select("id, type, title, content, summary, url, source_domain, image_url, language, tags, access_count, last_accessed_at, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) query = query.eq("type", type)
  if (tag) query = query.contains("tags", [tag])

  const { data, error, count } = await query
  if (error) {
    // Table doesn't exist yet — fall back to sample data
    if (error.message.includes("mind_items")) {
      let filtered = SAMPLE_MIND_ITEMS
      if (type) filtered = filtered.filter((i) => i.type === type)
      if (tag) filtered = filtered.filter((i) => i.tags.includes(tag))
      return NextResponse.json({
        success: true,
        data: filtered.slice(offset, offset + limit),
        meta: { total: filtered.length },
      })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    data,
    meta: { total: count ?? 0 },
  })
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 })
  }

  const supabase = getSupabase()!
  const { error } = await supabase.from("mind_items").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: { id } })
}
