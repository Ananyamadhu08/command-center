"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ProjectListView } from "@/components/projects/ProjectListView"
import { ProjectDetailView } from "@/components/projects/ProjectDetailView"
import { AddProjectModal } from "@/components/projects/AddProjectModal"
import { fetchApi, postApi } from "@/lib/api"
import type { Project, ProjectTask, TaskStatus, GitHubRepoOption } from "@/lib/types"

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchApi<Project[]>("/api/projects").then((data) => {
      if (data) setProjects(data)
    })
    fetchApi<ProjectTask[]>("/api/projects?tasks=all").then((data) => {
      if (data) setTasks(data)
    })
  }, [])

  useEffect(() => {
    if (!selectedProjectId) return
    fetchApi<ProjectTask[]>(`/api/projects?id=${selectedProjectId}`).then((data) => {
      if (data) {
        setTasks((prev) => {
          const otherTasks = prev.filter((t) => t.project_id !== selectedProjectId)
          return [...otherTasks, ...data]
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
    const previousProjects = projects
    setProjects((prev) => [...prev, optimistic])

    try {
      const data = await postApi<Project>("/api/projects", {
        name: formatted,
        repo: repo.full_name,
        description: repo.description,
      })
      if (data) {
        setProjects((prev) => prev.map((p) => (p.id === optimistic.id ? data : p)))
      }
    } catch {
      setProjects(previousProjects)
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
    const previousTasks = tasks
    setTasks((prev) => [...prev, optimistic])

    try {
      const data = await postApi<ProjectTask>("/api/projects", {
        project_id: selectedProjectId,
        title,
        description: description || undefined,
        status,
      })
      if (data) {
        setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? data : t)))
      }
    } catch {
      setTasks(previousTasks)
    }
  }

  async function handleUpdateTask(
    taskId: string,
    updates: Partial<Pick<ProjectTask, "title" | "description" | "status">>
  ) {
    const previousTasks = tasks
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, ...updates }),
      })
      if (!res.ok) throw new Error("Failed to update")
    } catch {
      setTasks(previousTasks)
    }
  }

  async function handleDeleteTask(taskId: string) {
    const previousTasks = tasks
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete_task_id: taskId }),
      })
      if (!res.ok) throw new Error("Failed to delete")
    } catch {
      setTasks(previousTasks)
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
