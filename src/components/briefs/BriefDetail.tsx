"use client"

import { Modal } from "@/components/ui/Modal"
import type { Brief, BriefType } from "@/lib/types"

interface BriefDetailProps {
  brief: Brief | null
  onClose: () => void
}

const TYPE_LABELS: Record<BriefType, string> = {
  morning_briefing: "Morning Briefing",
  tech_news: "Tech News",
  evening_review: "Evening Review",
}

export function BriefDetail({ brief, onClose }: BriefDetailProps) {
  if (!brief) return null

  return (
    <Modal isOpen={!!brief} onClose={onClose} title={brief.title}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-cosmic-light/70 uppercase tracking-wider">
            {TYPE_LABELS[brief.type]}
          </span>
          <span className="text-[10px] text-white/20">|</span>
          <span className="text-[10px] font-mono text-white/30">
            {new Date(brief.created_at).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
          {brief.content}
        </div>
      </div>
    </Modal>
  )
}
