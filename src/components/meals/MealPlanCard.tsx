"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { MEAL_TYPE_LABELS } from "@/lib/nutrition"
import type { MealPlanData } from "@/lib/types"

interface MealPlanCardProps {
  plan: MealPlanData
}

const MEAL_ICONS: Record<string, string> = {
  early_morning: "🌅",
  breakfast: "🍳",
  mid_morning_snack: "🍏",
  lunch: "🍛",
  evening_snack: "☕",
  dinner: "🌙",
  before_bed: "😴",
}

export function MealPlanCard({ plan }: MealPlanCardProps) {
  const meals = Object.entries(plan) as [keyof MealPlanData, string][]

  return (
    <GlassCard glow="cosmic" className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-cosmic-light text-sm">◇</span>
        <h3 className="text-sm font-semibold text-white/90">Today&apos;s Meal Plan</h3>
      </div>
      <div className="space-y-2.5">
        {meals.map(([key, value]) => (
          <div key={key} className="flex items-start gap-2.5 group">
            <span className="text-xs mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
              {MEAL_ICONS[key]}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-cosmic/60 uppercase tracking-wider">
                {MEAL_TYPE_LABELS[key]}
              </span>
              <p className="text-xs text-white/60 leading-relaxed mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
