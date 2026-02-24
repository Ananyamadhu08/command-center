"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/analytics/StatCard"
import { VerticalBarChart } from "@/components/analytics/VerticalBarChart"
import { WeeklyScoreCard } from "@/components/analytics/WeeklyScoreCard"
import { HabitDotGrid } from "@/components/analytics/HabitDotGrid"
import { WeekComparisonCard } from "@/components/analytics/WeekComparisonCard"
import { GoalsProgress } from "@/components/analytics/GoalsProgress"
import { fetchApi } from "@/lib/api"
import { staggerContainer, staggerItem } from "@/lib/animations"
import type { AnalyticsData, WeekComparison, WeeklyGoals } from "@/lib/types"
import { resolveColor } from "@/lib/colors"
import { Loader } from "@/components/ui/Loader"

const DEFAULT_COMPARISON: WeekComparison = {
  exercise_minutes: { this_week: 0, last_week: 0 },
  habit_completion: { this_week: 0, last_week: 0 },
  reading_pages: { this_week: 0, last_week: 0 },
  meals_tracked: { this_week: 0, last_week: 0 },
}

const DEFAULT_GOALS: WeeklyGoals = {
  exercise_minutes: { current: 0, target: 150 },
  reading_pages: { current: 0, target: 100 },
  habit_completion: { current: 0, target: 80 },
  meals_tracked: { current: 0, target: 7 },
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

function formatDelta(thisWeek: number, lastWeek: number, unit: string): string {
  if (lastWeek === 0) return `+${thisWeek}${unit}`
  const diff = thisWeek - lastWeek
  const sign = diff >= 0 ? "+" : ""
  return `${sign}${diff}${unit}`
}

function getDateRange(): string {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  return `${fmt(start)} \u2014 ${fmt(end)}`
}

function getTrend(thisWeek: number, lastWeek: number): "up" | "down" | "neutral" {
  if (thisWeek > lastWeek) return "up"
  if (thisWeek < lastWeek) return "down"
  return "neutral"
}

export function AnalyticsView() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchApi<AnalyticsData>("/api/analytics").then((result) => {
      if (result) setData(result)
    })
  }, [])

  if (!data) {
    return <Loader label="Computing analytics..." />
  }

  const exerciseChartData = data.exercise.daily_breakdown.map((d) => ({
    label: formatShortDate(d.date),
    value: d.minutes,
    date: d.date,
  }))

  const readingChartData = data.reading.daily_breakdown.map((d) => ({
    label: formatShortDate(d.date),
    value: d.pages,
    date: d.date,
  }))

  const score = data.weekly_score ?? 0
  const comp = data.week_comparison ?? DEFAULT_COMPARISON
  const goals = data.weekly_goals ?? DEFAULT_GOALS
  const habitGrid = data.habit_grid ?? []

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={staggerItem}>
        <WeeklyScoreCard score={score} dateRange={getDateRange()} />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Exercise"
          value={`${data.exercise.total_minutes_7d}m`}
          subtitle={`${data.exercise.active_days_7d}/7 active days`}
          trend={getTrend(comp.exercise_minutes.this_week, comp.exercise_minutes.last_week)}
          glow="electric"
          delta={formatDelta(comp.exercise_minutes.this_week, comp.exercise_minutes.last_week, "m")}
        />
        <StatCard
          label="Habits"
          value={`${data.habits.completion_rate_7d}%`}
          subtitle={`Best: ${data.habits.best_streak}`}
          trend={getTrend(comp.habit_completion.this_week, comp.habit_completion.last_week)}
          glow="cosmic"
          delta={formatDelta(comp.habit_completion.this_week, comp.habit_completion.last_week, "%")}
        />
        <StatCard
          label="Reading"
          value={`${data.reading.pages_7d}pg`}
          subtitle={data.reading.current_book}
          trend={getTrend(comp.reading_pages.this_week, comp.reading_pages.last_week)}
          glow="amber"
          delta={formatDelta(comp.reading_pages.this_week, comp.reading_pages.last_week, "pg")}
        />
        <StatCard
          label="Meals"
          value={`${data.meals.tracked_days_7d}/7`}
          subtitle={`${data.meals.total_logged} entries`}
          trend={getTrend(comp.meals_tracked.this_week, comp.meals_tracked.last_week)}
          delta={formatDelta(comp.meals_tracked.this_week, comp.meals_tracked.last_week, "d")}
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard glow="electric">
          <h3 className="text-xs font-mono text-electric-light/60 uppercase tracking-wider mb-4">
            Exercise — 14 Day Trend
          </h3>
          <VerticalBarChart data={exerciseChartData} color={resolveColor("blue").hex} colorLight={resolveColor("blue").hexLight} unit="m" />
        </GlassCard>

        <GlassCard glow="amber">
          <h3 className="text-xs font-mono text-amber-light/60 uppercase tracking-wider mb-4">
            Reading — 14 Day Trend
          </h3>
          <VerticalBarChart data={readingChartData} color={resolveColor("amber").hex} colorLight={resolveColor("amber").hexLight} unit="p" />
        </GlassCard>
      </motion.div>

      {habitGrid.length > 0 && (
        <motion.div variants={staggerItem}>
          <GlassCard glow="cosmic">
            <h3 className="text-xs font-mono text-cosmic-light/60 uppercase tracking-wider mb-4">
              Habit Completion — 14 Days
            </h3>
            <HabitDotGrid habits={habitGrid} />
          </GlassCard>
        </motion.div>
      )}

      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeekComparisonCard comparison={comp} />
        <GoalsProgress goals={goals} />
      </motion.div>
    </motion.div>
  )
}
