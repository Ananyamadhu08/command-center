"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Check, Package } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { extractTomorrowPrep } from "@/lib/cook-tasks"
import type { MealPlanData } from "@/lib/types"
import { EmptyState } from "@/components/ui/EmptyState"

interface TomorrowPrepCardProps {
  tomorrowPlan: MealPlanData
  tomorrowLabel: string
}

export function TomorrowPrepCard({ tomorrowPlan, tomorrowLabel }: TomorrowPrepCardProps) {
  const tasks = useMemo(() => extractTomorrowPrep(tomorrowPlan), [tomorrowPlan])
  const [checked, setChecked] = useState<Set<string>>(new Set())

  if (tasks.length === 0) return null

  const progress = tasks.length > 0 ? checked.size / tasks.length : 0

  function toggle(taskId: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  return (
    <GlassCard glow="amber">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-amber-light" />
          <h3 className="text-base font-semibold text-white/90">Prep for Tomorrow</h3>
          <span className="text-[10px] font-mono text-white/30">
            {tomorrowLabel}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/30">
          {checked.size}/{tasks.length}
        </span>
      </div>

      <div className="h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber to-amber-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-1.5">
        {tasks.map((task, index) => (
          <motion.button
            key={task.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            onClick={() => toggle(task.id)}
            className="flex items-center gap-2.5 w-full text-left py-1.5 px-1 rounded-lg hover:bg-white/[0.02] transition-colors group"
          >
            <div
              className={`w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${
                checked.has(task.id)
                  ? "border-amber/50 bg-amber/20 text-amber-light"
                  : "border-white/15 group-hover:border-white/30"
              }`}
            >
              {checked.has(task.id) && <Check size={10} />}
            </div>
            <span className="text-xs mr-1">{task.emoji}</span>
            <span
              className={`text-xs transition-all flex-1 ${
                checked.has(task.id)
                  ? "text-white/30 line-through"
                  : "text-white/60 group-hover:text-white/80"
              }`}
            >
              {task.description}
              {task.quantity && (
                <span className="text-white/30 ml-1.5">({task.quantity})</span>
              )}
            </span>
          </motion.button>
        ))}
      </div>
    </GlassCard>
  )
}
