import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_NOTES } from "@/lib/sample-data"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, data: SAMPLE_NOTES })
  }

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
  }

  const supabase = getSupabase()!
  const body = await request.json()
  if (!body.content?.trim()) {
    return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({ content: body.content.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
