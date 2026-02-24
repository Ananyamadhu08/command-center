"use client"

import { useState, useEffect } from "react"
import { TechBriefPage } from "@/components/briefs/TechBriefPage"
import { fetchApi } from "@/lib/api"
import type { Brief } from "@/lib/types"
import { EmptyState } from "@/components/ui/EmptyState"
import { Loader } from "@/components/ui/Loader"

export function BriefsView() {
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApi<Brief[]>("/api/briefs?type=tech_news")
      .then((data) => {
        if (data && data.length > 0) setBrief(data[0])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loader label="Loading tech news..." />
  }

  if (!brief) {
    return <EmptyState message="No brief available" />
  }

  return <TechBriefPage brief={brief} />
}
