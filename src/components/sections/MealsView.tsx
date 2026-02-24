"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MealPlanCard } from "@/components/meals/MealPlanCard"
import { CookCard } from "@/components/meals/CookCard"
import { MealLogger } from "@/components/meals/MealLogger"
import { MealLogs } from "@/components/meals/MealLogs"
import { NutritionTips } from "@/components/meals/NutritionTips"
import { getTodaysMealPlan } from "@/lib/nutrition"

export function MealsView() {
  const mealPlan = getTodaysMealPlan()
  const [logSuccess, setLogSuccess] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleLogMeal(entry: { date: string; meal_type: string; description: string }) {
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
      if (res.ok) {
        setLogSuccess(true)
        setRefreshKey((k) => k + 1)
        setTimeout(() => setLogSuccess(false), 2000)
      }
    } catch {
      // Silent fail for demo mode
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-lg font-semibold text-white/80">Meals & Nutrition</h2>

      {logSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="glass text-xs text-cosmic-light/70 px-4 py-2 inline-block"
        >
          Meal logged successfully
        </motion.div>
      )}

      {/* Log a Meal — primary action */}
      <MealLogger onLog={handleLogMeal} />

      {/* Today's Logs — shows meals logged today */}
      <MealLogs refreshKey={refreshKey} />

      {/* Daily Essentials — checklist */}
      <NutritionTips />

      {/* Today's Meal Plan — what to eat */}
      <MealPlanCard plan={mealPlan} />

      {/* Cook's Tasks — flat checklist for the cook */}
      <CookCard plan={mealPlan} />
    </motion.div>
  )
}
