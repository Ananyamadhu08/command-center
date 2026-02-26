"use client"

import { motion } from "framer-motion"
import { Sun, CloudSun, ChevronRight, Circle } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import type { Brief } from "@/lib/types"

interface MorningBriefPageProps {
  brief: Brief
}

function parseSection(content: string, header: string): string[] {
  const regex = new RegExp(`${header}:\\n([\\s\\S]*?)(?=\\n\\n|$)`)
  const match = content.match(regex)
  if (!match) return []
  return match[1]
    .split("\n")
    .map((l) => l.replace(/^- /, "").trim())
    .filter(Boolean)
}

function extractQuote(content: string): string | null {
  const match = content.match(/Quote of the day: (.+)/)
  return match ? match[1] : null
}

function extractWeather(content: string): string | null {
  const match = content.match(/Weather: (.+)/)
  return match ? match[1] : null
}

export function MorningBriefPage({ brief }: MorningBriefPageProps) {
  const weather = extractWeather(brief.content)
  const focuses = parseSection(brief.content, "Today's Focus")
  const reminders = parseSection(brief.content, "Reminders")
  const quote = extractQuote(brief.content)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-3">
        <Sun size={26} strokeWidth={1.75} style={{ stroke: "url(#icon-gradient)" }} />
        <div>
          <h1 className="text-2xl font-light text-white/90">{brief.title}</h1>
          <p className="text-xs font-mono text-white/30">
            {new Date(brief.created_at).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {weather && (
        <GlassCard glow="cosmic">
          <div className="flex items-center gap-3">
            <CloudSun size={18} className="text-electric-light" />
            <div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Weather</p>
              <p className="text-sm text-white/80">{weather}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {focuses.length > 0 && (
        <GlassCard glow="cosmic">
          <h3 className="text-xs font-mono text-electric-light/60 uppercase tracking-wider mb-3">
            Today&apos;s Focus
          </h3>
          <ul className="space-y-2">
            {focuses.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <ChevronRight size={12} className="text-electric-light/50 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {reminders.length > 0 && (
        <GlassCard glow="cosmic">
          <h3 className="text-xs font-mono text-cosmic-light/60 uppercase tracking-wider mb-3">
            Reminders
          </h3>
          <ul className="space-y-2">
            {reminders.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <Circle size={8} className="text-cosmic-light/50 mt-1 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {quote && (
        <GlassCard className="text-center py-8">
          <p className="text-sm text-white/50 italic leading-relaxed">{quote}</p>
        </GlassCard>
      )}
    </motion.div>
  )
}
