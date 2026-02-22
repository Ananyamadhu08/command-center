"use client"

import { GlassCard } from "@/components/ui/GlassCard"

interface StreakCalendarProps {
  title: string
  dates: string[]
  color?: string
}

export function StreakCalendar({ title, dates, color = "#8b5cf6" }: StreakCalendarProps) {
  const today = new Date()
  const days: { date: string; active: boolean; label: string }[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    days.push({
      date: dateStr,
      active: dates.includes(dateStr),
      label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    })
  }

  const currentStreak = calculateStreak(dates)

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-white/90">{title}</h3>
        {currentStreak > 0 && (
          <span className="text-[10px] font-mono" style={{ color: `${color}aa` }}>
            {currentStreak} day streak
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-[3px]">
        {days.map((day) => (
          <div
            key={day.date}
            className="w-3 h-3 rounded-full transition-all"
            style={{
              backgroundColor: day.active ? color : "rgba(255,255,255,0.06)",
              boxShadow: day.active ? `0 0 6px ${color}44` : "none",
            }}
            title={`${day.label}${day.active ? " - completed" : ""}`}
          />
        ))}
      </div>
    </GlassCard>
  )
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...dates].sort().reverse()
  const today = new Date().toISOString().split("T")[0]

  let streak = 0
  let checkDate = new Date(today)

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split("T")[0]
    if (sorted.includes(dateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
