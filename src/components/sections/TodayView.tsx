"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { BriefCard, PendingBriefCard } from "@/components/briefs/BriefCard"
import { MealPlanCard } from "@/components/meals/MealPlanCard"
import { NutritionTips } from "@/components/meals/NutritionTips"
import { HabitTracker } from "@/components/habits/HabitTracker"
import { getTodaysMealPlan } from "@/lib/nutrition"
import { getToday } from "@/lib/utils"
import type {
  Brief,
  BriefType,
  ExerciseLog,
  ReadingLog,
  MealLog,
  Habit,
  HabitLog,
  NavSection,
} from "@/lib/types"

interface TodayViewProps {
  onNavigate: (section: NavSection) => void
}

interface WeatherData {
  temp: number
  condition: string
  icon: string
  city: string
}

const WEATHER_ICONS: Record<string, string> = {
  "01d": "\u2600\uFE0F",
  "01n": "\uD83C\uDF19",
  "02d": "\u26C5",
  "02n": "\u2601\uFE0F",
  "03d": "\u2601\uFE0F",
  "03n": "\u2601\uFE0F",
  "04d": "\u2601\uFE0F",
  "04n": "\u2601\uFE0F",
  "09d": "\uD83C\uDF27\uFE0F",
  "09n": "\uD83C\uDF27\uFE0F",
  "10d": "\uD83C\uDF26\uFE0F",
  "10n": "\uD83C\uDF27\uFE0F",
  "11d": "\u26C8\uFE0F",
  "11n": "\u26C8\uFE0F",
  "13d": "\u2744\uFE0F",
  "13n": "\u2744\uFE0F",
  "50d": "\uD83C\uDF2B\uFE0F",
  "50n": "\uD83C\uDF2B\uFE0F",
}

const EXERCISE_TYPE_LABELS: Record<string, string> = {
  morning_stretch: "Stretch",
  gym: "Gym",
  walk: "Walk",
  yoga: "Yoga",
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const BRIEF_TYPES: BriefType[] = ["morning_briefing", "tech_news", "evening_review"]

export function TodayView({ onNavigate }: TodayViewProps) {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([])
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([])
  const [mealLogs, setMealLogs] = useState<MealLog[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const today = getToday()
  const mealPlan = getTodaysMealPlan()

  useEffect(() => {
    const fetchJson = (url: string) => fetch(url).then((r) => r.json())

    fetchJson(`/api/briefs?date=${today}`)
      .then((r) => { if (r.success) setBriefs(r.data) })
      .catch(() => {})

    fetchJson("/api/habits")
      .then((r) => { if (r.success) setHabits(r.data) })
      .catch(() => {})

    fetchJson(`/api/habits?logs=true&date=${today}`)
      .then((r) => { if (r.success) setHabitLogs(r.data) })
      .catch(() => {})

    fetchJson(`/api/exercise?date=${today}`)
      .then((r) => { if (r.success) setExerciseLogs(r.data) })
      .catch(() => {})

    fetchJson(`/api/reading?date=${today}`)
      .then((r) => { if (r.success) setReadingLogs(r.data) })
      .catch(() => {})

    fetchJson(`/api/meals?date=${today}`)
      .then((r) => { if (r.success) setMealLogs(r.data) })
      .catch(() => {})

    fetchJson("/api/weather")
      .then((r) => { if (r.success) setWeather(r.data) })
      .catch(() => {})
  }, [today])

  // Derived stats
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
    () => new Map(briefs.map((b) => [b.type, b])),
    [briefs],
  )

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

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Today's Overview — Stat Cards */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white/80 mb-3">Today&apos;s Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Weather */}
          <GlassCard hover={false} className="h-full text-center py-4">
            <span className="text-2xl block mb-1">
              {weather ? (WEATHER_ICONS[weather.icon] ?? "\u2601\uFE0F") : "\u2601\uFE0F"}
            </span>
            <p className="text-lg font-semibold text-white/90">
              {weather ? `${weather.temp}\u00B0` : "--\u00B0"}
            </p>
            <p className="text-[10px] font-mono text-white/30 mt-0.5 capitalize truncate">
              {weather?.condition ?? "Loading..."}
            </p>
          </GlassCard>

          {/* Exercise */}
          <GlassCard hover={false} className="h-full text-center py-4">
            <span className="text-2xl block mb-1">{"\uD83C\uDFCB\uFE0F"}</span>
            <p className="text-lg font-semibold text-white/90">
              {exerciseMinutes > 0 ? `${exerciseMinutes}` : "0"} min
            </p>
            <p className="text-[10px] font-mono text-white/30 mt-0.5 truncate">
              {exerciseType ?? "No workout yet"}
            </p>
          </GlassCard>

          {/* Reading */}
          <GlassCard hover={false} className="h-full text-center py-4">
            <span className="text-2xl block mb-1">{"\uD83D\uDCDA"}</span>
            <p className="text-lg font-semibold text-white/90">
              {pagesRead > 0 ? `${pagesRead}` : "0"} pages
            </p>
            <p className="text-[10px] font-mono text-white/30 mt-0.5 truncate">
              {currentBook ?? "No reading yet"}
            </p>
          </GlassCard>

          {/* Habits */}
          <GlassCard hover={false} className="h-full text-center py-4">
            <span className="text-2xl block mb-1">{"\u2705"}</span>
            <p className="text-lg font-semibold text-white/90">
              {completedHabits}/{habits.length}
            </p>
            <p className="text-[10px] font-mono text-white/30 mt-0.5">
              Habits done
            </p>
          </GlassCard>

          {/* Meals */}
          <GlassCard hover={false} className="h-full text-center py-4">
            <span className="text-2xl block mb-1">{"\uD83C\uDF7D\uFE0F"}</span>
            <p className="text-lg font-semibold text-white/90">
              {mealLogs.length}/7
            </p>
            <p className="text-[10px] font-mono text-white/30 mt-0.5">
              Meals tracked
            </p>
          </GlassCard>
        </div>
      </motion.div>

      {/* Briefs */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">Briefs</h3>
          <button
            onClick={() => onNavigate("briefs")}
            className="text-[10px] text-cosmic-light/50 hover:text-cosmic-light transition-colors"
          >
            View all {"\u2192"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BRIEF_TYPES.map((type) => {
            const brief = briefsByType.get(type)
            return brief ? (
              <BriefCard key={type} brief={brief} />
            ) : (
              <PendingBriefCard key={type} type={type} />
            )
          })}
        </div>
      </motion.div>

      {/* Habits — full width */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">Habits</h3>
          <button
            onClick={() => onNavigate("habits")}
            className="text-[10px] text-cosmic-light/50 hover:text-cosmic-light transition-colors"
          >
            Details {"\u2192"}
          </button>
        </div>
        <HabitTracker habits={habits} todayLogs={habitLogs} onToggle={handleHabitToggle} />
      </motion.div>

      {/* Nutrition */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">Nutrition</h3>
          <button
            onClick={() => onNavigate("meals")}
            className="text-[10px] text-amber-light/50 hover:text-amber-light transition-colors"
          >
            Full plan {"\u2192"}
          </button>
        </div>
        <MealPlanCard plan={mealPlan} />
        <NutritionTips />
      </motion.div>
    </motion.div>
  )
}
