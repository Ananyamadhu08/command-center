"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Check } from "lucide-react"
import type { WeeklyGoals } from "@/lib/types"
import { resolveColor } from "@/lib/colors"

interface GoalsProgressProps {
  goals: WeeklyGoals
}

interface GoalRow {
  label: string
  icon: string
  current: number
  target: number
  unit: string
  color: string
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
  const rows: GoalRow[] = [
    { label: "Exercise", icon: "🏃", current: goals.exercise_minutes.current, target: goals.exercise_minutes.target, unit: "min", color: resolveColor("blue").hex },
    { label: "Reading", icon: "📖", current: goals.reading_pages.current, target: goals.reading_pages.target, unit: "pg", color: resolveColor("amber").hex },
    { label: "Habits", icon: "🎯", current: goals.habit_completion.current, target: goals.habit_completion.target, unit: "%", color: resolveColor("violet").hex },
    { label: "Meals", icon: "🍽️", current: goals.meals_tracked.current, target: goals.meals_tracked.target, unit: "d", color: resolveColor("emerald").hex },
  ]

  return (
    <GlassCard>
      <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-5">
        Weekly Goals
      </h3>
      <div className="space-y-5">
        {rows.map((row) => {
          const pct = Math.min((row.current / row.target) * 100, 100)
          const met = row.current >= row.target

          return (
            <div key={row.label} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{row.icon}</span>
                  <span className="text-xs text-white/60">{row.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-white/40">
                    {row.current} / {row.target}{row.unit}
                  </span>
                  {met && <Check size={14} style={{ color: row.color }} />}
                </div>
              </div>
              <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: row.color,
                    boxShadow: `0 0 8px ${row.color}33`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
