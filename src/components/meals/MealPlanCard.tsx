"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { MEAL_TYPE_LABELS, MEAL_ICONS } from "@/lib/nutrition"
import { ClipboardList } from "lucide-react"
import type { MealPlanData } from "@/lib/types"

interface MealPlanCardProps {
  plan: MealPlanData
}

const TIME_HINTS: Record<string, string> = {
  early_morning: "6:30 AM",
  breakfast: "7:30 AM",
  mid_morning_snack: "10 AM",
  lunch: "12:30 PM",
  evening_snack: "3:30 PM",
  dinner: "7:30 PM",
  before_bed: "9:30 PM",
}

export function MealPlanCard({ plan }: MealPlanCardProps) {
  const meals = Object.entries(plan) as [keyof MealPlanData, string][]

  return (
    <GlassCard glow="cosmic" className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={14} className="text-cosmic-light" />
        <h3 className="text-base font-semibold text-white/90">Today&apos;s Meal Plan</h3>
      </div>

      <div className="space-y-3">
        {meals.map(([key, value], index) => {
          const items = value.split("+").map((s) => s.trim())
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
              className="group"
            >
              {index > 0 && <div className="border-t border-white/5 mb-3" />}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                  {MEAL_ICONS[key]}
                </span>
                <span className="text-[10px] font-mono text-cosmic-light/60 uppercase tracking-wider">
                  {MEAL_TYPE_LABELS[key]}
                </span>
                <span className="text-[9px] font-mono text-white/20 ml-auto">
                  {TIME_HINTS[key]}
                </span>
              </div>
              <div className="pl-[1.625rem] flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs text-white/60 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2 py-0.5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
