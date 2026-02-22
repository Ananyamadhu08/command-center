"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/analytics/StatCard"
import type { GitHubOverview } from "@/lib/types"

export function GitHubOverviewStats() {
  const [data, setData] = useState<GitHubOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects/github?action=overview")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Commits Today" value={data.commits_today} glow="cosmic" />
      <StatCard label="PRs Today" value={data.prs_today} glow="electric" />
      <StatCard label="Active Repos" value={data.repos_contributed_today} subtitle="contributed today" glow="amber" />
      <StatCard label="Total Repos" value={data.total_repos} />
    </div>
  )
}
