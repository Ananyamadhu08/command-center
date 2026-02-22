"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  glow?: "cosmic" | "electric" | "amber" | "none"
}

const TREND_CONFIG: Record<string, { icon: typeof TrendingUp; className: string }> = {
  up: { icon: TrendingUp, className: "text-emerald-400" },
  down: { icon: TrendingDown, className: "text-red-400" },
  neutral: { icon: Minus, className: "text-white/30" },
}

export function StatCard({ label, value, subtitle, trend, glow = "none" }: StatCardProps) {
  return (
    <GlassCard glow={glow}>
      <div className="text-center space-y-1">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
        <div className="flex items-center justify-center gap-1.5">
          <p className="text-2xl font-semibold text-white/90">{value}</p>
          {trend && (() => {
            const cfg = TREND_CONFIG[trend]
            const Icon = cfg.icon
            return <Icon size={14} className={cfg.className} />
          })()}
        </div>
        {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
      </div>
    </GlassCard>
  )
}
