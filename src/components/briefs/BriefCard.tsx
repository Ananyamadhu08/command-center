"use client"

import Link from "next/link"
import { GlassCard } from "@/components/ui/GlassCard"
import type { Brief, BriefType } from "@/lib/types"

interface BriefCardProps {
  brief: Brief
}

const TYPE_CONFIG: Record<BriefType, { icon: string; color: string; glow: "cosmic" | "electric" | "amber" }> = {
  morning_briefing: { icon: "☀", color: "text-amber-light", glow: "amber" },
  tech_news: { icon: "⚡", color: "text-electric-light", glow: "electric" },
  evening_review: { icon: "🌙", color: "text-cosmic-light", glow: "cosmic" },
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
  const rawPreview = brief.content.startsWith("{") ? TYPE_LABELS[brief.type] + " — tap to view" : brief.content
  const preview = rawPreview.slice(0, 120) + (rawPreview.length > 120 ? "..." : "")

  return (
    <Link href={`/briefs/${brief.type}`} className="block">
      <GlassCard glow={config.glow}>
        <div className="flex items-start gap-3">
          <span className={`text-lg ${config.color}`}>{config.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                {TYPE_LABELS[brief.type]}
              </span>
              <span className="text-[10px] font-mono text-white/20">
                {TYPE_TIMES[brief.type]}
              </span>
            </div>
            <h3 className="text-sm font-medium text-white/90 mb-1.5 truncate">
              {brief.title}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed">{preview}</p>
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
    <GlassCard className="opacity-50">
      <div className="flex items-center gap-3">
        <span className={`text-lg ${config.color} opacity-40`}>{config.icon}</span>
        <div>
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
            {TYPE_LABELS[type]}
          </span>
          <p className="text-xs text-white/25 mt-0.5">
            Arrives at {TYPE_TIMES[type]}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
