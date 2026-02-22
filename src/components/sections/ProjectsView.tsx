"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ProjectListView } from "@/components/projects/ProjectListView"
import { ProjectDetailView } from "@/components/projects/ProjectDetailView"
import { AddProjectModal } from "@/components/projects/AddProjectModal"
import type { Project, ProjectTask, TaskStatus, GitHubRepoOption } from "@/lib/types"

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((r) => {
        if (r.success) setProjects(r.data)
      })
    fetch("/api/projects?tasks=all")
      .then((r) => r.json())
      .then((r) => {
        if (r.success) setTasks(r.data)
      })
  }, [])

  useEffect(() => {
    if (!selectedProjectId) return
    fetch(`/api/projects?id=${selectedProjectId}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          setTasks((prev) => {
            const otherTasks = prev.filter((t) => t.project_id !== selectedProjectId)
            return [...otherTasks, ...r.data]
          })
        }
      })
  }, [selectedProjectId])

  async function handleAddProject(repo: GitHubRepoOption) {
    const name = repo.full_name.split("/")[1] ?? repo.full_name
    const formatted = name
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

    const optimistic: Project = {
      id: `temp-${Date.now()}`,
      name: formatted,
      repo: repo.full_name,
      description: repo.description,
      status: "active",
      created_at: "",
    }
    setProjects((prev) => [...prev, optimistic])

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formatted, repo: repo.full_name, description: repo.description }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setProjects((prev) => prev.map((p) => (p.id === optimistic.id ? data.data : p)))
      }
    } catch {
      // optimistic update remains
    }
  }

  async function handleAddTask(title: string, description: string, status: TaskStatus) {
    if (!selectedProjectId) return

    const optimistic: ProjectTask = {
      id: `temp-${Date.now()}`,
      project_id: selectedProjectId,
      title,
      description: description || undefined,
      status,
      created_at: "",
    }
    setTasks((prev) => [...prev, optimistic])

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: selectedProjectId, title, description: description || undefined, status }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? data.data : t)))
      }
    } catch {
      // optimistic update remains
    }
  }

  async function handleUpdateTask(
    taskId: string,
    updates: Partial<Pick<ProjectTask, "title" | "description" | "status">>
  ) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))

    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, ...updates }),
      })
    } catch {
      // optimistic update remains
    }
  }

  async function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete_task_id: taskId }),
      })
    } catch {
      // optimistic update remains
    }
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {selectedProject ? (
        <ProjectDetailView
          project={selectedProject}
          tasks={tasks}
          onBack={() => setSelectedProjectId(null)}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <ProjectListView
          projects={projects}
          tasks={tasks}
          onSelectProject={setSelectedProjectId}
          onOpenAddModal={() => setShowAddModal(true)}
        />
      )}

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProject}
        existingRepos={projects.map((p) => p.repo)}
      />
    </motion.div>
  )
}
