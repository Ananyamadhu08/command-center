"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BriefCard, PendingBriefCard } from "@/components/briefs/BriefCard"
import { BriefDetail } from "@/components/briefs/BriefDetail"
import { getToday } from "@/lib/utils"
import type { Brief, BriefType } from "@/lib/types"

const BRIEF_TYPES: BriefType[] = ["morning_briefing", "tech_news", "evening_review"]

export function BriefsView() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null)
  const [filter, setFilter] = useState<BriefType | "all">("all")

  const today = getToday()

  useEffect(() => {
    fetch("/api/briefs")
      .then((r) => r.json())
      .then((r) => { if (r.success) setBriefs(r.data) })
      .catch(() => {})
  }, [])

  const filtered = filter === "all" ? briefs : briefs.filter((b) => b.type === filter)
  const todayBriefTypes = new Set(briefs.filter((b) => b.date === today).map((b) => b.type))
  const pendingTypes = BRIEF_TYPES.filter((t) => !todayBriefTypes.has(t))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white/80">Briefs</h2>
        <div className="flex gap-1.5">
          {(["all", ...BRIEF_TYPES] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-[10px] px-3 py-1 rounded-lg border transition-all ${
                filter === type
                  ? "border-cosmic/40 bg-cosmic/15 text-cosmic-light"
                  : "border-white/10 text-white/40 hover:border-white/20"
              }`}
            >
              {type === "all" ? "All" : type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {pendingTypes.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-white/20 uppercase tracking-wider mb-2">Pending</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pendingTypes.map((type) => (
              <PendingBriefCard key={type} type={type} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((brief) => (
          <BriefCard key={brief.id} brief={brief} onClick={() => setSelectedBrief(brief)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-white/20">No briefs yet. They&apos;ll arrive on schedule.</p>
        </div>
      )}

      <BriefDetail brief={selectedBrief} onClose={() => setSelectedBrief(null)} />
    </motion.div>
  )
}
