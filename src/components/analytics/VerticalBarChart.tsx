"use client"

import { motion } from "framer-motion"

interface BarData {
  label: string
  value: number
  date: string
}

interface VerticalBarChartProps {
  data: BarData[]
  color: string
  colorLight: string
  unit?: string
  height?: number
}

export function VerticalBarChart({
  data,
  color,
  colorLight,
  unit = "",
  height = 180,
}: VerticalBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-1">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((item, i) => {
          const pct = (item.value / maxValue) * 100
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              {item.value > 0 && (
                <span className="text-[9px] font-mono tabular-nums" style={{ color: colorLight }}>
                  {item.value}{unit}
                </span>
              )}
              <motion.div
                className="w-full rounded-t-md"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}33`,
                  originY: 1,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: "easeOut" }}
              >
                <div
                  style={{ height: `${Math.max(pct * (height - 30) / 100, item.value > 0 ? 4 : 0)}px` }}
                />
              </motion.div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-1.5">
        {data.map((item, i) => (
          <div key={item.date} className="flex-1 text-center">
            {i % 2 === 0 ? (
              <span className="text-[9px] font-mono text-white/25">{item.label}</span>
            ) : (
              <span className="text-[9px]">&nbsp;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
