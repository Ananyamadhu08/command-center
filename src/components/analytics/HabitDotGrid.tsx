"use client"

import type { HabitDailyGrid } from "@/lib/types"

interface HabitDotGridProps {
  habits: HabitDailyGrid[]
}

export function HabitDotGrid({ habits }: HabitDotGridProps) {
  if (habits.length === 0) return null

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const completed = habit.days.filter((d) => d.completed).length
        const rate = Math.round((completed / habit.days.length) * 100)

        return (
          <div key={habit.name} className="flex items-center gap-3">
            <span className="text-lg w-8 text-center shrink-0">{habit.icon}</span>
            <span className="text-xs text-white/50 w-28 truncate shrink-0">{habit.name}</span>
            <div className="flex gap-[6px] flex-1">
              {habit.days.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 aspect-square rounded-md transition-all"
                  style={{
                    backgroundColor: day.completed ? habit.color : "rgba(255,255,255,0.04)",
                    boxShadow: day.completed ? `0 0 10px ${habit.color}44` : "none",
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-white/30 w-11 text-right shrink-0">{rate}%</span>
          </div>
        )
      })}
    </div>
  )
}
