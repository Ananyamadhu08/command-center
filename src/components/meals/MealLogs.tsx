"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { MEAL_TYPE_LABELS, MEAL_ICONS } from "@/lib/nutrition"
import { getToday } from "@/lib/utils"
import { Notebook } from "lucide-react"
import type { MealLog } from "@/lib/types"
import { EmptyState } from "@/components/ui/EmptyState"
import { Loader } from "@/components/ui/Loader"

interface MealLogsProps {
  refreshKey: number
}

const BASE_CALORIES: Record<string, number> = {
  early_morning: 80,
  breakfast: 400,
  mid_morning_snack: 150,
  lunch: 600,
  evening_snack: 150,
  dinner: 500,
  before_bed: 120,
}

const CALORIE_KEYWORDS: [RegExp, number][] = [
  [/egg|omelette|bhurji/i, 70],
  [/paratha|stuffed/i, 80],
  [/rice/i, 60],
  [/roti/i, -30],
  [/chicken|mutton|fish/i, 80],
  [/dal|sambhar|sambar/i, 20],
  [/paneer/i, 60],
  [/milk|doodh|lassi/i, 40],
  [/banana|fruit/i, 30],
  [/chai|tea|coffee/i, 15],
  [/toast/i, 20],
  [/salad/i, -20],
  [/fried/i, 50],
  [/boiled/i, -20],
  [/butter|ghee/i, 40],
  [/sugar|sweet|mithai/i, 60],
  [/nuts|almond|walnut/i, 30],
  [/dosa|idli|upma|poha/i, 40],
  [/chilla|besan/i, 30],
]

const DAILY_TARGET = 2000

function estimateCalories(mealType: string, description: string): number {
  const base = BASE_CALORIES[mealType] ?? 300
  let adjustment = 0
  for (const [pattern, delta] of CALORIE_KEYWORDS) {
    if (pattern.test(description)) {
      adjustment += delta
    }
  }
  return Math.max(50, base + adjustment)
}

function formatLogTime(created_at: string): string {
  if (!created_at) return ""
  const date = new Date(created_at)
  if (isNaN(date.getTime())) return ""
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

interface EnrichedLog {
  log: MealLog
  calories: number
  time: string
}

export function MealLogs({ refreshKey }: MealLogsProps) {
  const [logs, setLogs] = useState<MealLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`/api/meals?logs=true&date=${getToday()}`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setLogs(json.data)
          }
        }
      } catch {
        // Silent fail — empty state handles this
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [refreshKey])

  const enriched: EnrichedLog[] = useMemo(
    () =>
      logs.map((log) => ({
        log,
        calories: estimateCalories(log.meal_type, log.description),
        time: formatLogTime(log.created_at),
      })),
    [logs],
  )

  const totalCalories = useMemo(
    () => enriched.reduce((sum, e) => sum + e.calories, 0),
    [enriched],
  )

  const progress = Math.min(totalCalories / DAILY_TARGET, 1)

  return (
    <GlassCard hover={false} glow="cosmic">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
          <Notebook size={14} className="text-cosmic-light" />
          Today&apos;s Log
        </h3>
        {!loading && logs.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-mono text-white/30"
          >
            {logs.length} {logs.length === 1 ? "entry" : "entries"}
          </motion.span>
        )}
      </div>

      {loading ? (
        <Loader label="Loading meals..." size="sm" />
      ) : logs.length === 0 ? (
        <EmptyState message="No meals logged today" />
      ) : (
        <div className="space-y-4">
          {/* Calorie summary bar */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-semibold text-white/90 tabular-nums tracking-tight">
                  {totalCalories}
                </span>
                <span className="text-[10px] text-white/30 font-mono">kcal</span>
              </div>
              <span className="text-[10px] text-white/20 font-mono">
                / {DAILY_TARGET} target
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className={`h-full rounded-full ${
                  progress < 0.5
                    ? "bg-gradient-to-r from-electric/60 to-electric-light/80"
                    : progress < 0.85
                      ? "bg-gradient-to-r from-cosmic/60 to-cosmic-light/80"
                      : "bg-gradient-to-r from-amber/60 to-amber-light/80"
                }`}
              />
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 px-1 pb-2 border-b border-white/5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/20 w-20">
              Meal
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/20">
              Description
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/20 text-right w-14">
              Cal
            </span>
          </div>

          {/* Meal rows */}
          <div className="space-y-1">
            {enriched.map(({ log, calories, time }, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center px-1 py-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
              >
                {/* Meal type badge */}
                <div className="flex items-center gap-1.5 w-20">
                  <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                    {MEAL_ICONS[log.meal_type] ?? "🍽"}
                  </span>
                  <span className="text-[10px] text-white/40 truncate">
                    {MEAL_TYPE_LABELS[log.meal_type] ?? log.meal_type}
                  </span>
                </div>

                {/* Description */}
                <span className="text-xs text-white/60 truncate group-hover:text-white/80 transition-colors">
                  {log.description}
                </span>

                {/* Calories */}
                <span className="text-xs font-mono text-cosmic-light/60 text-right w-14 tabular-nums">
                  ~{calories}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Footer summary */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 items-center px-1 pt-2 border-t border-white/5">
            <span className="text-[10px] font-semibold text-white/40 w-20">Total</span>
            <span />
            <span className="text-xs font-mono font-semibold text-cosmic-light/80 text-right w-14 tabular-nums">
              ~{totalCalories}
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
