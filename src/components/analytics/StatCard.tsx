"use client"

import { GlassCard } from "@/components/ui/GlassCard"

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  glow?: "cosmic" | "electric" | "amber" | "none"
}

const TREND_ICONS: Record<string, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
}

const TREND_COLORS: Record<string, string> = {
  up: "text-emerald-400",
  down: "text-red-400",
  neutral: "text-white/30",
}

export function StatCard({ label, value, subtitle, trend, glow = "none" }: StatCardProps) {
  return (
    <GlassCard glow={glow}>
      <div className="text-center space-y-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
        <div className="flex items-center justify-center gap-1.5">
          <p className="text-2xl font-semibold text-white/90">{value}</p>
          {trend && (
            <span className={`text-sm ${TREND_COLORS[trend]}`}>{TREND_ICONS[trend]}</span>
          )}
        </div>
        {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
      </div>
    </GlassCard>
  )
}
