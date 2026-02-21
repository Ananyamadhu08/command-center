"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TechBriefPage } from "@/components/briefs/TechBriefPage"
import type { Brief } from "@/lib/types"

export function BriefsView() {
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/briefs?type=tech_news")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data.length > 0) {
          setBrief(r.data[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
        <p className="text-white/20 text-sm font-mono animate-pulse">Loading tech news...</p>
      </motion.div>
    )
  }

  if (!brief) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <p className="text-sm text-white/20">No tech news brief available yet.</p>
      </motion.div>
    )
  }

  return <TechBriefPage brief={brief} />
}
