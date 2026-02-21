"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import type { Habit, HabitLog } from "@/lib/types"
import { getToday } from "@/lib/utils"

interface HabitTrackerProps {
  habits: Habit[]
  todayLogs: HabitLog[]
  onToggle: (habitId: string, completed: boolean) => void
}

export function HabitTracker({ habits, todayLogs, onToggle }: HabitTrackerProps) {
  const today = getToday()
  const completedIds = new Set(
    todayLogs.filter((l) => l.date === today && l.completed).map((l) => l.habit_id),
  )
  const completedCount = completedIds.size
  const progress = habits.length > 0 ? completedCount / habits.length : 0

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
            </button>
          )
        })}
      </div>
    </GlassCard>
  )
}
