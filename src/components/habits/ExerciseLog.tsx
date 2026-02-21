"use client"

import { useState, useMemo } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { Input, TextArea } from "@/components/ui/Input"
import { getToday } from "@/lib/utils"
import { calculateStreak, getLast7Days } from "@/lib/streaks"
import type { ExerciseLog as ExerciseLogType } from "@/lib/types"

const EXERCISE_TYPES = [
  { id: "morning_stretch", label: "Morning Stretch", icon: "🌅", color: "#93c5fd" },
  { id: "gym", label: "Gym", icon: "💪", color: "#3b82f6" },
  { id: "walk", label: "Walk", icon: "🚶", color: "#10b981" },
  { id: "yoga", label: "Yoga", icon: "🧘", color: "#f59e0b" },
] as const

interface ExerciseLogProps {
  onLog: (entry: { date: string; type: string; duration_minutes: number; notes: string }) => void
  todayLogs: { type: string; duration_minutes: number }[]
  allLogs?: ExerciseLogType[]
}

export function ExerciseLog({ onLog, todayLogs, allLogs = [] }: ExerciseLogProps) {
  const [exerciseType, setExerciseType] = useState<string>("morning_stretch")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>(getToday())

  const streak = useMemo(() => {
    const dates = [...new Set(allLogs.map((l) => l.date))]
    return calculateStreak(dates)
  }, [allLogs])

  const last7 = useMemo(() => getLast7Days(), [])

  const weeklyMinutes = useMemo(() => {
    const weekDates = new Set(last7.map((d) => d.date))
    return allLogs
      .filter((l) => weekDates.has(l.date))
      .reduce((sum, l) => sum + l.duration_minutes, 0)
  }, [allLogs, last7])

  const { bars, maxMinutes } = useMemo(() => {
    const byDate = new Map<string, Map<string, number>>()
    for (const log of allLogs) {
      if (!byDate.has(log.date)) byDate.set(log.date, new Map())
      const typeMap = byDate.get(log.date)!
      typeMap.set(log.type, (typeMap.get(log.type) ?? 0) + log.duration_minutes)
    }

    const items = last7.map((d) => {
      const typeMap = byDate.get(d.date)
      const segments = EXERCISE_TYPES.map((t) => ({
        type: t.id,
        color: t.color,
        minutes: typeMap?.get(t.id) ?? 0,
      })).filter((s) => s.minutes > 0)
      const total = segments.reduce((s, seg) => s + seg.minutes, 0)
      return { ...d, segments, total }
    })

    const max = Math.max(...items.map((b) => b.total), 1)
    return { bars: items, maxMinutes: max }
  }, [allLogs, last7])

  const selectedDayLogs = useMemo(
    () => allLogs.filter((l) => l.date === selectedDate),
    [allLogs, selectedDate],
  )

  const selectedDayLabel = useMemo(() => {
    const today = getToday()
    if (selectedDate === today) return "Today"
    const d = new Date(selectedDate + "T00:00:00")
    return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
  }, [selectedDate])

  function handleSubmit() {
    const mins = parseInt(duration, 10)
    if (!mins || mins <= 0) return
    onLog({
      date: getToday(),
      type: exerciseType,
      duration_minutes: mins,
      notes: notes.trim(),
    })
    setDuration("")
    setNotes("")
  }

  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.duration_minutes, 0)
  const isToday = selectedDate === getToday()

  return (
    <GlassCard glow="cosmic">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <span className="text-electric-light">△</span>
          Exercise Log
        </h3>
        {totalMinutes > 0 && (
          <span className="text-[10px] font-mono text-electric-light/60">
            {totalMinutes} min today
          </span>
        )}
      </div>

      {/* Streak + Weekly Stats */}
      <div className="flex items-center gap-3 mb-4">
        {streak > 0 && (
          <span className="text-sm font-semibold text-electric-light">
            {streak}-day streak
          </span>
        )}
        {weeklyMinutes > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-electric/10 border border-electric/20 text-electric-light/70">
            {weeklyMinutes} min this week
          </span>
        )}
      </div>

      {/* 7-Day Interactive Bar Chart */}
      <div className="flex items-end gap-3 mb-2" style={{ height: "180px" }}>
        {bars.map((day) => {
          const isSelected = day.date === selectedDate
          return (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className="flex-1 flex flex-col items-center gap-2 h-full group"
            >
              {/* Minute label */}
              {day.total > 0 && (
                <span className={`text-[10px] font-mono tabular-nums transition-colors ${isSelected ? "text-electric-light/70" : "text-white/25"}`}>
                  {day.total}m
                </span>
              )}
              {/* Bar */}
              <div
                className={`w-full flex-1 flex flex-col-reverse rounded-lg overflow-hidden transition-all ${
                  isSelected
                    ? "ring-2 ring-electric/40 ring-offset-1 ring-offset-transparent"
                    : "group-hover:opacity-80"
                }`}
              >
                {day.segments.length > 0 ? (
                  day.segments.map((seg) => (
                    <div
                      key={seg.type}
                      className="w-full transition-all"
                      style={{
                        backgroundColor: seg.color,
                        height: `${(seg.minutes / maxMinutes) * 100}%`,
                        minHeight: seg.minutes > 0 ? "4px" : "0",
                        boxShadow: isSelected ? `0 0 14px ${seg.color}55` : `0 0 8px ${seg.color}22`,
                      }}
                    />
                  ))
                ) : (
                  <div className="w-full h-full bg-white/[0.03] rounded-lg" />
                )}
              </div>
              {/* Day label */}
              <span className={`text-[11px] transition-colors ${isSelected ? "text-electric-light/80 font-medium" : "text-white/25"}`}>
                {day.dayOfWeek}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected Day Sessions */}
      <div className="mb-4 pt-3 border-t border-white/[0.05]">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2.5">{selectedDayLabel}</p>
        {selectedDayLogs.length > 0 ? (
          <div className="space-y-2">
            {selectedDayLogs.map((log) => {
              const typeInfo = EXERCISE_TYPES.find((t) => t.id === log.type)
              return (
                <div key={log.id} className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-white/[0.02]">
                  <span className="text-sm">{typeInfo?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70">{typeInfo?.label}</p>
                    {log.notes && (
                      <p className="text-[10px] text-white/25 truncate">{log.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: typeInfo?.color }} />
                    <span className="text-xs font-mono text-white/50 tabular-nums">{log.duration_minutes}m</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-[11px] text-white/15 py-2">No exercises logged</p>
        )}
      </div>

      {/* Log Form — only show when today is selected */}
      {isToday && (
        <div className="space-y-3 pt-3 border-t border-white/[0.05]">
          <div className="flex flex-wrap gap-1.5">
            {EXERCISE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setExerciseType(type.id)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                  exerciseType === type.id
                    ? "border-electric/40 bg-electric/15 text-electric-light"
                    : "border-white/10 text-white/40 hover:border-white/20"
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
          <Input
            value={duration}
            onChange={setDuration}
            placeholder="Duration in minutes"
            type="number"
          />
          <TextArea
            value={notes}
            onChange={setNotes}
            placeholder="Notes (optional)"
            rows={2}
          />
          <GlowButton
            variant="electric"
            size="sm"
            onClick={handleSubmit}
            disabled={!duration || parseInt(duration, 10) <= 0}
          >
            Log Exercise
          </GlowButton>
        </div>
      )}

      {/* Show hint to return to today when viewing another day */}
      {!isToday && (
        <button
          onClick={() => setSelectedDate(getToday())}
          className="w-full text-center text-[11px] text-electric-light/40 hover:text-electric-light/70 transition-colors pt-2"
        >
          Back to today to log exercise
        </button>
      )}
    </GlassCard>
  )
}
