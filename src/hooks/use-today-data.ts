import { useState, useEffect, useMemo } from "react"
import { fetchApi } from "@/lib/api"
import { getToday } from "@/lib/utils"
import type {
  Brief,
  BriefType,
  ExerciseLog,
  ReadingLog,
  MealLog,
  Habit,
  HabitLog,
} from "@/lib/types"

interface WeatherData {
  temp: number
  condition: string
  icon: string
  city: string
}

const EXERCISE_TYPE_LABELS: Record<string, string> = {
  morning_stretch: "Stretch",
  gym: "Gym",
  walk: "Walk",
  yoga: "Yoga",
}

export function useTodayData() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([])
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([])
  const [mealLogs, setMealLogs] = useState<MealLog[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const today = getToday()

  useEffect(() => {
    fetchApi<Brief[]>(`/api/briefs?date=${today}`).then((data) => {
      if (data) setBriefs(data)
    })
    fetchApi<Habit[]>("/api/habits").then((data) => {
      if (data) setHabits(data)
    })
    fetchApi<HabitLog[]>(`/api/habits?logs=true&date=${today}`).then((data) => {
      if (data) setHabitLogs(data)
    })
    fetchApi<ExerciseLog[]>(`/api/exercise?date=${today}`).then((data) => {
      if (data) setExerciseLogs(data)
    })
    fetchApi<ReadingLog[]>(`/api/reading?date=${today}`).then((data) => {
      if (data) setReadingLogs(data)
    })
    fetchApi<MealLog[]>(`/api/meals?date=${today}`).then((data) => {
      if (data) setMealLogs(data)
    })
    fetchApi<WeatherData>("/api/weather").then((data) => {
      if (data) setWeather(data)
    })
  }, [today])

  const exerciseMinutes = useMemo(
    () => exerciseLogs.reduce((sum, e) => sum + e.duration_minutes, 0),
    [exerciseLogs],
  )

  const exerciseType = exerciseLogs.length > 0
    ? EXERCISE_TYPE_LABELS[exerciseLogs[0].type] ?? exerciseLogs[0].type
    : null

  const pagesRead = useMemo(
    () => readingLogs.reduce((sum, r) => sum + r.pages_read, 0),
    [readingLogs],
  )

  const currentBook = readingLogs.length > 0 ? readingLogs[0].book_title : null

  const completedHabits = useMemo(() => {
    const done = new Set(
      habitLogs.filter((l) => l.date === today && l.completed).map((l) => l.habit_id),
    )
    return done.size
  }, [habitLogs, today])

  const briefsByType = useMemo(
    () => new Map<BriefType, Brief>(briefs.map((b) => [b.type, b])),
    [briefs],
  )

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

  return {
    today,
    briefs,
    briefsByType,
    habits,
    habitLogs,
    exerciseMinutes,
    exerciseType,
    pagesRead,
    currentBook,
    completedHabits,
    mealLogs,
    weather,
    handleHabitToggle,
  }
}

export type { WeatherData }
