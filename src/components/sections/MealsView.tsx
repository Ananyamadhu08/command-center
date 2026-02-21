"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MealPlanCard } from "@/components/meals/MealPlanCard"
import { CookCard } from "@/components/meals/CookCard"
import { MealLogger } from "@/components/meals/MealLogger"
import { NutritionTips } from "@/components/meals/NutritionTips"
import { getTodaysMealPlan } from "@/lib/nutrition"

export function MealsView() {
  const mealPlan = getTodaysMealPlan()
  const [logSuccess, setLogSuccess] = useState(false)

  async function handleLogMeal(entry: { date: string; meal_type: string; description: string }) {
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
      if (res.ok) {
        setLogSuccess(true)
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

      {/* Daily Essentials + Meal Plan — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NutritionTips />
        <MealPlanCard plan={mealPlan} />
      </div>

      {/* Cook's Card — full width reference */}
      <CookCard plan={mealPlan} />
    </motion.div>
  )
}
