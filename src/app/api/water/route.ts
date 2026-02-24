import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

/** In-memory fallback when Supabase is unavailable or table doesn't exist */
const DEMO_WATER: Record<string, number> = {}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") ?? todayStr()

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!
      const { data, error } = await supabase
        .from("water_logs")
        .select("glasses")
        .eq("date", date)
        .maybeSingle()

      if (!error) {
        return NextResponse.json({ success: true, data: { date, glasses: data?.glasses ?? 0 } })
      }
    } catch {
      // Fall through to demo mode
    }
  }

  const glasses = DEMO_WATER[date] ?? 0
  return NextResponse.json({ success: true, data: { date, glasses } })
}

export async function POST(request: Request) {
  const body = await request.json()
  const date = body.date ?? todayStr()
  const increment = body.increment ?? 1

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase()!

      const { data: existing } = await supabase
        .from("water_logs")
        .select("glasses")
        .eq("date", date)
        .maybeSingle()

      if (existing !== undefined) {
        const newCount = (existing?.glasses ?? 0) + increment
        const { data, error } = await supabase
          .from("water_logs")
          .upsert({ date, glasses: newCount })
          .select()
          .single()

        if (!error) {
          return NextResponse.json({ success: true, data: { date, glasses: data.glasses } })
        }
      }
    } catch {
      // Fall through to demo mode
    }
  }

  DEMO_WATER[date] = (DEMO_WATER[date] ?? 0) + increment
  return NextResponse.json({ success: true, data: { date, glasses: DEMO_WATER[date] } })
}
