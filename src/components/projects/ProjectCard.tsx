"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { cn } from "@/lib/utils"
import type { Project, ProjectTask } from "@/lib/types"

interface ProjectCardProps {
  project: Project
  tasks: ProjectTask[]
  onClick: () => void
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  paused: "bg-amber/20 text-amber-light border-amber/30",
  archived: "bg-white/10 text-white/40 border-white/10",
}

export function ProjectCard({ project, tasks, onClick }: ProjectCardProps) {
  const done = tasks.filter((t) => t.status === "done").length
  const total = tasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <GlassCard onClick={onClick} className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white/90 truncate">{project.name}</h3>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            STATUS_STYLES[project.status],
          )}
        >
          {project.status}
        </span>
      </div>

      <p className="text-xs text-white/40 font-mono truncate">{project.repo}</p>

      {project.description && (
        <p className="text-xs text-white/50 line-clamp-2">{project.description}</p>
      )}

      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[10px] text-white/40">
          <span>{done}/{total} tasks</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cosmic to-electric transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </GlassCard>
  )
}
