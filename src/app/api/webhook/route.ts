import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
  }

  const supabase = getSupabase()!
  const body = await request.json()
  const { type: webhookType } = body

  switch (webhookType) {
    case "brief": {
      const { brief_type, title, content, date } = body
      if (!brief_type || !title || !content) {
        return NextResponse.json({ success: false, error: "Missing brief fields" }, { status: 400 })
      }
      const { data, error } = await supabase
        .from("briefs")
        .insert({
          type: brief_type,
          title,
          content,
          date: date ?? new Date().toISOString().split("T")[0],
        })
        .select()
        .single()

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, data })
    }

    case "meal_plan": {
      const { plan, cook_instructions, date } = body
      if (!plan) {
        return NextResponse.json({ success: false, error: "Missing plan" }, { status: 400 })
      }
      const { data, error } = await supabase
        .from("meal_plans")
        .upsert({
          date: date ?? new Date().toISOString().split("T")[0],
          plan,
          cook_instructions: cook_instructions ?? "",
        })
        .select()
        .single()

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, data })
    }

    default:
      return NextResponse.json(
        { success: false, error: `Unknown webhook type: ${webhookType}` },
        { status: 400 },
      )
  }
}
