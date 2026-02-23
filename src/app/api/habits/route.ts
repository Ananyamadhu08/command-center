import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_HABITS, SAMPLE_HABIT_LOGS } from "@/lib/sample-data"
import { COLORS, DEFAULT_COLOR } from "@/lib/colors"

const VALID_COLORS: Set<string> = new Set(COLORS.map((c) => c.name))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const logsOnly = searchParams.get("logs") === "true"
  const date = searchParams.get("date")

  if (!isSupabaseConfigured()) {
    if (logsOnly) {
      let filtered = SAMPLE_HABIT_LOGS
      if (date) filtered = filtered.filter((l) => l.date === date)
      return NextResponse.json({ success: true, data: filtered })
    }
    return NextResponse.json({ success: true, data: SAMPLE_HABITS })
  }

  const supabase = getSupabase()!

  if (logsOnly) {
    let query = supabase.from("habit_logs").select("*").order("date", { ascending: false })
    if (date) query = query.eq("date", date)
    const { data, error } = await query
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  const { data, error } = await supabase.from("habits").select("*").order("created_at")
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
  }

  const supabase = getSupabase()!

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  if (body.habit_id !== undefined) {
    const { data, error } = await supabase
      .from("habit_logs")
      .upsert({
        habit_id: body.habit_id,
        date: body.date ?? new Date().toISOString().split("T")[0],
        completed: body.completed ?? true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  if (body.name) {
    const { data, error } = await supabase
      .from("habits")
      .insert({
        name: body.name,
        icon: body.icon ?? "🎯",
        color: typeof body.color === "string" && VALID_COLORS.has(body.color) ? body.color : (DEFAULT_COLOR as string),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
}
