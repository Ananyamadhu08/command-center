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
    bg: "bg-blue-600/50",
    border: "border-blue-400/60",
    text: "text-white",
    defaultImage: "/inspiration/product-default.png",
  },
  ui_design: {
    label: "UI & Design",
    icon: Palette,
    bg: "bg-pink-600/50",
    border: "border-pink-400/60",
    text: "text-white",
    defaultImage: "/inspiration/ui-default.png",
  },
  creative_tech: {
    label: "Creative Tech",
    icon: Sparkles,
    bg: "bg-violet-600/50",
    border: "border-violet-400/60",
    text: "text-white",
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
        {/* Hero Image with badges overlaid */}
        <div className="relative h-[200px] rounded-lg overflow-hidden">
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-transparent" />

          {/* Category badge — top right on image */}
          <div className="absolute top-3 right-3 z-20">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                "px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-lg",
                config.bg, config.border, config.text,
              )}
            >
              <Icon size={11} />
              {config.label}
            </span>
          </div>
        </div>

        {/* Why It Stands Out — the hook, most important */}
        <p className="text-[13px] text-white/75 leading-relaxed">
          {item.why_notable}
        </p>

        {/* Full description */}
        <p className="text-[12px] text-white/50 leading-relaxed">
          {item.description}
        </p>

        {/* Traction — social proof early */}
        {item.revenue_or_traction && (
          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/15">
            <TrendingUp size={13} className="text-emerald-400/70 mt-0.5 shrink-0" />
            <span className="text-[12px] text-emerald-300/70 leading-relaxed">{item.revenue_or_traction}</span>
          </div>
        )}

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
                  <span className="text-[12px] text-white/50 leading-relaxed">{feature}</span>
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
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">Built With</span>
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

        {/* Footer — creator, source, for you */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[10px] font-mono text-white/35">
            by {item.creator}
          </span>
          <span className="text-white/15 text-[8px]">/</span>
          <span className="text-[10px] font-mono text-white/35">
            {item.source}
          </span>
          {item.build_this && (
            <>
              <span className="text-white/15 text-[8px]">/</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-orange-300/60">
                <Flame size={10} strokeWidth={2} />
                For You
              </span>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
