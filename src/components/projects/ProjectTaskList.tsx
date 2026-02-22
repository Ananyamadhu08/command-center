"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { cn } from "@/lib/utils"
import type { ProjectTask, TaskStatus } from "@/lib/types"

interface ProjectTaskListProps {
  tasks: ProjectTask[]
  projectId: string
  onAddTask: (title: string) => void
  onCycleStatus: (taskId: string, newStatus: TaskStatus) => void
  onDeleteTask: (taskId: string) => void
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
}

const STATUS_BADGE: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "todo", className: "bg-white/10 text-white/50 border-white/10" },
  in_progress: { label: "in progress", className: "bg-electric/20 text-electric-light border-electric/30" },
  done: { label: "done", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
}

function groupByStatus(tasks: ProjectTask[]): Record<TaskStatus, ProjectTask[]> {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  }
}

export function ProjectTaskList({ tasks, onAddTask, onCycleStatus, onDeleteTask }: ProjectTaskListProps) {
  const [newTitle, setNewTitle] = useState("")
  const groups = groupByStatus(tasks)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddTask(trimmed)
    setNewTitle("")
  }

  return (
    <GlassCard hover={false} className="space-y-4">
      <h3 className="text-base font-semibold text-white/70">Tasks</h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 placeholder:text-white/30 focus:border-cosmic/50 focus:outline-none focus:ring-1 focus:ring-cosmic/30"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="rounded-lg border border-cosmic/30 bg-cosmic/20 px-3 py-1.5 text-xs font-medium text-cosmic-light transition-all hover:bg-cosmic/30 disabled:opacity-40"
        >
          Add
        </button>
      </form>

      <div className="space-y-3">
        {(["in_progress", "todo", "done"] as TaskStatus[]).map((status) => {
          const items = groups[status]
          if (items.length === 0) return null
          return (
            <div key={status} className="space-y-1.5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
                {STATUS_BADGE[status].label} ({items.length})
              </p>
              {items.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
                >
                  <button
                    onClick={() => onCycleStatus(task.id, NEXT_STATUS[task.status])}
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all hover:scale-105",
                      STATUS_BADGE[task.status].className,
                    )}
                    title={`Click to move to ${NEXT_STATUS[task.status]}`}
                  >
                    {STATUS_BADGE[task.status].label}
                  </button>
                  <span
                    className={cn(
                      "flex-1 text-sm truncate",
                      task.status === "done" ? "text-white/30 line-through" : "text-white/70",
                    )}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 text-xs transition-all"
                    title="Delete task"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )
        })}
        {tasks.length === 0 && (
          <p className="text-xs text-white/30 text-center py-2">No tasks yet</p>
        )}
      </div>
    </GlassCard>
  )
}
