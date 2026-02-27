"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Clock } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { TextArea } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { fetchApi } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import type { Note } from "@/lib/types"
import { EmptyState } from "@/components/ui/EmptyState"

const STICKY_ACCENTS = [
  "#facc15", // yellow
  "#fb923c", // orange
  "#a78bfa", // purple
  "#60a5fa", // blue
  "#34d399", // green
  "#f472b6", // pink
]

function getStickyStyle(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  const accent = STICKY_ACCENTS[Math.abs(hash) % STICKY_ACCENTS.length]
  const rotation = ((Math.abs(hash >> 8) % 5) - 2) * 0.7
  return { accent, rotation }
}

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    fetchApi<Note[]>("/api/notes").then((data) => {
      if (data) setNotes(data)
    })
  }, [])

  async function handleAddNote() {
    if (!newNote.trim()) return

    const tempNote: Note = {
      id: `temp-${Date.now()}`,
      content: newNote.trim(),
      created_at: new Date().toISOString(),
    }
    const previousNotes = notes
    setNotes((prev) => [tempNote, ...prev])
    setNewNote("")

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      })
      if (!res.ok) throw new Error("Failed to save")
    } catch {
      setNotes(previousNotes)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText size={26} strokeWidth={1.75} style={{ stroke: "url(#icon-gradient)" }} />
        <h2 className="text-2xl font-light text-white/90">Quick Notes</h2>
      </div>

      <GlassCard glow="cosmic">
        <div className="space-y-3">
          <TextArea
            value={newNote}
            onChange={setNewNote}
            placeholder="Capture a thought..."
            rows={3}
          />
          <div className="flex justify-end">
            <GlowButton
              variant="cosmic"
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              Save Note
            </GlowButton>
          </div>
        </div>
      </GlassCard>

      {/* Sticky notes grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {notes.map((note, i) => {
            const { accent, rotation } = getStickyStyle(note.id)
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, rotate: rotation }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                onClick={() => setSelectedNote(note)}
                className="cursor-pointer group relative"
              >
                <div
                  className="h-[180px] rounded-2xl p-4 flex flex-col overflow-hidden transition-all duration-200 group-hover:translate-y-[-3px]"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.04)`,
                  }}
                >
                  {/* Colored accent strip at top */}
                  <div
                    className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full"
                    style={{ background: accent, opacity: 0.6 }}
                  />

                  {/* Content */}
                  <div className="flex-1 overflow-hidden relative mt-1">
                    <p className="text-[12.5px] text-white/60 leading-[1.65] whitespace-pre-wrap">
                      {note.content}
                    </p>
                    {/* Bottom fade */}
                    <div
                      className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
                      style={{
                        background: "linear-gradient(transparent, rgba(14, 14, 26, 0.95))",
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-1.5 pt-2 shrink-0">
                    <Clock size={9} className="text-white/15" />
                    <span className="text-[9px] font-mono text-white/20">
                      {formatRelativeTime(note.created_at)}
                    </span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: accent, opacity: 0.4 }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <EmptyState message="No notes yet" />
      )}

      {/* Note detail modal */}
      <Modal
        isOpen={selectedNote !== null}
        onClose={() => setSelectedNote(null)}
        title="Note"
      >
        {selectedNote && (() => {
          const { accent } = getStickyStyle(selectedNote.id)
          return (
            <div className="space-y-4">
              <div
                className="w-8 h-[2px] rounded-full mb-2"
                style={{ background: accent, opacity: 0.5 }}
              />
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {selectedNote.content}
              </p>
              <div className="flex items-center gap-1.5 pt-3 border-t border-white/5">
                <Clock size={10} className="text-white/20" />
                <span className="text-[10px] text-white/20 font-mono">
                  {new Date(selectedNote.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )
        })()}
      </Modal>
    </motion.div>
  )
}
