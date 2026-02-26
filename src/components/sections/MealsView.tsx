"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Utensils } from "lucide-react"
import { MealPlanCard } from "@/components/meals/MealPlanCard"
import { CookCard } from "@/components/meals/CookCard"
import { TomorrowPrepCard } from "@/components/meals/TomorrowPrepCard"
import { MealLogger } from "@/components/meals/MealLogger"
import { MealLogs } from "@/components/meals/MealLogs"
import { NutritionTips } from "@/components/meals/NutritionTips"
import { WaterPlantCard } from "@/components/water/WaterPlantCard"
import { getTodaysMealPlan, getTomorrowsMealPlan } from "@/lib/nutrition"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function MealsView() {
  const mealPlan = getTodaysMealPlan()
  const tomorrowPlan = getTomorrowsMealPlan()
  const tomorrowLabel = DAY_NAMES[(new Date().getDay() + 1) % 7]
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
      <div className="flex items-center gap-3">
        <Utensils size={26} strokeWidth={1.75} style={{ stroke: "url(#icon-gradient)" }} />
        <h2 className="text-2xl font-light text-white/90">Meals & Nutrition</h2>
      </div>

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

      {/* Water Plant — tap to water */}
      <WaterPlantCard />

      {/* Log a Meal — primary action */}
      <MealLogger onLog={handleLogMeal} />

      {/* Today's Logs — shows meals logged today */}
      <MealLogs refreshKey={refreshKey} />

      {/* Daily Essentials — checklist */}
      <NutritionTips />

      {/* Today's Meal Plan — what to eat */}
      <MealPlanCard plan={mealPlan} />

      {/* Cook's Tasks — flat checklist for the cook */}
      <CookCard plan={mealPlan} tomorrowPlan={tomorrowPlan} />

      {/* Prep for Tomorrow — overnight soaking, stocking, etc. */}
      <TomorrowPrepCard tomorrowPlan={tomorrowPlan} tomorrowLabel={tomorrowLabel} />
    </motion.div>
  )
}
