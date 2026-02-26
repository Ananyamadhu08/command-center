"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Highlighter,
  Image as ImageIcon,
  Code2,
  Sparkles,
  Monitor,
  Globe,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import type { MindItem, MindItemType } from "@/lib/types"

/* ── Type icons ── */

const TYPE_ICONS: Record<MindItemType, React.ElementType> = {
  article: FileText,
  highlight: Highlighter,
  image: ImageIcon,
  code: Code2,
  thought: Sparkles,
  screenshot: Monitor,
}

/* ── Per-type accent color ── */

const TYPE_ACCENT: Record<
  MindItemType,
  { color: string; bg: string; border: string; glow: string }
> = {
  article: {
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  code: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]",
  },
  highlight: {
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  },
  thought: {
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    border: "border-pink-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
  },
  image: {
    color: "text-teal-400",
    bg: "bg-teal-500/15",
    border: "border-teal-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]",
  },
  screenshot: {
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
  },
}

/* ── Hero visual per type ── */

function ArticleHero(_props: { item: MindItem }) {
  return (
    <img
      src="/mind/article-default.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    />
  )
}

function CodeHero(_props: { item: MindItem }) {
  return (
    <img
      src="/mind/code-default.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    />
  )
}

function HighlightHero(_props: { item: MindItem }) {
  return (
    <img
      src="/mind/highlight-default.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    />
  )
}

function ThoughtHero(_props: { item: MindItem }) {
  return (
    <img
      src="/mind/thought-default.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    />
  )
}

function ImageHero({ item }: { item: MindItem }) {
  return (
    <img
      src={item.image_url || "/mind/image-default.png"}
      alt={item.title ?? "Saved"}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    />
  )
}

function ScreenshotHero({ item }: { item: MindItem }) {
  return (
    <img
      src={item.image_url || "/mind/screenshot-default.png"}
      alt={item.title ?? "Saved"}
      className="absolute inset-0 w-full h-full object-cover object-[center_30%] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    />
  )
}

const HERO_RENDERERS: Record<MindItemType, React.FC<{ item: MindItem }>> = {
  article: ArticleHero,
  code: CodeHero,
  highlight: HighlightHero,
  thought: ThoughtHero,
  image: ImageHero,
  screenshot: ScreenshotHero,
}

/* ── HUD Corner Brackets ── */

function HudCorners({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500", className)}>
      {/* Top-left */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/30" />
      {/* Top-right */}
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/30" />
      {/* Bottom-left */}
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/30" />
      {/* Bottom-right */}
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/30" />
    </div>
  )
}

/* ── Card Component ── */

interface MindItemCardProps {
  item: MindItem
  onClick?: () => void
  index?: number
}

export function MindItemCard({ item, onClick, index = 0 }: MindItemCardProps) {
  const Icon = TYPE_ICONS[item.type]
  const accent = TYPE_ACCENT[item.type]
  const HeroContent = HERO_RENDERERS[item.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer",
        "bg-space-900/90 backdrop-blur-sm",
        "border border-white/[0.08]",
        "rounded-xl overflow-hidden",
        "transition-all duration-400",
        "flex flex-col",
        accent.glow,
        "hover:border-white/[0.18] hover:translate-y-[-2px]",
      )}
    >
      {/* HUD targeting corners on hover */}
      <HudCorners />

      {/* ── Hero Image ── */}
      <div className="relative h-[155px] overflow-hidden shrink-0">
        <HeroContent item={item} />

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-space-900/95 to-transparent" />

        {/* Type badge — top right */}
        <div
          className={cn(
            "absolute top-2.5 right-3 z-20",
            "flex items-center gap-1.5",
            "px-2 py-[3px] rounded-lg",
            "text-[9px] font-semibold uppercase tracking-[0.15em]",
            "border backdrop-blur-sm",
            accent.bg,
            accent.border,
            "text-white/90",
            "shadow-lg",
          )}
        >
          <Icon size={9} />
          {item.type}
        </div>
      </div>

      {/* ── Content Body ── */}
      <div className="flex-1 flex flex-col px-3.5 pt-2 pb-3 min-h-0">
        {/* Title or content */}
        {item.title ? (
          <h3 className="text-[13px] font-semibold text-white/85 leading-tight line-clamp-2 group-hover:text-white transition-colors duration-300">
            {item.title}
          </h3>
        ) : item.content ? (
          <p className="text-[12px] text-white/50 leading-snug line-clamp-2 italic">
            {item.content}
          </p>
        ) : null}

        {/* Summary for articles */}
        {item.type === "article" && item.summary && (
          <p className="text-[10.5px] text-white/30 leading-relaxed line-clamp-2 mt-1.5">
            {item.summary}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-[9px] font-mono px-1.5 py-0.5 rounded",
                  "bg-white/[0.05] border border-white/[0.08]",
                  "text-white/45",
                )}
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[9px] font-mono text-white/30 self-center">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer Bar ── */}
        <div className="mt-auto flex items-center gap-2 pt-2.5">
          {/* Accent dot */}
          <div className={cn("w-1 h-1 rounded-full shrink-0", accent.color.replace("text-", "bg-"))} />

          {item.source_domain ? (
            <span className="text-[9px] font-mono text-white/35 truncate min-w-0">
              {item.source_domain}
            </span>
          ) : (
            <span className="text-[9px] font-mono text-white/20 truncate">
              local
            </span>
          )}

          {/* Spacer dot */}
          <span className="text-white/15 text-[8px]">/</span>

          <span className="text-[9px] font-mono text-white/30 shrink-0">
            {formatRelativeTime(item.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
