"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { GlowButton } from "@/components/ui/GlowButton"
import type { GitHubRepoOption } from "@/lib/types"

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (repo: GitHubRepoOption) => void
  existingRepos: string[]
}

export function AddProjectModal({ isOpen, onClose, onAdd, existingRepos }: AddProjectModalProps) {
  const [repos, setRepos] = useState<GitHubRepoOption[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch("/api/projects/github?action=repos")
      .then((r) => r.json())
      .then((r) => {
        if (r.success) setRepos(r.data)
      })
      .finally(() => setLoading(false))
  }, [isOpen])

  const filtered = repos.filter(
    (r) =>
      !existingRepos.includes(r.full_name) &&
      r.full_name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project">
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 placeholder:text-white/30 transition-all duration-200 focus:border-cosmic/50 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-cosmic/30"
        />

        <div className="max-h-64 overflow-y-auto space-y-1">
          {loading && (
            <p className="text-xs text-white/40 text-center py-4">Loading repositories...</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-xs text-white/40 text-center py-4">No repositories found</p>
          )}
          {filtered.map((repo) => (
            <button
              key={repo.full_name}
              onClick={() => {
                onAdd(repo)
                onClose()
                setSearch("")
              }}
              className="w-full text-left rounded-lg px-3 py-2.5 hover:bg-white/5 transition-colors group"
            >
              <p className="text-sm text-white/80 font-mono group-hover:text-white">
                {repo.full_name}
              </p>
              {repo.description && (
                <p className="text-xs text-white/30 mt-0.5 truncate">{repo.description}</p>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <GlowButton variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </GlowButton>
        </div>
      </div>
    </Modal>
  )
}
