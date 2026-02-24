"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MorningBriefPage } from "@/components/briefs/MorningBriefPage"
import { TechBriefPage } from "@/components/briefs/TechBriefPage"
import { EveningBriefPage } from "@/components/briefs/EveningBriefPage"
import { fetchApi } from "@/lib/api"
import type { Brief, BriefType } from "@/lib/types"
import { EmptyState } from "@/components/ui/EmptyState"
import { Loader } from "@/components/ui/Loader"

const VALID_TYPES: BriefType[] = ["morning_briefing", "tech_news", "evening_review"]

const BRIEF_COMPONENTS: Record<BriefType, React.ComponentType<{ brief: Brief }>> = {
  morning_briefing: MorningBriefPage,
  tech_news: TechBriefPage,
  evening_review: EveningBriefPage,
}

function BackLink() {
  return (
    <Link
      href="/briefs"
      className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors mb-8"
    >
      <ArrowLeft size={14} className="inline mr-1" /> Briefs
    </Link>
  )
}

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

    fetchApi<Brief[]>(`/api/briefs?type=${encodeURIComponent(type)}`)
      .then((data) => {
        if (data && data.length > 0) setBrief(data[0])
      })
      .finally(() => setLoading(false))
  }, [type, isValid])

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <EmptyState message="Brief not found" />
        <Link href="/briefs" className="text-cosmic-light/60 hover:text-cosmic-light text-sm transition-colors">
          <ArrowLeft size={14} className="inline mr-1" /> Back to Briefs
        </Link>
      </div>
    )
  }

  if (loading) {
    return <Loader label="Loading brief..." />
  }

  if (!brief) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <EmptyState message="No brief available" />
        <Link href="/briefs" className="text-cosmic-light/60 hover:text-cosmic-light text-sm transition-colors">
          <ArrowLeft size={14} className="inline mr-1" /> Back to Briefs
        </Link>
      </div>
    )
  }

  const BriefComponent = BRIEF_COMPONENTS[type as BriefType]

  return (
    <div>
      <BackLink />
      <BriefComponent brief={brief} />
    </div>
  )
}
