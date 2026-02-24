"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import type { GitHubRepoStats } from "@/lib/types"
import { Loader } from "@/components/ui/Loader"
import { ErrorState } from "@/components/ui/ErrorState"

interface GitHubStatsPanelProps {
  repo: string
}

export function GitHubStatsPanel({ repo }: GitHubStatsPanelProps) {
  const [stats, setStats] = useState<GitHubRepoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

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
        <Loader label="Loading stats..." size="sm" />
      </GlassCard>
    )
  }

  if (!stats) {
    return (
      <GlassCard hover={false}>
        <ErrorState message="Could not load stats" />
      </GlassCard>
    )
  }

  return (
    <GlassCard hover={false} className="space-y-4">
      {/* Header with expand toggle */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-semibold text-white/70">GitHub</h3>
        <ChevronDown
          size={16}
          className={`text-white/30 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Stat cards — always visible */}
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

      {/* Detailed lists — only when expanded */}
      {expanded && (
        <div className="space-y-4 pt-1">
          {stats.open_prs.length > 0 && (
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
        </div>
      )}
    </GlassCard>
  )
}
