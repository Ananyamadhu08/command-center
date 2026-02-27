"use client"

import { motion } from "framer-motion"
import { ExternalLink, Flame, Palette, Sparkles, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InspirationCategory, InspirationItem } from "@/lib/types"

const CATEGORY_CONFIG: Record<
  InspirationCategory,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string; glow: string; defaultImage: string }
> = {
  product: {
    label: "Product",
    icon: Package,
    color: "text-blue-400",
    bg: "bg-blue-600/40",
    border: "border-blue-400/50",
    glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    defaultImage: "/inspiration/product-default.png",
  },
  ui_design: {
    label: "UI & Design",
    icon: Palette,
    color: "text-pink-400",
    bg: "bg-pink-600/40",
    border: "border-pink-400/50",
    glow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    defaultImage: "/inspiration/ui-default.png",
  },
  creative_tech: {
    label: "Creative Tech",
    icon: Sparkles,
    color: "text-violet-400",
    bg: "bg-violet-600/40",
    border: "border-violet-400/50",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    defaultImage: "/inspiration/creative-default.png",
  },
}

function HudCorners() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/30" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/30" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/30" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/30" />
    </div>
  )
}

interface InspirationCardProps {
  item: InspirationItem
  index?: number
  onClick?: () => void
}

export function InspirationCard({ item, index = 0, onClick }: InspirationCardProps) {
  const config = CATEGORY_CONFIG[item.category]
  const Icon = config.icon
  const imageSrc = item.image_url || config.defaultImage

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
        "bg-white/[0.02]",
        "border border-white/[0.08]",
        "rounded-xl overflow-hidden",
        "transition-all duration-400",
        "flex flex-col",
        config.glow,
        "hover:border-white/[0.18] hover:translate-y-[-2px]",
      )}
    >
      <HudCorners />

      {/* Hero Image */}
      <div className="relative h-[190px] overflow-hidden shrink-0">
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges — top right */}
        <div className="absolute top-2.5 right-3 z-20 flex items-center gap-2">
          {item.build_this && (
            <div className="flex items-center justify-center w-[28px] h-[28px] rounded-lg border backdrop-blur-md bg-orange-500/50 border-orange-400/60 shadow-lg">
              <Flame size={16} strokeWidth={2} className="text-orange-100" />
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-1.5",
              "px-2.5 py-1 rounded-lg",
              "text-[10px] font-bold uppercase tracking-wider",
              "border backdrop-blur-md",
              config.bg,
              config.border,
              "text-white",
              "shadow-lg",
            )}
          >
            <Icon size={11} />
            {config.label}
          </div>
        </div>

      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col px-3.5 pt-2.5 pb-3 min-h-0">
        <h3 className="text-[13px] font-semibold text-white/85 leading-tight line-clamp-2 group-hover:text-white transition-colors duration-300">
          {item.title}
        </h3>

        <p className="text-[10.5px] text-white/35 leading-relaxed line-clamp-2 mt-1.5">
          {item.description}
        </p>

        {/* Why Notable */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.06]">
          <p className="text-[10px] text-white/25 leading-relaxed line-clamp-2 italic">
            {item.why_notable}
          </p>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 pt-2.5">
          <div className={cn("w-1 h-1 rounded-full shrink-0", config.color.replace("text-", "bg-"))} />
          <span className="text-[9px] font-mono text-white/35 truncate">
            {item.creator}
          </span>
          <span className="text-white/15 text-[8px]">/</span>
          <span className="text-[9px] font-mono text-white/35 truncate">
            {item.source}
          </span>
          {item.source_url && (
            <>
              <span className="text-white/15 text-[8px]">/</span>
              <ExternalLink size={9} className="text-white/25" />
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
