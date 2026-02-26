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

/* ── Per-type visual theme ── */

const TYPE_THEME: Record<
  MindItemType,
  { hero: string; badge: string; glow: string }
> = {
  article: {
    hero: "from-[#0c1445] via-[#14105a] to-[#0d2847]",
    badge: "bg-electric/20 text-electric-light/80 border-electric/20",
    glow: "hover:shadow-[0_8px_48px_rgba(59,130,246,0.12)]",
  },
  code: {
    hero: "from-[#060e06] via-[#0a160a] to-[#040d08]",
    badge: "bg-emerald-500/20 text-emerald-300/80 border-emerald-500/20",
    glow: "hover:shadow-[0_8px_48px_rgba(52,211,153,0.10)]",
  },
  highlight: {
    hero: "from-[#2d1a00] via-[#3a2400] to-[#1f1500]",
    badge: "bg-amber/20 text-amber-light/80 border-amber/20",
    glow: "hover:shadow-[0_8px_48px_rgba(245,158,11,0.12)]",
  },
  thought: {
    hero: "from-[#1a0a2e] via-[#2a1042] to-[#150825]",
    badge: "bg-pink-500/20 text-pink-300/80 border-pink-500/20",
    glow: "hover:shadow-[0_8px_48px_rgba(236,72,153,0.10)]",
  },
  image: {
    hero: "from-[#0a1a15] via-[#0f2520] to-[#051510]",
    badge: "bg-teal-500/20 text-teal-300/80 border-teal-500/20",
    glow: "hover:shadow-[0_8px_48px_rgba(20,184,166,0.10)]",
  },
  screenshot: {
    hero: "from-[#0f0f15] via-[#141420] to-[#0a0a12]",
    badge: "bg-white/10 text-white/50 border-white/10",
    glow: "hover:shadow-[0_8px_48px_rgba(255,255,255,0.04)]",
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

function CodeHero({ item }: { item: MindItem }) {
  const preview = item.content?.split("\n").slice(0, 12).join("\n") ?? ""

  return (
    <>
      {/* Code as texture */}
      <div className="absolute inset-0 p-4 overflow-hidden">
        <pre className="text-[10px] font-mono leading-[1.7] text-emerald-400/[0.14] whitespace-pre select-none">
          {preview}
        </pre>
      </div>
      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(52,211,153,0.3) 3px, rgba(52,211,153,0.3) 4px)",
        }}
      />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-28 bg-emerald-500/[0.03] blur-[60px] rounded-full" />
      {/* Language chip */}
      {item.language && (
        <div className="absolute top-3 left-3 text-[8px] font-mono tracking-[0.2em] uppercase text-emerald-400/40 bg-emerald-500/[0.08] border border-emerald-500/10 px-2 py-0.5 rounded-md">
          {item.language}
        </div>
      )}
    </>
  )
}

function HighlightHero({ item }: { item: MindItem }) {
  return (
    <>
      {/* Decorative quote mark */}
      <div
        className="absolute top-1 left-4 text-[120px] leading-none text-amber/[0.07] select-none"
        style={{ fontFamily: "Georgia, serif" }}
      >
        &ldquo;
      </div>
      {/* Quote text as visual */}
      <div className="absolute inset-0 flex items-center px-8 pt-6">
        <p
          className="text-[14px] text-white/[0.25] leading-[1.8] italic line-clamp-4 select-none"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {item.content}
        </p>
      </div>
      {/* Warm glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-60 h-32 bg-amber/[0.05] blur-[60px] rounded-full" />
    </>
  )
}

function ThoughtHero({ item }: { item: MindItem }) {
  return (
    <>
      {/* Nebula orbs */}
      <div className="absolute top-6 right-8 w-32 h-32 rounded-full bg-pink-500/[0.07] blur-[45px]" />
      <div className="absolute bottom-4 left-6 w-28 h-28 rounded-full bg-cosmic/[0.07] blur-[45px]" />
      {/* Star particles */}
      <div className="absolute top-10 left-14 w-1 h-1 rounded-full bg-white/[0.08]" />
      <div className="absolute top-[72px] right-[72px] w-1.5 h-1.5 rounded-full bg-pink-300/[0.12]" />
      <div className="absolute bottom-14 left-[33%] w-1 h-1 rounded-full bg-cosmic-light/[0.1]" />
      <div className="absolute top-16 left-[55%] w-0.5 h-0.5 rounded-full bg-white/[0.15]" />
      {/* Thought preview */}
      <div className="absolute inset-0 flex items-center px-7">
        <p className="text-[13px] text-white/[0.15] leading-[1.8] line-clamp-4 select-none">
          {item.content}
        </p>
      </div>
    </>
  )
}

function VisualHero({ item }: { item: MindItem }) {
  if (item.image_url) {
    return (
      <img
        src={item.image_url}
        alt={item.title ?? "Saved"}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
      />
    )
  }
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageIcon size={52} className="text-white/[0.04]" />
      </div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-teal-500/[0.04] blur-[70px]" />
    </>
  )
}

const HERO_RENDERERS: Record<MindItemType, React.FC<{ item: MindItem }>> = {
  article: ArticleHero,
  code: CodeHero,
  highlight: HighlightHero,
  thought: ThoughtHero,
  image: VisualHero,
  screenshot: VisualHero,
}

/* ── Noise texture (inline SVG) ── */

const NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.06\'/%3E%3C/svg%3E")'

/* ── Card Component ── */

interface MindItemCardProps {
  item: MindItem
  onClick?: () => void
  index?: number
}

export function MindItemCard({ item, onClick, index = 0 }: MindItemCardProps) {
  const Icon = TYPE_ICONS[item.type]
  const theme = TYPE_THEME[item.type]
  const HeroContent = HERO_RENDERERS[item.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        "bg-space-800/80",
        "border border-white/[0.06]",
        "transition-all duration-500",
        "h-[320px] flex flex-col",
        theme.glow,
        "hover:border-white/[0.14] hover:translate-y-[-3px]",
      )}
    >
      {/* Hover light sweep */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* ── Visual Hero ── */}
      <div
        className={cn(
          "relative h-[190px] overflow-hidden shrink-0",
          "bg-gradient-to-br",
          theme.hero,
        )}
      >
        <HeroContent item={item} />

        {/* Noise texture */}
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: NOISE, backgroundSize: "100px 100px" }}
        />

        {/* Bottom fade into card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-space-800/90 to-transparent" />

        {/* Type badge */}
        <div
          className={cn(
            "absolute bottom-2.5 left-3 flex items-center gap-1.5",
            "px-2 py-[3px] rounded-lg text-[9px] font-semibold uppercase tracking-[0.15em]",
            "border backdrop-blur-sm",
            theme.badge,
          )}
        >
          <Icon size={9} />
          {item.type}
        </div>

        {/* Timestamp */}
        <span className="absolute top-2.5 right-3 text-[9px] font-mono text-white/15 bg-black/25 backdrop-blur-sm px-1.5 py-0.5 rounded">
          {formatRelativeTime(item.created_at)}
        </span>
      </div>

      {/* ── Info Section ── */}
      <div className="flex-1 flex flex-col px-4 pt-3 pb-3 min-h-0">
        {/* Title or content excerpt */}
        {item.title ? (
          <h3 className="text-[13px] font-semibold text-white/80 leading-snug mb-1.5 line-clamp-2 group-hover:text-white/95 transition-colors duration-300">
            {item.title}
          </h3>
        ) : item.content ? (
          <p className="text-[12px] text-white/45 leading-snug mb-1.5 line-clamp-2">
            {item.content}
          </p>
        ) : null}

        {/* Article summary */}
        {item.type === "article" && item.summary && (
          <p className="text-[10px] text-white/20 leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        )}

        {/* Tags + source pinned to bottom */}
        <div className="mt-auto shrink-0 space-y-1.5">
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono text-white/[0.16] bg-white/[0.03] px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-[9px] font-mono text-white/10">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {item.source_domain && (
            <div className="flex items-center gap-1 text-[9px] text-white/[0.13]">
              <Globe size={8} />
              <span className="truncate">{item.source_domain}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
