"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap size={26} strokeWidth={1.75} style={{ stroke: "url(#icon-gradient)" }} />
        <h2 className="text-2xl font-light text-white/90">Tech News</h2>
      </div>

      {loading ? (
        <Loader label="Loading tech news..." />
      ) : !brief ? (
        <EmptyState message="No brief available" />
      ) : (
        <TechBriefPage brief={brief} />
      )}
    </motion.div>
  )
}
