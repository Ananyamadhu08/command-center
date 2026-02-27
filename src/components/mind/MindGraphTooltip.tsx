"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, Highlighter, Image, Code2, Sparkles, Monitor } from "lucide-react"
import { MIND_TYPE_CONFIG } from "@/lib/types"
import type { MindItem, MindItemType } from "@/lib/types"

const TYPE_ICONS: Record<MindItemType, React.ElementType> = {
  article: FileText,
  highlight: Highlighter,
  image: Image,
  code: Code2,
  thought: Sparkles,
  screenshot: Monitor,
}

interface MindGraphTooltipProps {
  item: MindItem | null
  x: number
  y: number
}

const TOOLTIP_WIDTH = 220
const TOOLTIP_OFFSET = 14

export function MindGraphTooltip({ item, x, y }: MindGraphTooltipProps) {
  const safeX = typeof window !== "undefined" && x + TOOLTIP_OFFSET + TOOLTIP_WIDTH > window.innerWidth
    ? x - TOOLTIP_WIDTH - TOOLTIP_OFFSET
    : x + TOOLTIP_OFFSET
  const safeY = typeof window !== "undefined" && y - 10 < 0
    ? y + 20
    : y - 10

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed z-50 max-w-[220px] px-3 py-2.5 rounded-xl border border-white/10"
          style={{
            left: safeX,
            top: safeY,
            background: "rgba(10, 10, 20, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            {(() => {
              const Icon = TYPE_ICONS[item.type]
              return (
                <Icon
                  size={10}
                  style={{ color: MIND_TYPE_CONFIG[item.type].color }}
                />
              )
            })()}
            <span
              className="text-[9px] font-semibold uppercase tracking-wider"
              style={{ color: MIND_TYPE_CONFIG[item.type].color }}
            >
              {item.type}
            </span>
          </div>
          <p className="text-[11px] text-white/80 font-medium leading-snug line-clamp-2">
            {item.title ?? item.content?.slice(0, 60) ?? "Untitled"}
          </p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] font-mono text-white/25 bg-white/5 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
