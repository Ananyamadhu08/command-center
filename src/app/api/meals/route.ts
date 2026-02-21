import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_MEAL_LOGS } from "@/lib/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const logOnly = searchParams.get("logs") === "true"

  if (!isSupabaseConfigured()) {
    let filtered = SAMPLE_MEAL_LOGS
    if (date) filtered = filtered.filter((m) => m.date === date)
    return NextResponse.json({ success: true, data: filtered })
  }

  const supabase = getSupabase()!

  if (logOnly) {
    let query = supabase.from("meal_logs").select("*").order("created_at", { ascending: false })
    if (date) query = query.eq("date", date)
    const { data, error } = await query
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  let query = supabase.from("meal_plans").select("*").order("date", { ascending: false }).limit(1)
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

  if (body.meal_type && body.description) {
    const { data, error } = await supabase
      .from("meal_logs")
      .insert({
        date: body.date ?? new Date().toISOString().split("T")[0],
        meal_type: body.meal_type,
        description: body.description,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  if (body.plan) {
    const { data, error } = await supabase
      .from("meal_plans")
      .upsert({
        date: body.date ?? new Date().toISOString().split("T")[0],
        plan: body.plan,
        cook_instructions: body.cook_instructions ?? "",
      })
      .select()
      .single()

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
}
