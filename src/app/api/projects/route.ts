import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"
import * as store from "@/lib/local-store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("id")
  const allTasks = searchParams.get("tasks") === "all"

  if (!isSupabaseConfigured()) {
    if (allTasks) {
      return NextResponse.json({ success: true, data: store.getProjectTasks() })
    }
    if (projectId) {
      return NextResponse.json({ success: true, data: store.getProjectTasks(projectId) })
    }
    return NextResponse.json({ success: true, data: store.getProjects() })
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
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    // Delete task
    if (body.delete_task_id) {
      const deleted = store.deleteTask(body.delete_task_id as string)
      if (!deleted) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
      return NextResponse.json({ success: true })
    }

    // Update task
    if (body.task_id) {
      const updates: Record<string, unknown> = {}
      if (body.status) updates.status = body.status
      if (body.title) updates.title = body.title
      if (body.description !== undefined) updates.description = body.description
      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ success: false, error: "No updates provided" }, { status: 400 })
      }
      const updated = store.updateTask(body.task_id as string, updates)
      if (!updated) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
      return NextResponse.json({ success: true, data: updated })
    }

    // Create task
    if (body.project_id && body.title) {
      const insert: Record<string, unknown> = {
        project_id: body.project_id,
        title: body.title,
      }
      if (body.description) insert.description = body.description
      if (body.status) insert.status = body.status
      const created = store.createTask(insert)
      return NextResponse.json({ success: true, data: created })
    }

    // Create project
    if (body.name && body.repo) {
      const created = store.createProject({
        name: body.name,
        repo: body.repo,
        description: body.description ?? "",
      })
      return NextResponse.json({ success: true, data: created })
    }

    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }

  const supabase = getSupabase()!

  if (body.delete_task_id) {
    const { error } = await supabase.from("project_tasks").delete().eq("id", body.delete_task_id)
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (body.task_id) {
    const updates: Record<string, unknown> = {}
    if (body.status) updates.status = body.status
    if (body.title) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "No updates provided" }, { status: 400 })
    }
    const { data, error } = await supabase
      .from("project_tasks")
      .update(updates)
      .eq("id", body.task_id)
      .select()
      .single()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  }

  if (body.project_id && body.title) {
    const insert: Record<string, unknown> = {
      project_id: body.project_id,
      title: body.title,
    }
    if (body.description) insert.description = body.description
    if (body.status) insert.status = body.status
    const { data, error } = await supabase
      .from("project_tasks")
      .insert(insert)
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
