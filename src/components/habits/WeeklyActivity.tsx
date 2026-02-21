"use client"

import { useMemo } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { calculateStreak } from "@/lib/streaks"
import type { ExerciseLog, ReadingLog, Habit, HabitLog } from "@/lib/types"

interface WeeklyActivityProps {
  exerciseLogs: ExerciseLog[]
  readingLogs: ReadingLog[]
  habitLogs: HabitLog[]
  habits: Habit[]
}

export function WeeklyActivity({ exerciseLogs, readingLogs, habitLogs, habits }: WeeklyActivityProps) {
  const days = useMemo(() => {
    const today = new Date()
    const result: { date: string; label: string }[] = []
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      result.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      })
    }
    return result
  }, [])

  const exerciseDates = useMemo(
    () => new Set(exerciseLogs.map((l) => l.date)),
    [exerciseLogs],
  )
  const readingDates = useMemo(
    () => new Set(readingLogs.map((l) => l.date)),
    [readingLogs],
  )

  const habitCompletionByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const log of habitLogs) {
      if (log.completed) {
        map.set(log.date, (map.get(log.date) ?? 0) + 1)
      }
    }
    return map
  }, [habitLogs])

  const heatmapData = useMemo(() => {
    const totalHabits = Math.max(habits.length, 1)
    return days.map((day) => {
      let score = 0
      if (exerciseDates.has(day.date)) score++
      if (readingDates.has(day.date)) score++
      const completed = habitCompletionByDate.get(day.date) ?? 0
      if (completed / totalHabits > 0.5) score++
      return { ...day, score }
    })
  }, [days, exerciseDates, readingDates, habitCompletionByDate, habits.length])

  const exerciseStreak = useMemo(
    () => calculateStreak([...exerciseDates]),
    [exerciseDates],
  )
  const readingStreak = useMemo(
    () => calculateStreak([...readingDates]),
    [readingDates],
  )

  const habitAvg = useMemo(() => {
    if (habits.length === 0) return 0
    const last7 = days.slice(-7)
    let totalCompleted = 0
    let totalPossible = 0
    for (const day of last7) {
      totalPossible += habits.length
      totalCompleted += habitCompletionByDate.get(day.date) ?? 0
    }
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
  }, [days, habits.length, habitCompletionByDate])

  const opacityLevels = ["bg-white/[0.03]", "bg-purple-500/20", "bg-purple-500/40", "bg-purple-500/70"]

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90">Activity Overview</h3>
      </div>

      <div className="grid grid-cols-7 gap-[5px] mb-4">
        {heatmapData.map((day) => (
          <div
            key={day.date}
            className={`aspect-square rounded-md ${opacityLevels[day.score]} transition-colors`}
            title={`${day.label} — ${day.score === 0 ? "No activity" : `${day.score}/3 activities`}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-semibold text-electric-light">{exerciseStreak}</p>
          <p className="text-[10px] text-white/30">Exercise streak</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-cosmic-light">{readingStreak}</p>
          <p className="text-[10px] text-white/30">Reading streak</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-amber-light">{habitAvg}%</p>
          <p className="text-[10px] text-white/30">Habit avg (7d)</p>
        </div>
      </div>
    </GlassCard>
  )
}
