"use client"

import { useState, useEffect, useMemo } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { getToday } from "@/lib/utils"

interface Book {
  id: string
  title: string
  totalPages: number
  startDate: string
  finished: boolean
}

const STORAGE_KEY = "command-center:books"

interface ReadingTrackerProps {
  onLog: (entry: { book_title: string; pages_read: number; date: string; notes: string }) => void
  recentLogs: { book_title: string; pages_read: number; date: string }[]
}

function loadBooks(): Book[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveBooks(books: Book[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)) } catch { /* storage unavailable */ }
}

export function ReadingTracker({ onLog, recentLogs }: ReadingTrackerProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFinished, setShowFinished] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newPages, setNewPages] = useState("")
  const [pageInputs, setPageInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    setBooks(loadBooks())
    setLoaded(true)
  }, [])

  const activeBooks = useMemo(() => books.filter((b) => !b.finished), [books])
  const finishedBooks = useMemo(() => books.filter((b) => b.finished), [books])

  const bookProgress = useMemo(() => {
    const map = new Map<string, { cumulative: number; today: number }>()
    const today = getToday()
    for (const book of activeBooks) {
      const logsForBook = recentLogs.filter((l) => l.book_title === book.title)
      const cumulative = logsForBook.reduce((sum, l) => sum + l.pages_read, 0)
      const todayRead = logsForBook
        .filter((l) => l.date === today)
        .reduce((sum, l) => sum + l.pages_read, 0)
      map.set(book.id, { cumulative, today: todayRead })
    }
    return map
  }, [activeBooks, recentLogs])

  const finishedBookStats = useMemo(() => {
    const map = new Map<string, number>()
    for (const book of finishedBooks) {
      const total = recentLogs
        .filter((l) => l.book_title === book.title)
        .reduce((sum, l) => sum + l.pages_read, 0)
      map.set(book.id, total)
    }
    return map
  }, [finishedBooks, recentLogs])

  function handleAddBook() {
    const pages = parseInt(newPages, 10)
    if (!newTitle.trim() || !pages || pages <= 0) return
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: newTitle.trim(),
      totalPages: pages,
      startDate: getToday(),
      finished: false,
    }
    const updated = [...books, newBook]
    setBooks(updated)
    saveBooks(updated)
    setNewTitle("")
    setNewPages("")
    setShowAddForm(false)
  }

  function handleFinishBook(bookId: string) {
    const updated = books.map((b) => (b.id === bookId ? { ...b, finished: true } : b))
    setBooks(updated)
    saveBooks(updated)
    setPageInputs((prev) => {
      const next = { ...prev }
      delete next[bookId]
      return next
    })
  }

  function handleLogPage(book: Book) {
    const input = pageInputs[book.id]
    if (!input) return
    const page = parseInt(input, 10)
    const progress = bookProgress.get(book.id)
    const cumulative = progress?.cumulative ?? 0
    if (!page || page <= cumulative || page > book.totalPages) return
    const delta = page - cumulative
    onLog({
      book_title: book.title,
      pages_read: delta,
      date: getToday(),
      notes: "",
    })
    setPageInputs((prev) => ({ ...prev, [book.id]: "" }))
  }

  if (!loaded) {
    return (
      <GlassCard glow="cosmic">
        <div className="h-20 flex items-center justify-center">
          <span className="text-xs text-white/30">Loading...</span>
        </div>
      </GlassCard>
    )
  }

  return (
    <>
      <GlassCard glow="cosmic">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
            <span className="text-cosmic-light">□</span>
            Reading
          </h3>
          <div className="flex items-center gap-2">
            {finishedBooks.length > 0 && (
              <button
                onClick={() => setShowFinished(true)}
                className="text-[10px] text-cosmic-light/40 hover:text-cosmic-light/70 transition-colors"
              >
                {finishedBooks.length} finished
              </button>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="w-5 h-5 rounded-md border border-cosmic/25 text-cosmic-light/60 hover:bg-cosmic/10 hover:text-cosmic-light flex items-center justify-center transition-all text-xs leading-none"
              title="Add book"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Empty State */}
          {activeBooks.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-xs text-white/25">No books yet. Add one to start tracking.</p>
            </div>
          )}

          {/* Active Books */}
          {activeBooks.map((book) => {
            const progress = bookProgress.get(book.id)
            const cumulative = progress?.cumulative ?? 0
            const todayRead = progress?.today ?? 0
            const percent = Math.round(Math.min(cumulative / book.totalPages, 1) * 100)
            const pageInput = pageInputs[book.id] ?? ""
            const parsedPage = pageInput ? parseInt(pageInput, 10) : NaN
            const isValid = !isNaN(parsedPage) && parsedPage > cumulative && parsedPage <= book.totalPages

            return (
              <div key={book.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.09] transition-colors">
                {/* Title + Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-[13px] font-medium text-white/90 leading-snug">{book.title}</p>
                    <p className="text-[10px] text-white/20 mt-1">{book.totalPages} pages total</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {todayRead > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-cosmic/10 border border-cosmic/20 text-cosmic-light/80">
                        +{todayRead} today
                      </span>
                    )}
                    <button
                      onClick={() => handleFinishBook(book.id)}
                      className="text-[10px] px-2 py-0.5 rounded-lg border border-white/[0.06] text-white/20 hover:text-white/50 hover:border-white/15 transition-all"
                    >
                      Finish
                    </button>
                  </div>
                </div>

                {/* Progress Hero */}
                <div className="mb-5">
                  <div className="flex items-baseline justify-between mb-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-cosmic-light tabular-nums">{percent}%</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/25">
                      pg {cumulative} of {book.totalPages}
                    </span>
                  </div>
                  <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(percent, 1)}%`,
                        background: "linear-gradient(90deg, var(--color-cosmic), var(--color-cosmic-light))",
                        boxShadow: percent > 0 ? "0 0 12px rgba(139, 92, 246, 0.3)" : "none",
                      }}
                    />
                  </div>
                </div>

                {/* Page Input — inline sentence style */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-white/30 flex-shrink-0">I'm on page</span>
                  <input
                    value={pageInput}
                    onChange={(e) => setPageInputs((prev) => ({ ...prev, [book.id]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter" && isValid) handleLogPage(book) }}
                    placeholder={`${cumulative + 1}`}
                    type="number"
                    className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 placeholder:text-white/20 focus:border-cosmic/50 focus:outline-none focus:ring-1 focus:ring-cosmic/30 transition-all tabular-nums"
                  />
                  <GlowButton
                    variant="cosmic"
                    size="sm"
                    onClick={() => handleLogPage(book)}
                    disabled={!isValid}
                  >
                    Update
                  </GlowButton>
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Add Book Modal */}
      <Modal isOpen={showAddForm} onClose={() => { setShowAddForm(false); setNewTitle(""); setNewPages("") }} title="Add Book">
        <div className="space-y-4">
          <Input value={newTitle} onChange={setNewTitle} placeholder="Book title" />
          <Input value={newPages} onChange={setNewPages} placeholder="Total pages" type="number" />
          <div className="flex gap-2 pt-2">
            <GlowButton
              variant="cosmic"
              size="sm"
              onClick={handleAddBook}
              disabled={!newTitle.trim() || !newPages || parseInt(newPages, 10) <= 0}
            >
              Add Book
            </GlowButton>
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => { setShowAddForm(false); setNewTitle(""); setNewPages("") }}
            >
              Cancel
            </GlowButton>
          </div>
        </div>
      </Modal>

      {/* Finished Books Modal */}
      <Modal isOpen={showFinished} onClose={() => setShowFinished(false)} title="Finished Books">
        {finishedBooks.length === 0 ? (
          <p className="text-sm text-white/40">No finished books yet.</p>
        ) : (
          <div className="space-y-3">
            {finishedBooks.map((book) => {
              const pagesRead = finishedBookStats.get(book.id) ?? 0
              const pct = Math.round(Math.min(pagesRead / book.totalPages, 1) * 100)
              return (
                <div key={book.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white/80">{book.title}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">Started {book.startDate}</p>
                    </div>
                    <span className="text-sm font-semibold text-cosmic-light/60">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cosmic/50 to-cosmic-light/50 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-white/20 mt-2">{pagesRead} / {book.totalPages} pages read</p>
                </div>
              )
            })}
          </div>
        )}
      </Modal>
    </>
  )
}
