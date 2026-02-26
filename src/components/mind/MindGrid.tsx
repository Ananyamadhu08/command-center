"use client"

import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { MindItemCard } from "./MindItemCard"
import type { MindItem } from "@/lib/types"

interface MindGridProps {
  items: MindItem[]
  loading: boolean
  onItemClick?: (item: MindItem) => void
}

export function MindGrid({ items, loading, onItemClick }: MindGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[320px] rounded-2xl border border-white/[0.04] bg-white/[0.015] animate-pulse overflow-hidden"
          >
            {/* Hero skeleton */}
            <div className="h-[190px] bg-white/[0.02]" />
            {/* Info skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-3.5 w-3/4 bg-white/[0.04] rounded" />
              <div className="h-2.5 w-1/2 bg-white/[0.03] rounded" />
              <div className="flex gap-1.5 mt-6">
                <div className="h-4 w-12 bg-white/[0.03] rounded" />
                <div className="h-4 w-10 bg-white/[0.03] rounded" />
                <div className="h-4 w-14 bg-white/[0.03] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
          <Brain size={28} className="text-white/15" />
        </div>
        <p className="text-sm text-white/30 mb-1">Your mind is empty</p>
        <p className="text-xs text-white/15">Save a URL, jot down a thought, or paste some code to get started</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <MindItemCard
          key={item.id}
          item={item}
          index={i}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </div>
  )
}
