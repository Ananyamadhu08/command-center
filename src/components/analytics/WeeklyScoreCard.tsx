"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "@/components/ui/GlassCard"

interface WeeklyScoreCardProps {
  score: number
  dateRange: string
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981"
  if (score >= 60) return "#3b82f6"
  if (score >= 40) return "#f59e0b"
  return "#ef4444"
}

export function WeeklyScoreCard({ score, dateRange }: WeeklyScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 800

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const color = getScoreColor(score)

  return (
    <GlassCard glow="cosmic">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white/70">Weekly Report</h2>
          <p className="text-[10px] font-mono text-white/25 mt-0.5">{dateRange}</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold tabular-nums leading-none" style={{ color }}>
            {displayScore}
          </p>
          <p className="text-[10px] font-mono text-white/20 mt-1">out of 100</p>
        </div>
      </div>
      <div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </GlassCard>
  )
}
