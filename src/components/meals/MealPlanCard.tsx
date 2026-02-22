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
    <GlassCard glow="cosmic" className="h-full space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cosmic-light text-base leading-none">◇</span>
        <h3 className="text-base font-semibold text-white/90">Today&apos;s Meal Plan</h3>
      </div>
      <div className="space-y-2.5">
        {meals.map(([key, value]) => (
          <div key={key} className="group">
            <div className="flex items-center gap-2">
              <span className="text-sm leading-none opacity-70 group-hover:opacity-100 transition-opacity">
                {MEAL_ICONS[key]}
              </span>
              <span className="text-[10px] font-mono text-cosmic/60 uppercase tracking-wider">
                {MEAL_TYPE_LABELS[key]}
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mt-1 pl-[1.625rem]">{value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
