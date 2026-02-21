"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { Input, TextArea } from "@/components/ui/Input"
import { getToday } from "@/lib/utils"

const EXERCISE_TYPES = [
  { id: "morning_stretch", label: "Morning Stretch", icon: "🌅" },
  { id: "gym", label: "Gym", icon: "💪" },
  { id: "walk", label: "Walk", icon: "🚶" },
  { id: "yoga", label: "Yoga", icon: "🧘" },
] as const

interface ExerciseLogProps {
  onLog: (entry: { date: string; type: string; duration_minutes: number; notes: string }) => void
  todayLogs: { type: string; duration_minutes: number }[]
}

export function ExerciseLog({ onLog, todayLogs }: ExerciseLogProps) {
  const [exerciseType, setExerciseType] = useState<string>("morning_stretch")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")

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
