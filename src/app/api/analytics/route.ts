import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  SAMPLE_EXERCISE_LOGS,
  SAMPLE_HABITS,
  SAMPLE_HABIT_LOGS,
  SAMPLE_READING_LOGS,
  SAMPLE_MEAL_LOGS,
} from "@/lib/sample-data"
import { computeAnalytics } from "@/lib/analytics"

export async function GET() {
  if (!isSupabaseConfigured()) {
    const analytics = computeAnalytics(
      SAMPLE_EXERCISE_LOGS,
      SAMPLE_HABITS,
      SAMPLE_HABIT_LOGS,
      SAMPLE_READING_LOGS,
      SAMPLE_MEAL_LOGS,
    )
    return NextResponse.json({ success: true, data: analytics })
  }

  // When Supabase is configured, fetch all data and compute
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    const [exerciseRes, habitsRes, habitLogsRes, readingRes, mealsRes] = await Promise.all([
      fetch(`${baseUrl}/api/exercise`).then((r) => r.json()),
      fetch(`${baseUrl}/api/habits`).then((r) => r.json()),
      fetch(`${baseUrl}/api/habits?logs=true`).then((r) => r.json()),
      fetch(`${baseUrl}/api/reading`).then((r) => r.json()),
      fetch(`${baseUrl}/api/meals?logs=true`).then((r) => r.json()),
    ])

    const analytics = computeAnalytics(
      exerciseRes.data ?? [],
      habitsRes.data ?? [],
      habitLogsRes.data ?? [],
      readingRes.data ?? [],
      mealsRes.data ?? [],
    )
    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to compute analytics"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
