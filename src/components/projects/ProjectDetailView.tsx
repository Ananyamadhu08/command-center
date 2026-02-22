"use client"

import { GlowButton } from "@/components/ui/GlowButton"
import { ProjectTaskList } from "./ProjectTaskList"
import { GitHubStatsPanel } from "./GitHubStatsPanel"
import { cn } from "@/lib/utils"
import type { Project, ProjectTask, TaskStatus } from "@/lib/types"

interface ProjectDetailViewProps {
  project: Project
  tasks: ProjectTask[]
  onBack: () => void
  onAddTask: (title: string) => void
  onCycleStatus: (taskId: string, newStatus: TaskStatus) => void
  onDeleteTask: (taskId: string) => void
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  paused: "bg-amber/20 text-amber-light border-amber/30",
  archived: "bg-white/10 text-white/40 border-white/10",
}

export function ProjectDetailView({
  project,
  tasks,
  onBack,
  onAddTask,
  onCycleStatus,
  onDeleteTask,
}: ProjectDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GlowButton variant="ghost" size="sm" onClick={onBack}>
          &larr; Back
        </GlowButton>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-white/90">{project.name}</h2>
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cosmic-light/70 hover:text-cosmic-light font-mono transition-colors"
          >
            {project.repo} &nearr;
          </a>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            STATUS_STYLES[project.status],
          )}
        >
          {project.status}
        </span>
      </div>

      {project.description && (
        <p className="text-sm text-white/40">{project.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectTaskList
          tasks={tasks}
          projectId={project.id}
          onAddTask={onAddTask}
          onCycleStatus={onCycleStatus}
          onDeleteTask={onDeleteTask}
        />
        <GitHubStatsPanel repo={project.repo} />
      </div>
    </div>
  )
}
