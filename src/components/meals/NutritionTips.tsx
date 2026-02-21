"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { DAILY_ESSENTIALS } from "@/lib/nutrition"

export function NutritionTips() {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const progress = checked.size / DAILY_ESSENTIALS.length

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <span className="text-amber-light">✓</span>
          Daily Essentials
        </h3>
        <span className="text-[10px] font-mono text-white/30">
          {checked.size}/{DAILY_ESSENTIALS.length}
        </span>
      </div>

      <div className="h-1 bg-white/5 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber to-amber-light rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {DAILY_ESSENTIALS.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-center gap-2.5 w-full text-left py-1 group"
          >
            <div
              className={`w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${
                checked.has(i)
                  ? "border-amber/50 bg-amber/20 text-amber-light"
                  : "border-white/15 group-hover:border-white/30"
              }`}
            >
              {checked.has(i) && <span className="text-[8px]">✓</span>}
            </div>
            <span className="text-xs mr-1">{item.icon}</span>
            <span
              className={`text-xs transition-all flex-1 ${
                checked.has(i) ? "text-white/30 line-through" : "text-white/60"
              }`}
            >
              {item.item}
            </span>
            <span className="text-[9px] text-white/20 font-mono">{item.time}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  )
}
