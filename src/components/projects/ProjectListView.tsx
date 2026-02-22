"use client"

import { GlowButton } from "@/components/ui/GlowButton"
import { ProjectCard } from "./ProjectCard"
import { GitHubOverviewStats } from "./GitHubOverviewStats"
import type { Project, ProjectTask, ProjectStatus } from "@/lib/types"

interface ProjectListViewProps {
  projects: Project[]
  tasks: ProjectTask[]
  onSelectProject: (id: string) => void
  onOpenAddModal: () => void
}

const STATUS_ORDER: ProjectStatus[] = ["active", "paused", "archived"]
const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Active",
  paused: "Paused",
  archived: "Archived",
}

export function ProjectListView({ projects, tasks, onSelectProject, onOpenAddModal }: ProjectListViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white/80">Projects</h2>
        <GlowButton variant="cosmic" size="sm" onClick={onOpenAddModal}>
          + Add Project
        </GlowButton>
      </div>

      <GitHubOverviewStats />

      {STATUS_ORDER.map((status) => {
        const group = projects.filter((p) => p.status === status)
        if (group.length === 0) return null
        return (
          <div key={status} className="space-y-3">
            <p className="text-xs text-white/30 uppercase tracking-wider font-medium">
              {STATUS_LABEL[status]} ({group.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasks.filter((t) => t.project_id === project.id)}
                  onClick={() => onSelectProject(project.id)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {projects.length === 0 && (
        <p className="text-sm text-white/30 text-center py-8">
          No projects yet. Add one from your GitHub repos.
        </p>
      )}
    </div>
  )
}
