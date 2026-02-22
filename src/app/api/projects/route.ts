import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { SAMPLE_PROJECTS, SAMPLE_PROJECT_TASKS } from "@/lib/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("id")

  const allTasks = searchParams.get("tasks") === "all"

  if (!isSupabaseConfigured()) {
    if (allTasks) {
      return NextResponse.json({ success: true, data: SAMPLE_PROJECT_TASKS })
    }
    if (projectId) {
      const tasks = SAMPLE_PROJECT_TASKS.filter((t) => t.project_id === projectId)
      return NextResponse.json({ success: true, data: tasks })
    }
    return NextResponse.json({ success: true, data: SAMPLE_PROJECTS })
  }

  const supabase = getSupabase()!

  if (allTasks) {
    const { data, error } = await supabase.from("project_tasks").select("*").order("created_at")
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  if (projectId) {
    const { data, error } = await supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at")
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  const { data, error } = await supabase.from("projects").select("*").order("created_at")
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

  if (body.delete_task_id) {
    const { error } = await supabase.from("project_tasks").delete().eq("id", body.delete_task_id)
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (body.task_id && body.status) {
    const { data, error } = await supabase
      .from("project_tasks")
      .update({ status: body.status })
      .eq("id", body.task_id)
      .select()
      .single()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  if (body.project_id && body.title) {
    const { data, error } = await supabase
      .from("project_tasks")
      .insert({ project_id: body.project_id, title: body.title })
      .select()
      .single()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  if (body.name && body.repo) {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: body.name,
        repo: body.repo,
        description: body.description ?? "",
      })
      .select()
      .single()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
}
