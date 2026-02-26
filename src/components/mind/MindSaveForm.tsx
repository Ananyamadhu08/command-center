"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Link, Type, Code2, Lightbulb, Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type SaveMode = "url" | "thought" | "code" | null

interface MindSaveFormProps {
  onSave: (input: { url?: string; content?: string; title?: string; type?: string }) => Promise<unknown>
  saving: boolean
  error: string | null
}

export function MindSaveForm({ onSave, saving, error }: MindSaveFormProps) {
  const [mode, setMode] = useState<SaveMode>(null)
  const [url, setUrl] = useState("")
  const [content, setContent] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleSubmit() {
    if (saving) return

    if (mode === "url" && url.trim()) {
      await onSave({ url: url.trim() })
      setUrl("")
      flashSuccess()
    } else if (mode === "thought" && content.trim()) {
      await onSave({ content: content.trim(), type: "thought" })
      setContent("")
      flashSuccess()
    } else if (mode === "code" && content.trim()) {
      await onSave({ content: content.trim(), type: "code" })
      setContent("")
      flashSuccess()
    }
  }

  function flashSuccess() {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setMode(null)
    }, 1500)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
    if (e.key === "Escape") {
      setMode(null)
      setUrl("")
      setContent("")
    }
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-4 flex items-center justify-center gap-2"
      >
        <Check size={16} className="text-emerald-400" />
        <span className="text-sm text-emerald-300 font-medium">Saved to Mind</span>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3" onKeyDown={handleKeyDown}>
      {/* Mode selector buttons */}
      <AnimatePresence mode="wait">
        {mode === null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => setMode("url")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "border border-white/10 bg-white/5 text-white/60",
                "hover:bg-electric/10 hover:border-electric/30 hover:text-electric-light",
              )}
            >
              <Link size={14} />
              Save URL
            </button>
            <button
              onClick={() => setMode("thought")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "border border-white/10 bg-white/5 text-white/60",
                "hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-300",
              )}
            >
              <Lightbulb size={14} />
              Quick Thought
            </button>
            <button
              onClick={() => setMode("code")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "border border-white/10 bg-white/5 text-white/60",
                "hover:bg-cosmic/10 hover:border-cosmic/30 hover:text-cosmic-light",
              )}
            >
              <Code2 size={14} />
              Code Snippet
            </button>
          </motion.div>
        )}

        {/* URL input */}
        {mode === "url" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Link size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                autoFocus
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a URL..."
                className={cn(
                  "w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5",
                  "text-sm text-white/90 placeholder:text-white/30",
                  "focus:border-electric/50 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-electric/30",
                )}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving || !url.trim()}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                "bg-electric/20 text-electric-light border border-electric/30",
                "hover:bg-electric/30 disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Save
            </button>
            <button onClick={() => { setMode(null); setUrl("") }} className="text-white/30 hover:text-white/60 p-2">
              <X size={14} />
            </button>
          </motion.div>
        )}

        {/* Thought / Code textarea */}
        {(mode === "thought" || mode === "code") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-2"
          >
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={mode === "thought" ? "What's on your mind..." : "Paste your code snippet..."}
              rows={mode === "code" ? 6 : 3}
              className={cn(
                "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3",
                "text-sm text-white/90 placeholder:text-white/30 resize-none",
                "focus:outline-none focus:ring-1",
                mode === "code"
                  ? "font-mono text-xs focus:border-cosmic/50 focus:ring-cosmic/30"
                  : "focus:border-pink-500/50 focus:ring-pink-500/30",
              )}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/20 font-mono">
                {mode === "code" ? "Language auto-detected" : "Press Cmd+Enter to save"}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => { setMode(null); setContent("") }} className="text-white/30 hover:text-white/60 text-xs px-2 py-1">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !content.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                    mode === "code"
                      ? "bg-cosmic/20 text-cosmic-light border border-cosmic/30 hover:bg-cosmic/30"
                      : "bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                  )}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-red-400/80 font-mono">{error}</p>
      )}
    </div>
  )
}
