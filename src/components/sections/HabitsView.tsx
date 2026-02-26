"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { HabitTracker } from "@/components/habits/HabitTracker"
import { ExerciseLog } from "@/components/habits/ExerciseLog"
import { ReadingTracker } from "@/components/habits/ReadingTracker"
import { WeeklyActivity } from "@/components/habits/WeeklyActivity"
import { fetchApi } from "@/lib/api"
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
    fetchApi<Habit[]>("/api/habits").then((data) => {
      if (data) setHabits(data)
    })
    fetchApi<HabitLog[]>("/api/habits?logs=true").then((data) => {
      if (data) setHabitLogs(data)
    })
    fetchApi<ExerciseLogType[]>("/api/exercise").then((data) => {
      if (data) setExerciseLogs(data)
    })
    fetchApi<ReadingLogType[]>("/api/reading").then((data) => {
      if (data) setReadingLogs(data)
    })
  }, [today])

  async function handleHabitToggle(habitId: string, completed: boolean) {
    const previousLogs = habitLogs
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
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit_id: habitId, date: today, completed }),
      })
      if (!res.ok) throw new Error("Failed to save")
    } catch {
      setHabitLogs(previousLogs)
    }
  }

  async function handleHabitCreate(habit: { name: string; icon: string; color: string }) {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      ...habit,
      created_at: "",
    }
    const previousHabits = habits
    setHabits((prev) => [...prev, newHabit])
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
      })
      if (!res.ok) throw new Error("Failed to save")
    } catch {
      setHabits(previousHabits)
    }
  }

  function handleHabitUpdate(habitId: string, updates: { name: string; icon: string; color: string }) {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
    )
  }

  function handleHabitDelete(habitId: string) {
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
    setHabitLogs((prev) => prev.filter((l) => l.habit_id !== habitId))
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
    const previousLogs = exerciseLogs
    setExerciseLogs((prev) => [newLog, ...prev])
    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
      if (!res.ok) throw new Error("Failed to save")
    } catch {
      setExerciseLogs(previousLogs)
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
    const previousLogs = readingLogs
    setReadingLogs((prev) => [newLog, ...prev])
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
      if (!res.ok) throw new Error("Failed to save")
    } catch {
      setReadingLogs(previousLogs)
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
      <div className="flex items-center gap-3">
        <CheckCircle size={26} strokeWidth={1.75} style={{ stroke: "url(#icon-gradient)" }} />
        <h2 className="text-2xl font-semibold text-white/90">Habits & Tracking</h2>
      </div>

      <ReadingTracker onLog={handleReadingLog} recentLogs={readingLogs} />

      <HabitTracker
        habits={habits}
        todayLogs={todayHabitLogs}
        onToggle={handleHabitToggle}
        onCreate={handleHabitCreate}
        onUpdate={handleHabitUpdate}
        onDelete={handleHabitDelete}
        allLogs={habitLogs}
      />

      <ExerciseLog
        onLog={handleExerciseLog}
        todayLogs={todayExercise}
        allLogs={exerciseLogs}
      />

      <WeeklyActivity
        exerciseLogs={exerciseLogs}
        readingLogs={readingLogs}
        habitLogs={habitLogs}
        habits={habits}
      />
    </motion.div>
  )
}
