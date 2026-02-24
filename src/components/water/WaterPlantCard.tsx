"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Droplets, Plus } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { Plant, getPlantState, type PlantState } from "./Plant"
import { getToday } from "@/lib/utils"

const TARGET = 8
const STATE_LABELS: Record<PlantState, string> = {
  dead: "Your plant is dying!",
  wilted: "Needs water badly",
  dry: "Getting thirsty...",
  healthy: "Looking good!",
  thriving: "Blooming beautifully!",
}

export function WaterPlantCard() {
  const [glasses, setGlasses] = useState(0)
  const [loading, setLoading] = useState(true)
  const [animateWater, setAnimateWater] = useState(false)

  const fetchWater = useCallback(async () => {
    try {
      const res = await fetch(`/api/water?date=${getToday()}`)
      if (res.ok) {
        const json = await res.json()
        if (json.success) setGlasses(json.data.glasses)
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWater() }, [fetchWater])

  async function addGlass() {
    setAnimateWater(true)
    setTimeout(() => setAnimateWater(false), 800)

    const prev = glasses
    setGlasses((g) => g + 1)

    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: getToday(), increment: 1 }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success) setGlasses(json.data.glasses)
      }
    } catch {
      setGlasses(prev)
    }
  }

  const state = getPlantState(glasses)
  const progress = Math.min(glasses / TARGET, 1)

  if (loading) return null

  return (
    <GlassCard glow="cosmic" hover={false}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Droplets size={14} className="text-sky-400" />
          <h3 className="text-base font-semibold text-white/90">Water Plant</h3>
        </div>
        <span className="text-[10px] font-mono text-white/30">
          {glasses}/{TARGET} glasses
        </span>
      </div>

      {/* Plant on top */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Plant state={state} size="lg" />

          {/* Water drop animation */}
          {animateWater && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2"
              initial={{ y: -10, opacity: 1, scale: 1 }}
              animate={{ y: 60, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.7, ease: "easeIn" }}
            >
              <Droplets size={20} className="text-sky-400" />
            </motion.div>
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-sm text-white/70 font-medium">{STATE_LABELS[state]}</p>
          <p className="text-[10px] text-white/30 font-mono mt-1">
            {glasses >= TARGET
              ? `${glasses - TARGET} bonus ${glasses - TARGET === 1 ? "glass" : "glasses"}`
              : `${TARGET - glasses} more to go`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-1.5">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-500/70 to-sky-400/90"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

        </div>

        {/* Add glass button */}
        <GlowButton variant="ghost" size="sm" onClick={addGlass}>
          <span className="flex items-center gap-1.5">
            <Plus size={14} />
            Add a glass
          </span>
        </GlowButton>
      </div>
    </GlassCard>
  )
}
