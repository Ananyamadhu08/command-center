"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { BriefCard } from "@/components/briefs/BriefCard"
import { BriefDetail } from "@/components/briefs/BriefDetail"
import { MealPlanCard } from "@/components/meals/MealPlanCard"
import { NutritionTips } from "@/components/meals/NutritionTips"
import { HabitTracker } from "@/components/habits/HabitTracker"
import { getTodaysMealPlan } from "@/lib/nutrition"
import { getToday } from "@/lib/utils"
import type { Brief, Habit, HabitLog, NavSection } from "@/lib/types"

interface TodayViewProps {
  onNavigate: (section: NavSection) => void
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

export function TodayView({ onNavigate }: TodayViewProps) {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null)

  const today = getToday()
  const mealPlan = getTodaysMealPlan()

  useEffect(() => {
    fetch(`/api/briefs?date=${today}`)
      .then((r) => r.json())
      .then((r) => { if (r.success) setBriefs(r.data) })
      .catch(() => {})

    fetch("/api/habits")
      .then((r) => r.json())
      .then((r) => { if (r.success) setHabits(r.data) })
      .catch(() => {})

    fetch(`/api/habits?logs=true&date=${today}`)
      .then((r) => r.json())
      .then((r) => { if (r.success) setHabitLogs(r.data) })
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

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white/80 mb-4">Today&apos;s Overview</h2>
      </motion.div>

      {briefs.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">Latest Briefs</h3>
            <button
              onClick={() => onNavigate("briefs")}
              className="text-[10px] text-cosmic-light/50 hover:text-cosmic-light transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {briefs.slice(0, 3).map((brief) => (
              <BriefCard key={brief.id} brief={brief} onClick={() => setSelectedBrief(brief)} />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">Nutrition</h3>
            <button
              onClick={() => onNavigate("meals")}
              className="text-[10px] text-amber-light/50 hover:text-amber-light transition-colors"
            >
              Full plan →
            </button>
          </div>
          <MealPlanCard plan={mealPlan} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">Habits</h3>
            <button
              onClick={() => onNavigate("habits")}
              className="text-[10px] text-cosmic-light/50 hover:text-cosmic-light transition-colors"
            >
              Details →
            </button>
          </div>
          <HabitTracker habits={habits} todayLogs={habitLogs} onToggle={handleHabitToggle} />
          <NutritionTips />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <GlassCard className="text-center py-8">
          <p className="text-xs text-white/20 font-mono">
            Press 1-5 to navigate · Connected to the cosmos
          </p>
        </GlassCard>
      </motion.div>

      <BriefDetail brief={selectedBrief} onClose={() => setSelectedBrief(null)} />
    </motion.div>
  )
}
