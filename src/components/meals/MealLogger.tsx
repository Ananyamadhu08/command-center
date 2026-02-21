"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { TextArea } from "@/components/ui/Input"
import { MEAL_TYPE_OPTIONS, MEAL_TYPE_LABELS } from "@/lib/nutrition"
import { getToday } from "@/lib/utils"

interface MealLoggerProps {
  onLog: (entry: { date: string; meal_type: string; description: string }) => void
}

export function MealLogger({ onLog }: MealLoggerProps) {
  const [mealType, setMealType] = useState<string>(MEAL_TYPE_OPTIONS[0])
  const [description, setDescription] = useState("")

  function handleSubmit() {
    if (!description.trim()) return
    onLog({
      date: getToday(),
      meal_type: mealType,
      description: description.trim(),
    })
    setDescription("")
  }

  return (
    <GlassCard>
      <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
        <span className="text-amber-light">✏</span>
        Log a Meal
      </h3>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {MEAL_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setMealType(opt)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                mealType === opt
                  ? "border-amber/40 bg-amber/15 text-amber-light"
                  : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {MEAL_TYPE_LABELS[opt]}
            </button>
          ))}
        </div>
        <TextArea
          value={description}
          onChange={setDescription}
          placeholder="What did you eat?"
          rows={2}
        />
        <GlowButton
          variant="amber"
          size="sm"
          onClick={handleSubmit}
          disabled={!description.trim()}
        >
          Log Meal
        </GlowButton>
      </div>
    </GlassCard>
  )
}
