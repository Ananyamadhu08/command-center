import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_BRIEFS } from "@/lib/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const type = searchParams.get("type")

  if (!isSupabaseConfigured()) {
    let filtered = SAMPLE_BRIEFS
    if (date) filtered = filtered.filter((b) => b.date === date)
    if (type) filtered = filtered.filter((b) => b.type === type)
    return NextResponse.json({ success: true, data: filtered })
  }

  const supabase = getSupabase()!
  let query = supabase.from("briefs").select("*").order("created_at", { ascending: false })
  if (date) query = query.eq("date", date)
  if (type) query = query.eq("type", type)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
  }

  const supabase = getSupabase()!
  const body = await request.json()
  const { type, title, content, date } = body

  if (!type || !title || !content) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("briefs")
    .insert({ type, title, content, date: date ?? new Date().toISOString().split("T")[0] })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, data })
}
