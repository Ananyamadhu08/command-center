"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import type { Brief, EveningBriefContent, ExerciseLog, ReadingLog, HabitLog, Habit, MealLog } from "@/lib/types"

interface EveningBriefPageProps {
  brief: Brief
}

interface TodayStats {
  exerciseMinutes: number
  habitsCompleted: number
  habitsTotal: number
  pagesRead: number
  mealsTracked: number
}

function parseEveningContent(content: string): EveningBriefContent | null {
  try {
    return JSON.parse(content) as EveningBriefContent
  } catch {
    return null
  }
}

export function EveningBriefPage({ brief }: EveningBriefPageProps) {
  const parsed = parseEveningContent(brief.content)
  const [stats, setStats] = useState<TodayStats>({
    exerciseMinutes: 0,
    habitsCompleted: 0,
    habitsTotal: 0,
    pagesRead: 0,
    mealsTracked: 0,
  })

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]

    Promise.all([
      fetch(`/api/exercise?date=${today}`).then((r) => r.json()),
      fetch("/api/habits").then((r) => r.json()),
      fetch(`/api/habits?logs=true&date=${today}`).then((r) => r.json()),
      fetch(`/api/reading?date=${today}`).then((r) => r.json()),
      fetch(`/api/meals?date=${today}`).then((r) => r.json()),
    ])
      .then(([exerciseRes, habitsRes, habitLogsRes, readingRes, mealsRes]) => {
        const exercises: ExerciseLog[] = exerciseRes.success ? exerciseRes.data : []
        const habits: Habit[] = habitsRes.success ? habitsRes.data : []
        const habitLogs: HabitLog[] = habitLogsRes.success ? habitLogsRes.data : []
        const reading: ReadingLog[] = readingRes.success ? readingRes.data : []
        const meals: MealLog[] = mealsRes.success ? mealsRes.data : []

        setStats({
          exerciseMinutes: exercises.reduce((sum: number, e: ExerciseLog) => sum + e.duration_minutes, 0),
          habitsCompleted: habitLogs.filter((l: HabitLog) => l.completed).length,
          habitsTotal: habits.length,
          pagesRead: reading.reduce((sum: number, r: ReadingLog) => sum + r.pages_read, 0),
          mealsTracked: meals.length,
        })
      })
      .catch(() => {})
  }, [])

  const statCards = [
    { label: "Exercise", value: `${stats.exerciseMinutes} min`, icon: "💪", glow: "electric" as const },
    { label: "Habits", value: `${stats.habitsCompleted}/${stats.habitsTotal}`, icon: "✓", glow: "cosmic" as const },
    { label: "Reading", value: `${stats.pagesRead} pages`, icon: "📖", glow: "amber" as const },
    { label: "Meals", value: `${stats.mealsTracked} logged`, icon: "🍽", glow: "none" as const },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🌙</span>
        <div>
          <h1 className="text-xl font-semibold text-white/90">{brief.title}</h1>
          <p className="text-xs font-mono text-white/30">
            {new Date(brief.created_at).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <GlassCard key={card.label} glow={card.glow}>
            <div className="text-center">
              <span className="text-lg">{card.icon}</span>
              <p className="text-lg font-semibold text-white/90 mt-1">{card.value}</p>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{card.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {parsed ? (
        <>
          {parsed.completed.length > 0 && (
            <GlassCard glow="cosmic">
              <h3 className="text-xs font-mono text-cosmic-light/60 uppercase tracking-wider mb-3">
                Completed
              </h3>
              <ul className="space-y-2">
                {parsed.completed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-emerald-400/60 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {parsed.in_progress.length > 0 && (
            <GlassCard glow="electric">
              <h3 className="text-xs font-mono text-electric-light/60 uppercase tracking-wider mb-3">
                In Progress
              </h3>
              <ul className="space-y-2">
                {parsed.in_progress.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-electric-light/50 mt-0.5">◌</span>
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {parsed.tomorrow.length > 0 && (
            <GlassCard glow="amber">
              <h3 className="text-xs font-mono text-amber-light/60 uppercase tracking-wider mb-3">
                Tomorrow&apos;s Priorities
              </h3>
              <ol className="space-y-2">
                {parsed.tomorrow.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-amber-light/50 text-xs font-mono mt-0.5">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </GlassCard>
          )}

          {parsed.reflection && (
            <GlassCard className="text-center py-8">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider mb-2">Reflection</p>
              <p className="text-sm text-white/50 italic leading-relaxed max-w-lg mx-auto">
                {parsed.reflection}
              </p>
            </GlassCard>
          )}
        </>
      ) : (
        <GlassCard>
          <div className="text-sm text-white/70 whitespace-pre-wrap">{brief.content}</div>
        </GlassCard>
      )}
    </motion.div>
  )
}
