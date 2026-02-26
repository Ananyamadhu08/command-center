"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  X,
  Loader2,
  Sparkles,
  FileText,
  Highlighter,
  Image,
  Code2,
  Monitor,
  Globe,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import type { MindItem, MindItemType } from "@/lib/types"

interface SearchResult {
  item: MindItem
  similarity: number
}

interface MindSearchProps {
  onItemClick?: (item: MindItem) => void
}

const RESULT_ICONS: Record<MindItemType, React.ElementType> = {
  article: FileText,
  highlight: Highlighter,
  image: Image,
  code: Code2,
  thought: Sparkles,
  screenshot: Monitor,
}

const RESULT_ACCENTS: Record<MindItemType, string> = {
  article: "text-electric-light/60",
  code: "text-emerald-300/60",
  highlight: "text-amber-light/60",
  thought: "text-pink-300/60",
  image: "text-teal-300/60",
  screenshot: "text-white/40",
}

export function MindSearch({ onItemClick }: MindSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/mind/search?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) setResults(json.data)
        }
      } catch {
        // Silent fail
      } finally {
        setSearching(false)
      }
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const hasResults = results.length > 0
  const showDropdown = focused && query.trim().length > 0

  return (
    <div className="relative">
      {/* Search input */}
      <div
        className={cn(
          "relative flex items-center rounded-2xl border transition-all duration-300",
          "bg-white/[0.03] backdrop-blur-sm",
          focused
            ? "border-cosmic/40 shadow-[0_0_32px_rgba(139,92,246,0.1)] bg-white/[0.05]"
            : "border-white/8 hover:border-white/15",
        )}
      >
        <div className="pl-4 pr-2 py-3">
          {searching ? (
            <Loader2 size={18} className="text-cosmic-light/60 animate-spin" />
          ) : (
            <Search size={18} className={cn("transition-colors", focused ? "text-cosmic-light/60" : "text-white/20")} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search your mind... (natural language works)"
          className={cn(
            "flex-1 bg-transparent py-3 pr-4 text-sm text-white/90",
            "placeholder:text-white/25 focus:outline-none",
          )}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus() }}
            className="pr-4 text-white/20 hover:text-white/50 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Hint text */}
      {!focused && !query && (
        <div className="flex items-center gap-1.5 mt-2 ml-1">
          <Sparkles size={10} className="text-cosmic-light/30" />
          <span className="text-[10px] text-white/15 font-mono">
            Semantic search — describe what you remember, not exact words
          </span>
        </div>
      )}

      {/* Search results dropdown — compact rows */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "rounded-2xl border border-white/10 bg-space-800/95 backdrop-blur-xl",
              "shadow-[0_16px_64px_rgba(0,0,0,0.5)] p-2",
              "max-h-[60vh] overflow-y-auto",
            )}
          >
            {searching && results.length === 0 && (
              <div className="py-8 text-center">
                <Loader2 size={20} className="text-cosmic-light/40 animate-spin mx-auto mb-2" />
                <p className="text-xs text-white/20">Searching...</p>
              </div>
            )}

            {!searching && !hasResults && query.trim() && (
              <div className="py-8 text-center">
                <p className="text-sm text-white/30">No matches found</p>
                <p className="text-[10px] text-white/15 mt-1">Try different words or a broader description</p>
              </div>
            )}

            {hasResults && (
              <div className="space-y-0.5">
                <p className="text-[10px] text-white/20 font-mono px-3 py-1.5">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((r) => {
                  const Icon = RESULT_ICONS[r.item.type]
                  const accent = RESULT_ACCENTS[r.item.type]
                  const label = r.item.title || r.item.content?.slice(0, 80) || "Untitled"

                  return (
                    <button
                      key={r.item.id}
                      onClick={() => onItemClick?.(r.item)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                        "text-left transition-colors duration-150",
                        "hover:bg-white/[0.04]",
                      )}
                    >
                      <Icon size={14} className={accent} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/70 truncate leading-snug">
                          {label}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">
                            {r.item.type}
                          </span>
                          {r.item.source_domain && (
                            <span className="flex items-center gap-0.5 text-[9px] text-white/15">
                              <Globe size={7} />
                              {r.item.source_domain}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-white/12 shrink-0">
                        {formatRelativeTime(r.item.created_at)}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
