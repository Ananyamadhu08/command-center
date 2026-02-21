import type {
  ExerciseLog,
  ReadingLog,
  Habit,
  HabitLog,
  MealLog,
  AnalyticsExercise,
  AnalyticsHabits,
  AnalyticsReading,
  AnalyticsMeals,
  AnalyticsData,
} from "./types"

function daysAgoDate(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split("T")[0]
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => daysAgoDate(i))
}

function last14Days(): string[] {
  return Array.from({ length: 14 }, (_, i) => daysAgoDate(i))
}

export function computeExerciseStats(logs: ExerciseLog[]): AnalyticsExercise {
  const days7 = new Set(last7Days())
  const days14 = new Set(last14Days())

  const logs7 = logs.filter((l) => days7.has(l.date))
  const logs14 = logs.filter((l) => days14.has(l.date))

  const total_minutes_7d = logs7.reduce((sum, l) => sum + l.duration_minutes, 0)
  const total_minutes_14d = logs14.reduce((sum, l) => sum + l.duration_minutes, 0)

  const dailyMap = new Map<string, number>()
  for (const log of logs14) {
    dailyMap.set(log.date, (dailyMap.get(log.date) ?? 0) + log.duration_minutes)
  }

  const daily_breakdown = last14Days()
    .reverse()
    .map((date) => ({ date, minutes: dailyMap.get(date) ?? 0 }))

  const typeMap: Record<string, number> = {}
  for (const log of logs7) {
    typeMap[log.type] = (typeMap[log.type] ?? 0) + log.duration_minutes
  }

  const active_days_7d = new Set(logs7.map((l) => l.date)).size

  return { total_minutes_7d, total_minutes_14d, daily_breakdown, type_breakdown: typeMap, active_days_7d }
}

export function computeHabitStats(habits: Habit[], logs: HabitLog[]): AnalyticsHabits {
  const days7 = new Set(last7Days())
  const logs7 = logs.filter((l) => days7.has(l.date))

  const totalPossible = habits.length * 7
  const completedCount = logs7.filter((l) => l.completed).length
  const completion_rate_7d = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0

  const perHabit = habits.map((h) => {
    const habitLogs7 = logs7.filter((l) => l.habit_id === h.id)
    const completed = habitLogs7.filter((l) => l.completed).length
    return {
      name: h.name,
      icon: h.icon,
      rate: Math.round((completed / 7) * 100),
    }
  })

  const bestHabit = perHabit.reduce(
    (best, h) => (h.rate > best.rate ? h : best),
    { name: "None", icon: "", rate: 0 },
  )

  return {
    total_habits: habits.length,
    completion_rate_7d,
    best_streak: bestHabit.name,
    per_habit: perHabit,
  }
}

export function computeReadingStats(logs: ReadingLog[]): AnalyticsReading {
  const days7 = new Set(last7Days())
  const days14 = new Set(last14Days())

  const logs7 = logs.filter((l) => days7.has(l.date))
  const logs14 = logs.filter((l) => days14.has(l.date))

  const pages_7d = logs7.reduce((sum, l) => sum + l.pages_read, 0)
  const pages_14d = logs14.reduce((sum, l) => sum + l.pages_read, 0)

  const current_book = logs.length > 0 ? logs[0].book_title : "No book tracked"

  const dailyMap = new Map<string, number>()
  for (const log of logs14) {
    dailyMap.set(log.date, (dailyMap.get(log.date) ?? 0) + log.pages_read)
  }

  const daily_breakdown = last14Days()
    .reverse()
    .map((date) => ({ date, pages: dailyMap.get(date) ?? 0 }))

  return { pages_7d, pages_14d, current_book, daily_breakdown }
}

export function computeMealStats(logs: MealLog[]): AnalyticsMeals {
  const days7 = new Set(last7Days())
  const logs7 = logs.filter((l) => days7.has(l.date))
  const trackedDays = new Set(logs7.map((l) => l.date)).size

  return { tracked_days_7d: trackedDays, total_logged: logs7.length }
}

export function computeOverallStatus(
  exercise: AnalyticsExercise,
  habits: AnalyticsHabits,
  reading: AnalyticsReading,
  meals: AnalyticsMeals,
): { on_track: string[]; off_track: string[] } {
  const on_track: string[] = []
  const off_track: string[] = []

  if (exercise.active_days_7d >= 4) {
    on_track.push("Exercise — active " + exercise.active_days_7d + "/7 days")
  } else {
    off_track.push("Exercise — only " + exercise.active_days_7d + "/7 active days")
  }

  if (habits.completion_rate_7d >= 50) {
    on_track.push("Habits — " + habits.completion_rate_7d + "% completion rate")
  } else {
    off_track.push("Habits — " + habits.completion_rate_7d + "% completion (target: 50%+)")
  }

  if (reading.pages_7d >= 100) {
    on_track.push("Reading — " + reading.pages_7d + " pages this week")
  } else {
    off_track.push("Reading — " + reading.pages_7d + " pages (target: 100+/week)")
  }

  if (meals.tracked_days_7d >= 5) {
    on_track.push("Meals — tracked " + meals.tracked_days_7d + "/7 days")
  } else {
    off_track.push("Meals — only tracked " + meals.tracked_days_7d + "/7 days")
  }

  return { on_track, off_track }
}

export function computeAnalytics(
  exerciseLogs: ExerciseLog[],
  habits: Habit[],
  habitLogs: HabitLog[],
  readingLogs: ReadingLog[],
  mealLogs: MealLog[],
): AnalyticsData {
  const exercise = computeExerciseStats(exerciseLogs)
  const habitsStats = computeHabitStats(habits, habitLogs)
  const reading = computeReadingStats(readingLogs)
  const meals = computeMealStats(mealLogs)
  const overall = computeOverallStatus(exercise, habitsStats, reading, meals)

  return { exercise, habits: habitsStats, reading, meals, overall }
}
