"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { TextArea } from "@/components/ui/Input"
import { fetchApi } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import type { Note } from "@/lib/types"
import { EmptyState } from "@/components/ui/EmptyState"

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")

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

      <div className="space-y-3">
        {notes.map((note) => (
          <GlassCard key={note.id}>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
            <p className="text-[10px] text-white/20 font-mono mt-2">
              {formatRelativeTime(note.created_at)}
            </p>
          </GlassCard>
        ))}
      </div>

      {notes.length === 0 && (
        <EmptyState message="No notes yet" />
      )}
    </motion.div>
  )
}
