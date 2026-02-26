import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

function today(): string {
  return new Date().toISOString().split("T")[0]
}

function fail(msg: string, status = 400) {
  return NextResponse.json({ success: false, error: msg }, { status })
}

function ok(data: unknown) {
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return fail("Supabase not configured", 503)
  }

  const supabase = getSupabase()!

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return fail("Invalid JSON body")
  }

  const { type: webhookType } = body

  switch (webhookType) {
    // ── Briefs ──────────────────────────────────────────────
    case "brief": {
      const { brief_type, title, content, date } = body as Record<string, string>
      if (!brief_type || !title || !content) {
        return fail("Missing brief fields: brief_type, title, content")
      }
      const { data, error } = await supabase
        .from("briefs")
        .insert({ type: brief_type, title, content, date: date ?? today() })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Meal Plan ───────────────────────────────────────────
    case "meal_plan": {
      const { plan, cook_instructions, date } = body as Record<string, string>
      if (!plan) {
        return fail("Missing field: plan")
      }
      const { data, error } = await supabase
        .from("meal_plans")
        .upsert({ date: date ?? today(), plan, cook_instructions: cook_instructions ?? "" })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Meal Log ────────────────────────────────────────────
    case "meal_log": {
      const { meal_type, description, date } = body as Record<string, string>
      if (!meal_type || !description) {
        return fail("Missing fields: meal_type, description")
      }
      const { data, error } = await supabase
        .from("meal_logs")
        .insert({ date: date ?? today(), meal_type, description })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Exercise ────────────────────────────────────────────
    case "exercise": {
      const { exercise_type, duration_minutes, notes, date } = body as Record<string, string>
      if (!exercise_type || !duration_minutes) {
        return fail("Missing fields: exercise_type, duration_minutes")
      }
      const minutes = Number(duration_minutes)
      if (!Number.isFinite(minutes) || minutes <= 0) {
        return fail("duration_minutes must be a positive number")
      }
      const { data, error } = await supabase
        .from("exercise_logs")
        .insert({
          date: date ?? today(),
          type: exercise_type,
          duration_minutes: minutes,
          notes: notes ?? "",
        })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Reading ─────────────────────────────────────────────
    case "reading": {
      const { book_title, pages_read, notes, date } = body as Record<string, string>
      if (!book_title || !pages_read) {
        return fail("Missing fields: book_title, pages_read")
      }
      const pages = Number(pages_read)
      if (!Number.isFinite(pages) || pages <= 0) {
        return fail("pages_read must be a positive number")
      }
      const { data, error } = await supabase
        .from("reading_logs")
        .insert({
          date: date ?? today(),
          book_title,
          pages_read: pages,
          notes: notes ?? "",
        })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Habit (create a new habit) ──────────────────────────
    case "habit_create": {
      const { name, icon, color } = body as Record<string, string>
      if (!name) {
        return fail("Missing field: name")
      }
      const { data, error } = await supabase
        .from("habits")
        .insert({ name, icon: icon ?? "◉", color: color ?? "violet" })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Habit Log (mark a habit completed/uncompleted) ──────
    case "habit_log": {
      const { habit_id, completed, date } = body as Record<string, unknown>
      if (!habit_id) {
        return fail("Missing field: habit_id")
      }
      const { data, error } = await supabase
        .from("habit_logs")
        .upsert(
          {
            habit_id: habit_id as string,
            date: (date as string) ?? today(),
            completed: completed !== false,
          },
          { onConflict: "habit_id,date" },
        )
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Note ────────────────────────────────────────────────
    case "note": {
      const { content } = body as Record<string, string>
      if (!content) {
        return fail("Missing field: content")
      }
      const { data, error } = await supabase
        .from("notes")
        .insert({ content })
        .select()
        .single()

      if (error) return fail(error.message, 500)
      return ok(data)
    }

    // ── Mind Save ─────────────────────────────────────────
    case "mind_save": {
      const { url, content, title, type: itemType, image_url } = body as Record<string, string>
      if (!url && !content && !image_url) {
        return fail("Missing at least one of: url, content, image_url")
      }
      const { processSave } = await import("@/lib/mind/pipeline")
      try {
        const result = await processSave({ url, content, title, type: itemType, image_url })
        return ok(result.item)
      } catch (e) {
        return fail(e instanceof Error ? e.message : "Mind save failed", 500)
      }
    }

    default:
      return fail(`Unknown webhook type: ${webhookType}`)
  }
}
