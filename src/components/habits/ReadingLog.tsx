"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { Input, TextArea } from "@/components/ui/Input"
import { getToday } from "@/lib/utils"

interface ReadingLogProps {
  onLog: (entry: { book_title: string; pages_read: number; date: string; notes: string }) => void
  recentLogs: { book_title: string; pages_read: number; date: string }[]
}

export function ReadingLog({ onLog, recentLogs }: ReadingLogProps) {
  const [bookTitle, setBookTitle] = useState("")
  const [pages, setPages] = useState("")
  const [notes, setNotes] = useState("")

  function handleSubmit() {
    const pageCount = parseInt(pages, 10)
    if (!bookTitle.trim() || !pageCount || pageCount <= 0) return
    onLog({
      book_title: bookTitle.trim(),
      pages_read: pageCount,
      date: getToday(),
      notes: notes.trim(),
    })
    setPages("")
    setNotes("")
  }

  const totalPages = recentLogs
    .filter((l) => l.date === getToday())
    .reduce((sum, l) => sum + l.pages_read, 0)

  return (
    <GlassCard glow="cosmic">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <span className="text-cosmic-light">□</span>
          Reading Log
        </h3>
        {totalPages > 0 && (
          <span className="text-[10px] font-mono text-cosmic-light/60">
            {totalPages} pages today
          </span>
        )}
      </div>
      <div className="space-y-3">
        <Input
          value={bookTitle}
          onChange={setBookTitle}
          placeholder="Book title"
        />
        <Input
          value={pages}
          onChange={setPages}
          placeholder="Pages read"
          type="number"
        />
        <TextArea
          value={notes}
          onChange={setNotes}
          placeholder="Notes (optional)"
          rows={2}
        />
        <GlowButton
          variant="cosmic"
          size="sm"
          onClick={handleSubmit}
          disabled={!bookTitle.trim() || !pages || parseInt(pages, 10) <= 0}
        >
          Log Reading
        </GlowButton>
      </div>
    </GlassCard>
  )
}
