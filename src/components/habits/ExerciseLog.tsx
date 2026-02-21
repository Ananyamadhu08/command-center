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
      <div className="flex items-center gap-3 mb-3">
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

      {/* 7-Day Bar Chart */}
      <div className="flex items-end gap-1 h-16 mb-3">
        {bars.map((day) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex flex-col-reverse rounded-sm overflow-hidden" style={{ height: "48px" }}>
              {day.segments.length > 0 ? (
                day.segments.map((seg) => (
                  <div
                    key={seg.type}
                    style={{
                      backgroundColor: seg.color,
                      height: `${(seg.minutes / maxMinutes) * 100}%`,
                      minHeight: seg.minutes > 0 ? "2px" : "0",
                    }}
                  />
                ))
              ) : (
                <div className="w-full h-full bg-white/[0.03] rounded-sm" />
              )}
            </div>
            <span className="text-[8px] text-white/20">{day.dayOfWeek.charAt(0)}</span>
          </div>
        ))}
      </div>

      {todayLogs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {todayLogs.map((log, i) => {
            const typeInfo = EXERCISE_TYPES.find((t) => t.id === log.type)
            return (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-electric/10 border border-electric/20 text-electric-light/70"
              >
                {typeInfo?.icon} {log.duration_minutes}m
              </span>
            )
          })}
        </div>
      )}

      <div className="space-y-3">
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
    </GlassCard>
  )
}
