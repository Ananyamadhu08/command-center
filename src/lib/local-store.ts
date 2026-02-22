import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

const STORE_PATH = join(process.cwd(), ".local-store.json")

interface StoreData {
  projects: Record<string, unknown>[]
  project_tasks: Record<string, unknown>[]
}

function read(): StoreData {
  if (!existsSync(STORE_PATH)) {
    return { projects: [], project_tasks: [] }
  }
  try {
    const raw = readFileSync(STORE_PATH, "utf-8")
    return JSON.parse(raw) as StoreData
  } catch {
    return { projects: [], project_tasks: [] }
  }
}

function write(data: StoreData): void {
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8")
}

export function getProjects(): Record<string, unknown>[] {
  return read().projects
}

export function getProjectTasks(projectId?: string): Record<string, unknown>[] {
  const tasks = read().project_tasks
  if (projectId) {
    return tasks.filter((t) => t.project_id === projectId)
  }
  return tasks
}

export function createProject(project: Record<string, unknown>): Record<string, unknown> {
  const data = read()
  const entry = {
    ...project,
    id: crypto.randomUUID(),
    status: project.status ?? "active",
    created_at: new Date().toISOString(),
  }
  data.projects = [...data.projects, entry]
  write(data)
  return entry
}

export function createTask(task: Record<string, unknown>): Record<string, unknown> {
  const data = read()
  const entry = {
    ...task,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  data.project_tasks = [...data.project_tasks, entry]
  write(data)
  return entry
}

export function updateTask(
  taskId: string,
  updates: Record<string, unknown>,
): Record<string, unknown> | null {
  const data = read()
  const idx = data.project_tasks.findIndex((t) => t.id === taskId)
  if (idx === -1) return null
  const updated = { ...data.project_tasks[idx], ...updates }
  data.project_tasks = data.project_tasks.map((t, i) => (i === idx ? updated : t))
  write(data)
  return updated
}

export function deleteTask(taskId: string): boolean {
  const data = read()
  const before = data.project_tasks.length
  data.project_tasks = data.project_tasks.filter((t) => t.id !== taskId)
  if (data.project_tasks.length === before) return false
  write(data)
  return true
}
