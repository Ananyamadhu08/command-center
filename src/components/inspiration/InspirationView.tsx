"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Package, Palette, Sparkles } from "lucide-react"
import { InspirationCard } from "./InspirationCard"
import { InspirationDetail } from "./InspirationDetail"
import { SAMPLE_INSPIRATION } from "@/lib/inspiration-data"
import { staggerContainer, staggerItem } from "@/lib/animations"
import type { InspirationCategory, InspirationItem } from "@/lib/types"

type FilterTab = "all" | InspirationCategory | "build_this"

const FILTERS: { key: FilterTab; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Flame },
  { key: "product", label: "Products", icon: Package },
  { key: "ui_design", label: "UI & Design", icon: Palette },
  { key: "creative_tech", label: "Creative Tech", icon: Sparkles },
  { key: "build_this", label: "For You", icon: Flame },
]

export function InspirationView() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null)

  const items = SAMPLE_INSPIRATION

  const filtered = useMemo(() => {
    if (activeFilter === "all") return items
    if (activeFilter === "build_this") return items.filter((i) => i.build_this)
    return items.filter((i) => i.category === activeFilter)
  }, [items, activeFilter])

  const counts = useMemo(() => {
    const result: Record<FilterTab, number> = {
      all: items.length,
      product: 0,
      ui_design: 0,
      creative_tech: 0,
      build_this: 0,
    }
    for (const item of items) {
      result[item.category]++
      if (item.build_this) result.build_this++
    }
    return result
  }, [items])

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-3">
          <Flame
            size={26}
            strokeWidth={1.75}
            style={{ stroke: "url(#icon-gradient)" }}
          />
          <h2 className="text-2xl font-light text-white/90">Inspiration</h2>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={staggerItem}>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label, icon: TabIcon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={
                "text-[11px] px-3.5 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 font-medium " +
                (activeFilter === key
                  ? "border-white/20 bg-white/10 text-white/90 shadow-[inset_0_0_12px_rgba(139,92,246,0.08)]"
                  : "border-white/[0.08] text-white/35 hover:border-white/15 hover:text-white/55 hover:bg-white/[0.03]")
              }
            >
              <TabIcon size={12} />
              {label}
              <span className="text-[9px] font-mono opacity-60">
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div variants={staggerItem}>
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <InspirationCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-white/30">No inspiration found for this filter</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <InspirationDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </motion.div>
  )
}
