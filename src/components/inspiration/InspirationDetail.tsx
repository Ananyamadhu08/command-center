"use client"

import { Package, Palette, Sparkles, Rocket, ExternalLink } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { cn } from "@/lib/utils"
import { isSafeUrl } from "@/lib/api"
import type { InspirationCategory, InspirationItem } from "@/lib/types"

const CATEGORY_STYLE: Record<
  InspirationCategory,
  { label: string; icon: React.ElementType; bg: string; border: string; defaultImage: string }
> = {
  product: {
    label: "Product",
    icon: Package,
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    defaultImage: "/inspiration/product-default.png",
  },
  ui_design: {
    label: "UI & Design",
    icon: Palette,
    bg: "bg-pink-500/15",
    border: "border-pink-500/30",
    defaultImage: "/inspiration/ui-default.png",
  },
  creative_tech: {
    label: "Creative Tech",
    icon: Sparkles,
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    defaultImage: "/inspiration/creative-default.png",
  },
}

interface InspirationDetailProps {
  item: InspirationItem | null
  onClose: () => void
}

export function InspirationDetail({ item, onClose }: InspirationDetailProps) {
  if (!item) return <Modal isOpen={false} onClose={onClose} title=""><div /></Modal>

  const config = CATEGORY_STYLE[item.category]
  const Icon = config.icon
  const imageSrc = item.image_url || config.defaultImage

  return (
    <Modal isOpen={!!item} onClose={onClose} title={item.title} wide>
      <div className="space-y-5">
        {/* Hero Image */}
        <div className="relative h-[200px] rounded-xl overflow-hidden -mx-1">
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg border backdrop-blur-sm text-white/90",
              config.bg,
              config.border,
            )}
          >
            <Icon size={10} />
            {config.label}
          </span>
          {item.build_this && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg border backdrop-blur-sm bg-emerald-500/20 border-emerald-500/40 text-emerald-300">
              <Rocket size={10} />
              Build This
            </span>
          )}
          <span className="text-[10px] font-mono text-white/30 ml-auto">
            {item.source}
          </span>
        </div>

        {/* Creator */}
        <p className="text-xs font-mono text-white/40">
          by {item.creator}
        </p>

        {/* Description */}
        <p className="text-sm text-white/65 leading-relaxed">
          {item.description}
        </p>

        {/* Why Notable */}
        <div className="pt-3 border-t border-white/[0.06] space-y-2">
          <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
            Why It Stands Out
          </span>
          <p className="text-sm text-cosmic-light/80 leading-relaxed">
            {item.why_notable}
          </p>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 rounded-md font-mono bg-white/[0.04] border border-white/[0.08] text-white/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Source Link */}
        {item.source_url && isSafeUrl(item.source_url) && (
          <div className="pt-3">
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl border border-white/[0.1] text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              View Source <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </Modal>
  )
}
