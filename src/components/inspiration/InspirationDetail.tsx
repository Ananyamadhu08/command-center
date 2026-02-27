"use client"

import { Package, Palette, Sparkles, Flame, ExternalLink, Zap, TrendingUp, Wrench, Link2 } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { cn } from "@/lib/utils"
import { isSafeUrl } from "@/lib/api"
import type { InspirationCategory, InspirationItem } from "@/lib/types"

const CATEGORY_STYLE: Record<
  InspirationCategory,
  { label: string; icon: React.ElementType; bg: string; border: string; text: string; defaultImage: string }
> = {
  product: {
    label: "Product",
    icon: Package,
    bg: "bg-blue-500/20",
    border: "border-blue-400/40",
    text: "text-blue-300",
    defaultImage: "/inspiration/product-default.png",
  },
  ui_design: {
    label: "UI & Design",
    icon: Palette,
    bg: "bg-pink-500/20",
    border: "border-pink-400/40",
    text: "text-pink-300",
    defaultImage: "/inspiration/ui-default.png",
  },
  creative_tech: {
    label: "Creative Tech",
    icon: Sparkles,
    bg: "bg-violet-500/20",
    border: "border-violet-400/40",
    text: "text-violet-300",
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
        <div className="relative h-[200px] rounded-lg overflow-hidden">
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-mono text-white/70 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
              by {item.creator}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-lg border",
              config.bg, config.border, config.text,
            )}
          >
            <Icon size={11} />
            {config.label}
          </span>
          {item.build_this && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-lg border bg-orange-500/20 border-orange-400/40 text-orange-300">
              <Flame size={11} strokeWidth={2} />
              For You
            </span>
          )}
          <span className="text-[10px] font-mono text-white/35 ml-auto">
            {item.source}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-white/70 leading-relaxed">
          {item.description}
        </p>

        {/* Key Features */}
        {item.key_features.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-violet-400/60" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">Key Features</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {item.key_features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-white/20 mt-[7px] shrink-0" />
                  <span className="text-[12px] text-white/55 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {item.tech_stack.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Wrench size={12} className="text-violet-400/60" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2.5 py-1 rounded-md font-mono bg-white/[0.06] border border-white/[0.1] text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Traction */}
        {item.revenue_or_traction && (
          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15">
            <TrendingUp size={13} className="text-emerald-400/70 mt-0.5 shrink-0" />
            <span className="text-[12px] text-emerald-300/70 leading-relaxed">{item.revenue_or_traction}</span>
          </div>
        )}

        {/* Why Notable */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">
            Why It Stands Out
          </span>
          <p className="text-[12px] text-white/50 leading-relaxed italic">
            {item.why_notable}
          </p>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 rounded-md font-mono bg-white/[0.04] border border-white/[0.08] text-white/35"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {item.links.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Link2 size={12} className="text-violet-400/60" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">Links</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.links.map((link) => (
                isSafeUrl(link.url) && (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-white/[0.1] text-white/45 hover:text-white/80 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                  >
                    {link.label}
                    <ExternalLink size={10} />
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
