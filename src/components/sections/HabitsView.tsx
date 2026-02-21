"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { HabitTracker } from "@/components/habits/HabitTracker"
import { ExerciseLog } from "@/components/habits/ExerciseLog"
import { ReadingTracker } from "@/components/habits/ReadingTracker"
import { WeeklyActivity } from "@/components/habits/WeeklyActivity"
import { getToday } from "@/lib/utils"
import type {
  Habit,
  HabitLog,
  ExerciseLog as ExerciseLogType,
  ReadingLog as ReadingLogType,
} from "@/lib/types"

export function HabitsView() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogType[]>([])
  const [readingLogs, setReadingLogs] = useState<ReadingLogType[]>([])

  const todayRef = useRef(getToday())
  const today = todayRef.current

  useEffect(() => {
    fetch("/api/habits")
      .then((r) => r.json())
      .then((r) => { if (r.success) setHabits(r.data) })
      .catch(() => {})

    fetch("/api/habits?logs=true")
      .then((r) => r.json())
      .then((r) => { if (r.success) setHabitLogs(r.data) })
      .catch(() => {})

    fetch("/api/exercise")
      .then((r) => r.json())
      .then((r) => { if (r.success) setExerciseLogs(r.data) })
      .catch(() => {})

    fetch("/api/reading")
      .then((r) => r.json())
      .then((r) => { if (r.success) setReadingLogs(r.data) })
      .catch(() => {})
  }, [today])

  async function handleHabitToggle(habitId: string, completed: boolean) {
    setHabitLogs((prev) => {
      const existing = prev.find((l) => l.habit_id === habitId && l.date === today)
      if (existing) {
        return prev.map((l) =>
          l.habit_id === habitId && l.date === today ? { ...l, completed } : l,
        )
      }
      return [
        ...prev,
        { id: `temp-${Date.now()}`, habit_id: habitId, date: today, completed, created_at: "" },
      ]
    })
    try {
      await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit_id: habitId, date: today, completed }),
      })
    } catch {
      // Optimistic update remains
    }
  }

  async function handleExerciseLog(entry: {
    date: string
    type: string
    duration_minutes: number
    notes: string
  }) {
    const newLog: ExerciseLogType = {
      id: `temp-${Date.now()}`,
      ...entry,
      type: entry.type as ExerciseLogType["type"],
      created_at: "",
    }
    setExerciseLogs((prev) => [newLog, ...prev])
    try {
      await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
    } catch {
      // Optimistic update remains
    }
  }

  async function handleReadingLog(entry: {
    book_title: string
    pages_read: number
    date: string
    notes: string
  }) {
    const newLog: ReadingLogType = {
      id: `temp-${Date.now()}`,
      ...entry,
      created_at: "",
    }
    setReadingLogs((prev) => [newLog, ...prev])
    try {
      await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
    } catch {
      // Optimistic update remains
    }
  }

  const todayExercise = useMemo(
    () => exerciseLogs.filter((l) => l.date === today),
    [exerciseLogs, today],
  )

  const todayHabitLogs = useMemo(
    () => habitLogs.filter((l) => l.date === today),
    [habitLogs, today],
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-lg font-semibold text-white/80">Habits & Tracking</h2>

      {/* Row 1: Reading Tracker (full width) */}
      <ReadingTracker onLog={handleReadingLog} recentLogs={readingLogs} />

      {/* Row 2: Daily Habits + Exercise Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HabitTracker
          habits={habits}
          todayLogs={todayHabitLogs}
          onToggle={handleHabitToggle}
          allLogs={habitLogs}
        />
        <ExerciseLog
          onLog={handleExerciseLog}
          todayLogs={todayExercise}
          allLogs={exerciseLogs}
        />
      </div>

      {/* Row 3: Weekly Activity (full width) */}
      <WeeklyActivity
        exerciseLogs={exerciseLogs}
        readingLogs={readingLogs}
        habitLogs={habitLogs}
        habits={habits}
      />
    </motion.div>
  )
}
