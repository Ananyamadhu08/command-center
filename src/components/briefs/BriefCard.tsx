"use client"

import Link from "next/link"
import { Sun, Zap, Moon } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import type { Brief, BriefType } from "@/lib/types"

interface BriefCardProps {
  brief: Brief
}

const TYPE_CONFIG: Record<BriefType, { icon: React.ReactNode; color: string; glow: "cosmic" | "electric" | "amber" }> = {
  morning_briefing: { icon: <Sun size={18} />, color: "text-cosmic-light", glow: "cosmic" },
  tech_news: { icon: <Zap size={18} />, color: "text-cosmic-light", glow: "cosmic" },
  evening_review: { icon: <Moon size={18} />, color: "text-cosmic-light", glow: "cosmic" },
}

const TYPE_LABELS: Record<BriefType, string> = {
  morning_briefing: "Morning Briefing",
  tech_news: "Tech News",
  evening_review: "Evening Review",
}

const TYPE_TIMES: Record<BriefType, string> = {
  morning_briefing: "6:45 AM",
  tech_news: "9:00 AM",
  evening_review: "8:00 PM",
}

export function BriefCard({ brief }: BriefCardProps) {
  const config = TYPE_CONFIG[brief.type]
  const rawPreview = brief.content.startsWith("{") ? TYPE_LABELS[brief.type] + " \u2014 tap to view" : brief.content
  const preview = rawPreview.slice(0, 80) + (rawPreview.length > 80 ? "..." : "")

  return (
    <Link href={`/briefs/${brief.type}`} className="block h-full">
      <GlassCard glow={config.glow} className="h-full">
        <div className="flex items-start gap-3">
          <span className={`${config.color}`}>{config.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                {TYPE_LABELS[brief.type]}
              </span>
              <span className="text-[10px] font-mono text-white/20">
                {TYPE_TIMES[brief.type]}
              </span>
            </div>
            <h3 className="text-base font-medium text-white/90 mb-2 truncate">
              {brief.title}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{preview}</p>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

interface PendingBriefCardProps {
  type: BriefType
}

export function PendingBriefCard({ type }: PendingBriefCardProps) {
  const config = TYPE_CONFIG[type]

  return (
    <GlassCard className="h-full opacity-50">
      <div className="flex items-start gap-3">
        <span className={`${config.color} opacity-40`}>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
              {TYPE_LABELS[type]}
            </span>
            <span className="text-[10px] font-mono text-white/20">
              {TYPE_TIMES[type]}
            </span>
          </div>
          <h3 className="text-base font-medium text-white/40 mb-2">
            Pending
          </h3>
          <p className="text-xs text-white/25 leading-relaxed line-clamp-2">
            Arrives at {TYPE_TIMES[type]}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
