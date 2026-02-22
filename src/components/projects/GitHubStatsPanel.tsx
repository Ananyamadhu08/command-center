"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import type { GitHubRepoStats } from "@/lib/types"

interface GitHubStatsPanelProps {
  repo: string
}

export function GitHubStatsPanel({ repo }: GitHubStatsPanelProps) {
  const [stats, setStats] = useState<GitHubRepoStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/projects/github?repo=${encodeURIComponent(repo)}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.success) setStats(r.data)
      })
      .finally(() => setLoading(false))
  }, [repo])

  if (loading) {
    return (
      <GlassCard hover={false}>
        <p className="text-xs text-white/40 text-center py-4">Loading GitHub stats...</p>
      </GlassCard>
    )
  }

  if (!stats) {
    return (
      <GlassCard hover={false}>
        <p className="text-xs text-white/40 text-center py-4">Could not load stats</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard hover={false} className="space-y-4">
      <h3 className="text-sm font-semibold text-white/70">GitHub</h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-white/5 p-3 text-center">
          <p className="text-lg font-bold text-electric-light">{stats.open_prs.length}</p>
          <p className="text-[10px] text-white/40 uppercase">Open PRs</p>
        </div>
        <div className="rounded-lg bg-white/5 p-3 text-center">
          <p className="text-lg font-bold text-cosmic-light">{stats.branches.length}</p>
          <p className="text-[10px] text-white/40 uppercase">Branches</p>
        </div>
        <div className="rounded-lg bg-white/5 p-3 text-center">
          <p className="text-lg font-bold text-amber-light">{stats.stars}</p>
          <p className="text-[10px] text-white/40 uppercase">Stars</p>
        </div>
      </div>

      {stats.open_prs.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
            Open Pull Requests
          </p>
          {stats.open_prs.map((pr) => (
            <div key={pr.number} className="flex items-center gap-2 rounded-lg px-2 py-1.5 bg-white/[0.02]">
              <span className="text-xs text-electric-light font-mono">#{pr.number}</span>
              <span className="text-xs text-white/60 truncate flex-1">{pr.title}</span>
            </div>
          ))}
        </div>
      )}

      {stats.branches.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
            Branches
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stats.branches.map((b) => (
              <span
                key={b.name}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50 font-mono"
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.recent_commits.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
            Recent Commits
          </p>
          {stats.recent_commits.map((c) => (
            <div key={c.sha} className="flex items-start gap-2 rounded-lg px-2 py-1.5 bg-white/[0.02]">
              <span className="text-[10px] text-cosmic-light font-mono shrink-0">{c.sha}</span>
              <span className="text-xs text-white/50 truncate">{c.message}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
