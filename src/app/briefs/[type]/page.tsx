"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MorningBriefPage } from "@/components/briefs/MorningBriefPage"
import { TechBriefPage } from "@/components/briefs/TechBriefPage"
import { EveningBriefPage } from "@/components/briefs/EveningBriefPage"
import type { Brief, BriefType } from "@/lib/types"

const VALID_TYPES: BriefType[] = ["morning_briefing", "tech_news", "evening_review"]

export default function BriefTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)

  const isValid = VALID_TYPES.includes(type as BriefType)

  useEffect(() => {
    if (!isValid) {
      setLoading(false)
      return
    }

    fetch(`/api/briefs?type=${type}`)
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data.length > 0) {
          setBrief(r.data[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type, isValid])

  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Brief type not found</p>
          <Link href="/" className="text-cosmic-light/60 hover:text-cosmic-light text-sm transition-colors">
            <ArrowLeft size={14} className="inline mr-1" /> Back to Command Center
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/20 text-sm font-mono animate-pulse">Loading brief...</div>
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">No brief available yet</p>
          <Link href="/" className="text-cosmic-light/60 hover:text-cosmic-light text-sm transition-colors">
            <ArrowLeft size={14} className="inline mr-1" /> Back to Command Center
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors mb-8"
      >
        <ArrowLeft size={14} className="inline mr-1" /> Command Center
      </Link>

      {type === "morning_briefing" && <MorningBriefPage brief={brief} />}
      {type === "tech_news" && <TechBriefPage brief={brief} />}
      {type === "evening_review" && <EveningBriefPage brief={brief} />}
    </div>
  )
}
