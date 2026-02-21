"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { TextArea } from "@/components/ui/Input"
import type { Note } from "@/lib/types"

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((r) => { if (r.success) setNotes(r.data) })
      .catch(() => {})
  }, [])

  async function handleAddNote() {
    if (!newNote.trim()) return

    const tempNote: Note = {
      id: `temp-${Date.now()}`,
      content: newNote.trim(),
      created_at: new Date().toISOString(),
    }
    setNotes((prev) => [tempNote, ...prev])
    setNewNote("")

    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      })
    } catch {
      // Optimistic update remains
    }
  }

  function formatNoteTime(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-lg font-semibold text-white/80">Quick Notes</h2>

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

      <div className="space-y-3">
        {notes.map((note) => (
          <GlassCard key={note.id}>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
            <p className="text-[10px] text-white/20 font-mono mt-2">
              {formatNoteTime(note.created_at)}
            </p>
          </GlassCard>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-white/20">No notes yet. Start capturing your thoughts.</p>
        </div>
      )}
    </motion.div>
  )
}
