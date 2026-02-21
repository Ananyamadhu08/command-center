"use client"

import { useState, useEffect } from "react"
import { formatDate, getGreeting } from "@/lib/utils"

export function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const greeting = getGreeting()
  const dateStr = formatDate(now)
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-light text-white/90 tracking-tight">
          {greeting},{" "}
          <span className="font-semibold bg-gradient-to-r from-cosmic-light to-electric-light bg-clip-text text-transparent">
            Ananya
          </span>
        </h1>
        <p className="text-sm text-white/30 mt-1 font-mono">{dateStr}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-light text-white/60 font-mono tabular-nums">{timeStr}</p>
      </div>
    </header>
  )
}
