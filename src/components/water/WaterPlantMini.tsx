"use client"

import { useState, useEffect, useCallback } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Plant, getPlantState } from "./Plant"
import { getToday } from "@/lib/utils"
import { WaterAnimation } from "./WaterAnimation"

const TARGET = 8

export function WaterPlantMini() {
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

  async function handleTap() {
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

  if (loading) {
    return (
      <GlassCard hover={false} className="h-full text-center py-4">
        <div className="h-6 flex items-center justify-center mb-1">
          <span className="text-2xl leading-none">🌱</span>
        </div>
        <p className="text-lg font-semibold text-white/90">--</p>
        <p className="text-[10px] font-mono text-white/30 mt-0.5">Loading...</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard
      hover={false}
      className="h-full text-center py-5 cursor-pointer active:scale-95 transition-transform"
      onClick={handleTap}
    >
      <div className="relative flex items-center justify-center mb-0.5">
        <Plant state={state} size="lg" />
        <WaterAnimation active={animateWater} />
      </div>
      <p className="text-xl font-semibold text-white/90 mt-2">{glasses}/{TARGET} glasses</p>
      <p className="text-xs font-mono text-white/30 mt-1">Tap to water</p>
    </GlassCard>
  )
}
