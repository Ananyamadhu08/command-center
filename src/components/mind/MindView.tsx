"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain } from "lucide-react"
import { MindSearch } from "./MindSearch"
import { MindSaveForm } from "./MindSaveForm"
import { MindFilters } from "./MindFilters"
import { MindGrid } from "./MindGrid"
import { MindGraph } from "./MindGraph"
import { MindItemDetail } from "./MindItemDetail"
import { useMindItems, useMindTags, useMindSave, useMindAllItems } from "@/hooks/use-mind"
import { staggerContainer, staggerItem } from "@/lib/animations"
import type { MindItem, MindItemType } from "@/lib/types"
import type { ViewMode } from "./MindFilters"

export function MindView() {
  const [typeFilter, setTypeFilter] = useState<MindItemType | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MindItem | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const { items, loading, total, refetch } = useMindItems(typeFilter, tagFilter)
  const { items: allItems, loading: allLoading } = useMindAllItems(viewMode === "graph")
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
        <div className="flex items-center gap-3">
          <Brain
            size={26}
            strokeWidth={1.75}
            style={{ stroke: "url(#icon-gradient)" }}
          />
          <h1 className="text-2xl font-light text-white/90">The Mind</h1>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={staggerItem} className="space-y-3">
        <p className="text-[12px] font-mono text-white/25 text-center mb-4">
          Save everything. Organize nothing. Find anything.
        </p>

        <MindSearch onItemClick={setSelectedItem} />
      </motion.div>

      {/* Save form — hidden in graph mode */}
      {viewMode === "list" && (
        <motion.div variants={staggerItem}>
          <MindSaveForm onSave={save} saving={saving} error={saveError} />
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={staggerItem}>
        <MindFilters
          activeType={typeFilter}
          onTypeChange={setTypeFilter}
          activeTag={tagFilter}
          onTagChange={setTagFilter}
          tags={tags}
          totalItems={total}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </motion.div>

      {/* Content: Grid or Graph */}
      <motion.div variants={staggerItem}>
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MindGrid
                items={items}
                loading={loading}
                onItemClick={setSelectedItem}
              />
            </motion.div>
          ) : (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MindGraph
                items={allItems}
                loading={allLoading}
                onItemClick={setSelectedItem}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
