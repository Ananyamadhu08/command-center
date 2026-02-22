"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { StatCard } from "@/components/analytics/StatCard"
import { BarChart } from "@/components/analytics/BarChart"
import type { AnalyticsData } from "@/lib/types"

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export function AnalyticsView() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((r) => { if (r.success) setData(r.data) })
      .catch(() => {})
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-white/20 font-mono animate-pulse">Computing analytics...</p>
      </div>
    )
  }

  const exerciseChartData = data.exercise.daily_breakdown.map((d) => ({
    label: formatShortDate(d.date),
    value: d.minutes,
  }))

  const readingChartData = data.reading.daily_breakdown.map((d) => ({
    label: formatShortDate(d.date),
    value: d.pages,
  }))

  const typeEntries = Object.entries(data.exercise.type_breakdown).sort(([, a], [, b]) => b - a)

  const exerciseTrend: "up" | "down" | "neutral" =
    data.exercise.total_minutes_7d > data.exercise.total_minutes_14d / 2 ? "up" : "down"

  const readingTrend: "up" | "down" | "neutral" =
    data.reading.pages_7d > data.reading.pages_14d / 2 ? "up" : "down"

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white/80 mb-2">Analytics</h2>
        <p className="text-xs text-white/30 font-mono">Last 7 days overview</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Exercise"
          value={`${data.exercise.total_minutes_7d}`}
          subtitle={`${data.exercise.active_days_7d}/7 active days`}
          trend={exerciseTrend}
          glow="cosmic"
        />
        <StatCard
          label="Habits"
          value={`${data.habits.completion_rate_7d}%`}
          subtitle={`Best: ${data.habits.best_streak}`}
          glow="cosmic"
        />
        <StatCard
          label="Reading"
          value={`${data.reading.pages_7d}`}
          subtitle={`pages · ${data.reading.current_book}`}
          trend={readingTrend}
          glow="cosmic"
        />
        <StatCard
          label="Meals"
          value={`${data.meals.tracked_days_7d}/7`}
          subtitle={`${data.meals.total_logged} entries`}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard glow="cosmic">
          <h3 className="text-xs font-mono text-electric-light/60 uppercase tracking-wider mb-4">
            Exercise — 14 Day Trend
          </h3>
          <BarChart data={exerciseChartData} color="bg-electric/60" unit="m" />
          {typeEntries.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider mb-2">
                This Week by Type
              </p>
              <div className="flex flex-wrap gap-2">
                {typeEntries.map(([type, mins]) => (
                  <span key={type} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-white/50">
                    {type.replace(/_/g, " ")} · {mins}m
                  </span>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard glow="cosmic">
          <h3 className="text-xs font-mono text-amber-light/60 uppercase tracking-wider mb-4">
            Reading — 14 Day Trend
          </h3>
          <BarChart data={readingChartData} color="bg-amber/60" unit="p" />
        </GlassCard>
      </motion.div>

      {data.habits.per_habit.length > 0 && (
        <motion.div variants={item}>
          <GlassCard glow="cosmic">
            <h3 className="text-xs font-mono text-cosmic-light/60 uppercase tracking-wider mb-4">
              Habit Completion (7 days)
            </h3>
            <div className="space-y-2.5">
              {data.habits.per_habit.map((h) => (
                <div key={h.name} className="flex items-center gap-3">
                  <span className="text-sm w-6 text-center">{h.icon}</span>
                  <span className="text-xs text-white/60 flex-1">{h.name}</span>
                  <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cosmic/60 rounded-full transition-all duration-500"
                      style={{ width: `${h.rate}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 w-8 text-right">{h.rate}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      <motion.div variants={item}>
        <GlassCard>
          <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-4">Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-wider mb-2">
                On Track
              </p>
              {data.overall.on_track.length > 0 ? (
                <ul className="space-y-1.5">
                  {data.overall.on_track.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <CheckCircle size={12} className="text-emerald-400/60 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-white/20">No items on track</p>
              )}
            </div>
            <div>
              <p className="text-[10px] font-mono text-red-400/60 uppercase tracking-wider mb-2">
                Needs Attention
              </p>
              {data.overall.off_track.length > 0 ? (
                <ul className="space-y-1.5">
                  {data.overall.off_track.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                      <AlertTriangle size={12} className="text-red-400/60 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-400/40">Everything on track!</p>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
