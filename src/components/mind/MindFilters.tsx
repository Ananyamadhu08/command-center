"use client"

import { motion } from "framer-motion"
import { FileText, Highlighter, Image, Code2, Sparkles, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MindItemType } from "@/lib/types"

const TYPE_FILTERS: { type: MindItemType; icon: React.ElementType; label: string }[] = [
  { type: "article", icon: FileText, label: "Articles" },
  { type: "code", icon: Code2, label: "Code" },
  { type: "highlight", icon: Highlighter, label: "Highlights" },
  { type: "thought", icon: Sparkles, label: "Thoughts" },
  { type: "image", icon: Image, label: "Images" },
  { type: "screenshot", icon: Monitor, label: "Screenshots" },
]

interface MindFiltersProps {
  activeType: MindItemType | null
  onTypeChange: (type: MindItemType | null) => void
  activeTag: string | null
  onTagChange: (tag: string | null) => void
  tags: { tag: string; count: number }[]
  totalItems: number
}

export function MindFilters({
  activeType,
  onTypeChange,
  activeTag,
  onTagChange,
  tags,
  totalItems,
}: MindFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Type filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onTypeChange(null)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
            activeType === null
              ? "bg-white/10 text-white/80 border border-white/20"
              : "text-white/30 hover:text-white/50 hover:bg-white/5 border border-transparent",
          )}
        >
          All ({totalItems})
        </button>
        {TYPE_FILTERS.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onTypeChange(activeType === type ? null : type)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              activeType === type
                ? "bg-white/10 text-white/80 border border-white/20"
                : "text-white/30 hover:text-white/50 hover:bg-white/5 border border-transparent",
            )}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Tag cloud */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 20).map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => onTagChange(activeTag === tag ? null : tag)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200",
                activeTag === tag
                  ? "bg-purple-500/30 text-purple-200 border border-purple-400/40"
                  : "bg-purple-500/15 text-purple-300/80 border border-purple-400/20 hover:bg-purple-500/25 hover:text-purple-200",
              )}
            >
              {tag}
              <span className="ml-1 opacity-50">{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
