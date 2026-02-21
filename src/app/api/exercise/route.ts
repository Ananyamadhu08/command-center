import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_EXERCISE_LOGS } from "@/lib/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!isSupabaseConfigured()) {
    let filtered = SAMPLE_EXERCISE_LOGS
    if (date) filtered = filtered.filter((e) => e.date === date)
    return NextResponse.json({ success: true, data: filtered })
  }

  const supabase = getSupabase()!
  let query = supabase.from("exercise_logs").select("*").order("created_at", { ascending: false })
  if (date) query = query.eq("date", date)
  const { data, error } = await query
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
  }

  const supabase = getSupabase()!
  const body = await request.json()
  const { date, type, duration_minutes, notes } = body

  if (!type || !duration_minutes) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("exercise_logs")
    .insert({
      date: date ?? new Date().toISOString().split("T")[0],
      type,
      duration_minutes,
      notes: notes ?? "",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
