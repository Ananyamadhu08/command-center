"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import type { WeekComparison } from "@/lib/types"
import { resolveColor } from "@/lib/colors"

interface WeekComparisonCardProps {
  comparison: WeekComparison
}

interface RowData {
  label: string
  icon: string
  thisWeek: number
  lastWeek: number
  unit: string
  color: string
}

function DeltaBadge({ thisWeek, lastWeek }: { thisWeek: number; lastWeek: number }) {
  if (lastWeek === 0) {
    return (
      <span className="text-[10px] px-2 py-1 rounded-md bg-white/10 text-white/40">New</span>
    )
  }
  const diff = thisWeek - lastWeek
  const pct = Math.round((diff / lastWeek) * 100)
  const isUp = diff > 0
  const isNeutral = diff === 0

  if (isNeutral) {
    return (
      <span className="text-[10px] px-2 py-1 rounded-md bg-white/10 text-white/40">—</span>
    )
  }

  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-md font-mono ${
        isUp
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      {isUp ? "+" : ""}{pct}%
    </span>
  )
}

export function WeekComparisonCard({ comparison }: WeekComparisonCardProps) {
  const rows: RowData[] = [
    { label: "Exercise", icon: "🏃", thisWeek: comparison.exercise_minutes.this_week, lastWeek: comparison.exercise_minutes.last_week, unit: "min", color: resolveColor("blue").hex },
    { label: "Habits", icon: "🎯", thisWeek: comparison.habit_completion.this_week, lastWeek: comparison.habit_completion.last_week, unit: "%", color: resolveColor("violet").hex },
    { label: "Reading", icon: "📖", thisWeek: comparison.reading_pages.this_week, lastWeek: comparison.reading_pages.last_week, unit: "pg", color: resolveColor("amber").hex },
    { label: "Meals", icon: "🍽️", thisWeek: comparison.meals_tracked.this_week, lastWeek: comparison.meals_tracked.last_week, unit: "d", color: resolveColor("emerald").hex },
  ]

  return (
    <GlassCard>
      <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-5">
        This Week vs Last
      </h3>

      {/* Column headers */}
      <div className="flex items-center mb-3 px-1">
        <div className="flex-1" />
        <span className="text-[9px] font-mono text-white/15 uppercase w-16 text-right">Last</span>
        <span className="text-[9px] font-mono text-white/25 uppercase w-16 text-right">This</span>
        <div className="w-16 flex justify-end">
          <span className="text-[9px] font-mono text-white/15 uppercase">Change</span>
        </div>
      </div>

      <div className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center py-2.5 px-1 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2.5 flex-1">
              <span className="text-sm">{row.icon}</span>
              <span className="text-xs text-white/60">{row.label}</span>
            </div>
            <span className="text-[11px] font-mono text-white/20 w-16 text-right">
              {row.lastWeek}{row.unit}
            </span>
            <span className="text-[11px] font-mono text-white/70 w-16 text-right">
              {row.thisWeek}{row.unit}
            </span>
            <div className="w-16 flex justify-end">
              <DeltaBadge thisWeek={row.thisWeek} lastWeek={row.lastWeek} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
