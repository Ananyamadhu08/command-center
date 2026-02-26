"use client"

import { motion } from "framer-motion"
import { FileText, Highlighter, Image, Code2, Sparkles, Monitor, ExternalLink, Globe } from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import type { MindItem, MindItemType } from "@/lib/types"

const TYPE_ICONS: Record<MindItemType, React.ElementType> = {
  article: FileText,
  highlight: Highlighter,
  image: Image,
  code: Code2,
  thought: Sparkles,
  screenshot: Monitor,
}

const TYPE_ACCENTS: Record<MindItemType, { border: string; glow: string; badge: string; icon: string }> = {
  article: {
    border: "border-electric/20 hover:border-electric/40",
    glow: "hover:shadow-[0_0_24px_rgba(59,130,246,0.08)]",
    badge: "bg-electric/15 text-electric-light",
    icon: "text-electric-light/70",
  },
  highlight: {
    border: "border-amber/20 hover:border-amber/40",
    glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.08)]",
    badge: "bg-amber/15 text-amber-light",
    icon: "text-amber-light/70",
  },
  image: {
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glow: "hover:shadow-[0_0_24px_rgba(52,211,153,0.08)]",
    badge: "bg-emerald-500/15 text-emerald-300",
    icon: "text-emerald-300/70",
  },
  code: {
    border: "border-cosmic/20 hover:border-cosmic/40",
    glow: "hover:shadow-[0_0_24px_rgba(139,92,246,0.08)]",
    badge: "bg-cosmic/15 text-cosmic-light",
    icon: "text-cosmic-light/70",
  },
  thought: {
    border: "border-pink-500/20 hover:border-pink-500/40",
    glow: "hover:shadow-[0_0_24px_rgba(236,72,153,0.08)]",
    badge: "bg-pink-500/15 text-pink-300",
    icon: "text-pink-300/70",
  },
  screenshot: {
    border: "border-white/10 hover:border-white/25",
    glow: "hover:shadow-[0_0_24px_rgba(255,255,255,0.04)]",
    badge: "bg-white/10 text-white/50",
    icon: "text-white/40",
  },
}

interface MindItemCardProps {
  item: MindItem
  onClick?: () => void
  index?: number
}

export function MindItemCard({ item, onClick, index = 0 }: MindItemCardProps) {
  const Icon = TYPE_ICONS[item.type]
  const accent = TYPE_ACCENTS[item.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl border p-4 cursor-pointer",
        "bg-white/[0.02] backdrop-blur-sm",
        "transition-all duration-300",
        "h-[280px] flex flex-col overflow-hidden",
        accent.border,
        accent.glow,
        "hover:bg-white/[0.04] hover:translate-y-[-1px]",
      )}
    >
      {/* Type badge + time */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider", accent.badge)}>
          <Icon size={10} />
          {item.type}
        </div>
        <span className="text-[10px] text-white/20 font-mono">
          {formatRelativeTime(item.created_at)}
        </span>
      </div>

      {/* Title */}
      {item.title && (
        <h3 className="text-sm font-semibold text-white/85 leading-snug mb-2 line-clamp-2 group-hover:text-white/95 transition-colors">
          {item.title}
        </h3>
      )}

      {/* Content preview — different per type */}
      <div className="flex-1 min-h-0 overflow-hidden mb-2">
        {item.type === "code" && item.content && (
          <div className="rounded-lg bg-black/30 border border-white/5 p-3 overflow-hidden h-full">
            <pre className="text-[11px] font-mono text-white/50 leading-relaxed whitespace-pre-wrap line-clamp-6">
              {item.content}
            </pre>
            {item.language && (
              <span className="inline-block mt-2 text-[9px] font-mono text-cosmic-light/50 bg-cosmic/10 px-1.5 py-0.5 rounded">
                {item.language}
              </span>
            )}
          </div>
        )}

        {item.type === "highlight" && item.content && (
          <div className="relative pl-3 border-l-2 border-amber/30">
            <p className="text-sm text-white/55 leading-relaxed italic line-clamp-5">
              &ldquo;{item.content}&rdquo;
            </p>
          </div>
        )}

        {item.type === "thought" && item.content && (
          <p className="text-sm text-white/55 leading-relaxed line-clamp-6">
            {item.content}
          </p>
        )}

        {item.type === "article" && item.summary && (
          <p className="text-xs text-white/40 leading-relaxed line-clamp-5">
            {item.summary}
          </p>
        )}

        {item.type === "image" && item.image_url && (
          <div className="rounded-lg overflow-hidden bg-white/5 h-full">
            <img
              src={item.image_url}
              alt={item.title ?? "Saved image"}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}
      </div>

      {/* Tags + source pinned to bottom */}
      <div className="mt-auto shrink-0">
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-white/25 bg-white/5 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] font-mono text-white/15">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {item.source_domain && (
          <div className="flex items-center gap-1 text-[10px] text-white/20">
            <Globe size={9} />
            <span className="truncate">{item.source_domain}</span>
            {item.url && (
              <ExternalLink size={8} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
