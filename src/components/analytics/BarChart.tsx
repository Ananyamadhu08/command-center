"use client"

import { cn } from "@/lib/utils"

interface BarChartProps {
  data: { label: string; value: number }[]
  maxValue?: number
  color?: string
  unit?: string
}

export function BarChart({ data, maxValue, color = "bg-cosmic/60", unit = "" }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-1.5">
      {data.map((item) => {
        const pct = Math.round((item.value / max) * 100)
        return (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/30 w-8 text-right shrink-0">
              {item.label}
            </span>
            <div className="flex-1 h-4 bg-white/5 rounded-md overflow-hidden">
              <div
                className={cn("h-full rounded-md transition-all duration-500", color)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-white/40 w-10 shrink-0">
              {item.value > 0 ? `${item.value}${unit}` : "—"}
            </span>
          </div>
        )
      })}
    </div>
  )
}
