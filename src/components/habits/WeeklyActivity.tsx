"use client"

import { useMemo } from "react"
import { Activity, BookOpen, Target } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { calculateStreak, getLast7Days, getLast30Days } from "@/lib/streaks"
import type { ExerciseLog, ReadingLog, Habit, HabitLog } from "@/lib/types"
import { resolveColor } from "@/lib/colors"

interface WeeklyActivityProps {
  exerciseLogs: ExerciseLog[]
  readingLogs: ReadingLog[]
  habitLogs: HabitLog[]
  habits: Habit[]
}

interface StreakCardProps {
  title: string
  icon: React.ReactNode
  streak: number
  secondaryLabel: string
  secondaryValue: string
  color: string
  colorLight: string
  glowClass: string
  days: { date: string; label: string }[]
  activeDates: Set<string>
}

function StreakCard({
  title,
  icon,
  streak,
  secondaryLabel,
  secondaryValue,
  color,
  colorLight,
  glowClass,
  days,
  activeDates,
}: StreakCardProps) {
  const activeCount = days.filter((d) => activeDates.has(d.date)).length

  return (
    <GlassCard glow={glowClass as "cosmic" | "electric" | "amber"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span style={{ color: colorLight }}>{icon}</span>
          <span className="text-base font-semibold text-white/80">{title}</span>
        </div>
        <span className="text-[11px] text-white/25">{activeCount}/30 days</span>
      </div>

      {/* Streak Hero */}
      <div className="flex items-baseline gap-2.5 mb-6">
        <span
          className="text-4xl font-bold tabular-nums leading-none"
          style={{ color: colorLight }}
        >
          {streak}
        </span>
        <span className="text-xs text-white/30">day streak</span>
      </div>

      {/* 30-Day Dot Strip */}
      <div className="flex flex-wrap gap-[5px] mb-5">
        {days.map((day) => {
          const active = activeDates.has(day.date)
          return (
            <div
              key={day.date}
              className="w-[11px] h-[11px] rounded-[3px] transition-all"
              style={{
                backgroundColor: active ? color : "rgba(255,255,255,0.04)",
                boxShadow: active ? `0 0 8px ${color}55` : "none",
              }}
              title={`${day.label}${active ? " — active" : ""}`}
            />
          )
        })}
      </div>

      {/* Secondary Stat */}
      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-white/30">{secondaryLabel}</span>
          <span
            className="text-base font-semibold tabular-nums"
            style={{ color: colorLight }}
          >
            {secondaryValue}
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

export function WeeklyActivity({ exerciseLogs, readingLogs, habitLogs, habits }: WeeklyActivityProps) {
  const days = useMemo(() => getLast30Days(), [])
  const last7 = useMemo(() => getLast7Days(), [])

  const exerciseDates = useMemo(
    () => new Set(exerciseLogs.map((l) => l.date)),
    [exerciseLogs],
  )
  const readingDates = useMemo(
    () => new Set(readingLogs.map((l) => l.date)),
    [readingLogs],
  )
  const habitActiveDates = useMemo(() => {
    const totalHabits = Math.max(habits.length, 1)
    const completionByDate = new Map<string, number>()
    for (const log of habitLogs) {
      if (log.completed) {
        completionByDate.set(log.date, (completionByDate.get(log.date) ?? 0) + 1)
      }
    }
    const dates = new Set<string>()
    for (const [date, count] of completionByDate) {
      if (count / totalHabits >= 0.75) dates.add(date)
    }
    return dates
  }, [habitLogs, habits.length])

  const exerciseStreak = useMemo(
    () => calculateStreak([...exerciseDates]),
    [exerciseDates],
  )
  const readingStreak = useMemo(
    () => calculateStreak([...readingDates]),
    [readingDates],
  )
  const habitStreak = useMemo(
    () => calculateStreak([...habitActiveDates]),
    [habitActiveDates],
  )

  // Secondary stats
  const weeklyMinutes = useMemo(() => {
    const weekDates = new Set(last7.map((d) => d.date))
    return exerciseLogs
      .filter((l) => weekDates.has(l.date))
      .reduce((sum, l) => sum + l.duration_minutes, 0)
  }, [exerciseLogs, last7])

  const weeklyPages = useMemo(() => {
    const weekDates = new Set(last7.map((d) => d.date))
    return readingLogs
      .filter((l) => weekDates.has(l.date))
      .reduce((sum, l) => sum + l.pages_read, 0)
  }, [readingLogs, last7])

  const habitAvg = useMemo(() => {
    if (habits.length === 0) return 0
    let totalCompleted = 0
    let totalPossible = 0
    const weekDates = new Set(last7.map((d) => d.date))
    for (const date of weekDates) {
      totalPossible += habits.length
      const completed = habitLogs.filter(
        (l) => l.date === date && l.completed,
      ).length
      totalCompleted += completed
    }
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
  }, [habitLogs, habits.length, last7])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StreakCard
        title="Exercise"
        icon={<Activity size={16} />}
        streak={exerciseStreak}
        secondaryLabel="This week"
        secondaryValue={`${weeklyMinutes} min`}
        color={resolveColor("blue").hex}
        colorLight={resolveColor("blue").hexLight}
        glowClass="cosmic"
        days={days}
        activeDates={exerciseDates}
      />
      <StreakCard
        title="Reading"
        icon={<BookOpen size={16} />}
        streak={readingStreak}
        secondaryLabel="This week"
        secondaryValue={`${weeklyPages} pg`}
        color={resolveColor("violet").hex}
        colorLight={resolveColor("violet").hexLight}
        glowClass="cosmic"
        days={days}
        activeDates={readingDates}
      />
      <StreakCard
        title="Habits"
        icon={<Target size={16} />}
        streak={habitStreak}
        secondaryLabel="Avg completion (7d)"
        secondaryValue={`${habitAvg}%`}
        color={resolveColor("amber").hex}
        colorLight={resolveColor("amber").hexLight}
        glowClass="cosmic"
        days={days}
        activeDates={habitActiveDates}
      />
    </div>
  )
}
