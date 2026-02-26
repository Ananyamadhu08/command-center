"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Globe, Clock, Eye, FileText, Highlighter, Image, Code2, Sparkles, Monitor, Copy, Check } from "lucide-react"
import { useState } from "react"
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

interface MindItemDetailProps {
  item: MindItem | null
  onClose: () => void
  onDelete?: (id: string) => void
}

export function MindItemDetail({ item, onClose, onDelete }: MindItemDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (item) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [item, handleKeyDown])

  async function handleCopy() {
    if (!item?.content) return
    await navigator.clipboard.writeText(item.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!item || !onDelete) return
    onDelete(item.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass glow-cosmic relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = TYPE_ICONS[item.type]
                  return <Icon size={16} className="text-white/40" />
                })()}
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                  {item.type}
                </span>
                <span className="text-[10px] text-white/15 font-mono">
                  {formatRelativeTime(item.created_at)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white/30 hover:text-white/70 transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Title */}
            {item.title && (
              <h2 className="text-lg font-semibold text-white/90 mb-3 leading-snug">
                {item.title}
              </h2>
            )}

            {/* Summary */}
            {item.summary && item.type !== "thought" && (
              <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-white/40 leading-relaxed">{item.summary}</p>
              </div>
            )}

            {/* Content */}
            {item.content && (
              <div className="mb-5">
                {item.type === "code" ? (
                  <div className="relative group">
                    <pre className="rounded-xl bg-black/30 border border-white/5 p-4 text-xs font-mono text-white/60 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                      {item.content}
                    </pre>
                    <button
                      onClick={handleCopy}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-white/60 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    {item.language && (
                      <span className="absolute bottom-3 right-3 text-[9px] font-mono text-cosmic-light/40 bg-cosmic/10 px-1.5 py-0.5 rounded">
                        {item.language}
                      </span>
                    )}
                  </div>
                ) : item.type === "highlight" ? (
                  <div className="pl-4 border-l-2 border-amber/30">
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                )}
              </div>
            )}

            {/* Image */}
            {item.image_url && (
              <div className="rounded-xl overflow-hidden mb-5 border border-white/5">
                <img src={item.image_url} alt={item.title ?? "Image"} className="w-full" />
              </div>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-[10px] text-white/20 font-mono">
                {item.source_domain && (
                  <span className="flex items-center gap-1">
                    <Globe size={9} />
                    {item.source_domain}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye size={9} />
                  {item.access_count} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={9} />
                  {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-electric-light/50 hover:text-electric-light transition-colors"
                  >
                    <ExternalLink size={10} />
                    Open source
                  </a>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-[10px] text-red-400/40 hover:text-red-400/80 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
