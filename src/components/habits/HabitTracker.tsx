"use client"

import { useMemo } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { calculateStreak, getLast7Days } from "@/lib/streaks"
import type { Habit, HabitLog } from "@/lib/types"
import { getToday } from "@/lib/utils"

interface HabitTrackerProps {
  habits: Habit[]
  todayLogs: HabitLog[]
  onToggle: (habitId: string, completed: boolean) => void
  allLogs?: HabitLog[]
}

export function HabitTracker({ habits, todayLogs, onToggle, allLogs = [] }: HabitTrackerProps) {
  const today = getToday()
  const completedIds = new Set(
    todayLogs.filter((l) => l.date === today && l.completed).map((l) => l.habit_id),
  )
  const completedCount = completedIds.size
  const progress = habits.length > 0 ? completedCount / habits.length : 0

  const last7 = useMemo(() => getLast7Days(), [])

  const streakByHabit = useMemo(() => {
    const map = new Map<string, number>()
    for (const habit of habits) {
      const dates = allLogs
        .filter((l) => l.habit_id === habit.id && l.completed)
        .map((l) => l.date)
      map.set(habit.id, calculateStreak(dates))
    }
    return map
  }, [habits, allLogs])

  const completionGrid = useMemo(() => {
    const grid = new Map<string, Set<string>>()
    for (const log of allLogs) {
      if (!log.completed) continue
      if (!grid.has(log.habit_id)) grid.set(log.habit_id, new Set())
      grid.get(log.habit_id)!.add(log.date)
    }
    return grid
  }, [allLogs])

  return (
    <GlassCard glow="cosmic">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <span className="text-cosmic-light">◈</span>
          Daily Habits
        </h3>
        <span className="text-[10px] font-mono text-white/30">
          {completedCount}/{habits.length}
        </span>
      </div>

      <div className="h-1 bg-white/5 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cosmic to-cosmic-light rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="space-y-1">
        {habits.map((habit) => {
          const done = completedIds.has(habit.id)
          const streak = streakByHabit.get(habit.id) ?? 0
          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id, !done)}
              className="flex items-center gap-2.5 w-full text-left py-1.5 group"
            >
              <div
                className={`w-5 h-5 rounded-lg border flex-shrink-0 flex items-center justify-center transition-all ${
                  done
                    ? "border-cosmic/50 bg-cosmic/20"
                    : "border-white/15 group-hover:border-white/30"
                }`}
                style={done ? { borderColor: `${habit.color}66`, backgroundColor: `${habit.color}22` } : {}}
              >
                {done && <span className="text-[9px]" style={{ color: habit.color }}>✓</span>}
              </div>
              <span className="text-sm mr-1">{habit.icon}</span>
              <span
                className={`text-xs transition-all flex-1 ${
                  done ? "text-white/30 line-through" : "text-white/70"
                }`}
              >
                {habit.name}
              </span>
              {streak > 0 && (
                <span className="text-[10px] font-mono text-white/20">{streak}d</span>
              )}
            </button>
          )
        })}
      </div>

      {/* 7-Day Mini Grid */}
      {habits.length > 0 && allLogs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">This week</p>
          <div className="grid gap-y-2.5 gap-x-1" style={{ gridTemplateColumns: `24px repeat(7, 1fr)` }}>
            {/* Header row */}
            <div />
            {last7.map((d) => (
              <div key={d.date} className="text-[9px] text-white/25 text-center pb-1">
                {d.dayOfWeek.charAt(0)}
              </div>
            ))}

            {/* Habit rows */}
            {habits.map((habit) => {
              const habitDates = completionGrid.get(habit.id)
              return (
                <div key={habit.id} className="contents">
                  <div className="text-xs leading-none flex items-center justify-center">{habit.icon}</div>
                  {last7.map((d) => {
                    const completed = habitDates?.has(d.date) ?? false
                    return (
                      <div key={d.date} className="flex items-center justify-center py-0.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full transition-colors"
                          style={{
                            backgroundColor: completed ? habit.color : "rgba(255,255,255,0.04)",
                            boxShadow: completed ? `0 0 6px ${habit.color}44` : "none",
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </GlassCard>
  )
}
