"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { TASK_STATUSES, TASK_STATUS_CONFIG } from "@/lib/types"
import type { ProjectTask, TaskStatus } from "@/lib/types"

interface ProjectTaskListProps {
  tasks: ProjectTask[]
  projectId: string
  onAddTask: (title: string, description: string, status: TaskStatus) => void
  onUpdateTask: (taskId: string, updates: Partial<Pick<ProjectTask, "title" | "description" | "status">>) => void
  onDeleteTask: (taskId: string) => void
}

export function ProjectTaskList({
  tasks,
  projectId,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ProjectTaskListProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null)

  const projectTasks = tasks.filter((t) => t.project_id === projectId)

  return (
    <GlassCard hover={false} className="space-y-4">
      {/* Header with + icon */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white/70">Tasks</h3>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          aria-label="Add task"
          className="flex size-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Empty state */}
      {projectTasks.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 py-8">
          <p className="text-xs text-white/30">No tasks allocated</p>
        </div>
      )}

      {/* Task list */}
      {projectTasks.length > 0 && (
        <div className="space-y-1.5">
          {projectTasks.map((task) => {
            const cfg = TASK_STATUS_CONFIG[task.status]
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTask(task)}
                className="group flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-left transition-all hover:border-white/15 hover:bg-white/5"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                  title={cfg.label}
                />
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <span className="text-xs leading-snug text-white/70 truncate">
                    {task.title}
                  </span>
                  {task.description && (
                    <span className="text-[10px] text-white/30 truncate">
                      {task.description}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-medium",
                    cfg.className,
                  )}
                >
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAddTask}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onSave={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </GlassCard>
  )
}

/* ---- Add Task Modal ---- */

function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (title: string, description: string, status: TaskStatus) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("backlog")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed, description.trim(), status)
    setTitle("")
    setDescription("")
    setStatus("backlog")
    onClose()
  }

  function handleClose() {
    setTitle("")
    setDescription("")
    setStatus("backlog")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="glass glow-cosmic relative z-10 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Add Task</h2>
          <button
            onClick={handleClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={200}
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:border-cosmic/50 focus:outline-none focus:ring-1 focus:ring-cosmic/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:border-cosmic/50 focus:outline-none focus:ring-1 focus:ring-cosmic/30 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {TASK_STATUSES.map((s) => {
                const cfg = TASK_STATUS_CONFIG[s]
                const active = s === status
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all",
                      active
                        ? cfg.className
                        : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                    )}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-lg border border-cosmic/30 bg-cosmic/20 px-3 py-1.5 text-xs font-medium text-cosmic-light hover:bg-cosmic/30 disabled:opacity-40"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---- Task Detail Modal ---- */

function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: {
  task: ProjectTask | null
  isOpen: boolean
  onClose: () => void
  onSave: (taskId: string, updates: Partial<Pick<ProjectTask, "title" | "description" | "status">>) => void
  onDelete: (taskId: string) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("backlog")

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title)
      setDescription(task.description ?? "")
      setStatus(task.status)
    }
  }, [task, isOpen])

  function handleSave() {
    if (!task) return
    const trimmed = title.trim()
    if (!trimmed) return
    onSave(task.id, {
      title: trimmed,
      description: description.trim() || undefined,
      status,
    })
    onClose()
  }

  function handleDelete() {
    if (!task) return
    onDelete(task.id)
    onClose()
  }

  function handleClose() {
    setTitle("")
    setDescription("")
    onClose()
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="glass glow-cosmic relative z-10 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Task Details</h2>
          <button
            onClick={handleClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 focus:border-cosmic/50 focus:outline-none focus:ring-1 focus:ring-cosmic/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:border-cosmic/50 focus:outline-none focus:ring-1 focus:ring-cosmic/30 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {TASK_STATUSES.map((s) => {
                const cfg = TASK_STATUS_CONFIG[s]
                const active = s === status
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all",
                      active
                        ? cfg.className
                        : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                    )}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {task.created_at && (
            <p className="text-[10px] text-white/20">
              Created {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!title.trim()}
                className="rounded-lg border border-cosmic/30 bg-cosmic/20 px-3 py-1.5 text-xs font-medium text-cosmic-light hover:bg-cosmic/30 disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
