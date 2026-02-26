"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { MindSearch } from "./MindSearch"
import { MindSaveForm } from "./MindSaveForm"
import { MindFilters } from "./MindFilters"
import { MindGrid } from "./MindGrid"
import { MindItemDetail } from "./MindItemDetail"
import { useMindItems, useMindTags, useMindSave } from "@/hooks/use-mind"
import { staggerContainer, staggerItem } from "@/lib/animations"
import type { MindItem, MindItemType } from "@/lib/types"

export function MindView() {
  const [typeFilter, setTypeFilter] = useState<MindItemType | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MindItem | null>(null)

  const { items, loading, total, refetch } = useMindItems(typeFilter, tagFilter)
  const tags = useMindTags()

  const handleSaved = useCallback(() => {
    refetch()
  }, [refetch])

  const { save, saving, error: saveError } = useMindSave(handleSaved)

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/mind/items?id=${id}`, { method: "DELETE" })
      if (res.ok) refetch()
    } catch {
      // Silent fail
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cosmic/30 to-electric/30 border border-cosmic/20 flex items-center justify-center">
            <Brain size={16} className="text-cosmic-light/80" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white/90">The Mind</h1>
            <p className="text-[10px] font-mono text-white/25 mt-0.5">
              Save everything. Organize nothing. Find anything.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={staggerItem}>
        <MindSearch onItemClick={setSelectedItem} />
      </motion.div>

      {/* Save form */}
      <motion.div variants={staggerItem}>
        <MindSaveForm onSave={save} saving={saving} error={saveError} />
      </motion.div>

      {/* Filters */}
      <motion.div variants={staggerItem}>
        <MindFilters
          activeType={typeFilter}
          onTypeChange={setTypeFilter}
          activeTag={tagFilter}
          onTagChange={setTagFilter}
          tags={tags}
          totalItems={total}
        />
      </motion.div>

      {/* Grid */}
      <motion.div variants={staggerItem}>
        <MindGrid
          items={items}
          loading={loading}
          onItemClick={setSelectedItem}
        />
      </motion.div>

      {/* Detail modal */}
      <MindItemDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDelete}
      />
    </motion.div>
  )
}
