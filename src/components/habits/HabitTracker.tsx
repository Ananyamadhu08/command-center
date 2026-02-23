"use client"

import { useState, useMemo } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { calculateStreak, getLast7Days } from "@/lib/streaks"
import { CheckCircle, Pencil, Plus, Check } from "lucide-react"
import type { Habit, HabitLog } from "@/lib/types"
import { getToday } from "@/lib/utils"
import { COLORS, DEFAULT_COLOR, resolveColor } from "@/lib/colors"
import { ICON_CATEGORIES, DEFAULT_ICON } from "@/lib/icons"

interface HabitTrackerProps {
  habits: Habit[]
  todayLogs: HabitLog[]
  onToggle: (habitId: string, completed: boolean) => void
  onCreate?: (habit: { name: string; icon: string; color: string }) => void
  onUpdate?: (habitId: string, updates: { name: string; icon: string; color: string }) => void
  onDelete?: (habitId: string) => void
  allLogs?: HabitLog[]
}

export function HabitTracker({ habits, todayLogs, onToggle, onCreate, onUpdate, onDelete, allLogs = [] }: HabitTrackerProps) {
  const today = getToday()
  const completedIds = new Set(
    todayLogs.filter((l) => l.date === today && l.completed).map((l) => l.habit_id),
  )
  const completedCount = completedIds.size
  const progress = habits.length > 0 ? completedCount / habits.length : 0

  const [showCreate, setShowCreate] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [newName, setNewName] = useState("")
  const [newIcon, setNewIcon] = useState(DEFAULT_ICON)
  const [newColor, setNewColor] = useState(DEFAULT_COLOR)

  // Editing state for manage modal
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editIcon, setEditIcon] = useState("")
  const [editColor, setEditColor] = useState("")

  const last7 = useMemo(() => getLast7Days(), [])

  const streakByHabit = useMemo(() => {
    const map = new Map<string, number>()
    for (const habit of habits) {
      const dates = allLogs
        .filter((l) => l.habit_id === habit.id && l.completed)
        .map((l) => l.date)
      map.set(habit.id, calculateStreak(dates))
    }
    return map
  }, [habits, allLogs])

  const completionGrid = useMemo(() => {
    const grid = new Map<string, Set<string>>()
    for (const log of allLogs) {
      if (!log.completed) continue
      if (!grid.has(log.habit_id)) grid.set(log.habit_id, new Set())
      grid.get(log.habit_id)!.add(log.date)
    }
    return grid
  }, [allLogs])

  function handleCreate() {
    if (!newName.trim() || !onCreate) return
    onCreate({ name: newName.trim(), icon: newIcon, color: newColor })
    setNewName("")
    setNewIcon(DEFAULT_ICON)
    setNewColor(DEFAULT_COLOR)
    setShowCreate(false)
  }

  function startEditing(habit: Habit) {
    setEditingId(habit.id)
    setEditName(habit.name)
    setEditIcon(habit.icon)
    setEditColor(habit.color)
  }

  function saveEdit() {
    if (!editingId || !editName.trim() || !onUpdate) return
    onUpdate(editingId, { name: editName.trim(), icon: editIcon, color: editColor })
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  return (
    <>
      <GlassCard glow="cosmic">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
            <CheckCircle size={14} className="text-cosmic-light" />
            Daily Habits
          </h3>
          <div className="flex items-center gap-2">
            {habits.length > 0 && (
              <button
                onClick={() => setShowManage(true)}
                className="w-5 h-5 rounded-md border border-white/10 text-white/30 hover:bg-white/5 hover:text-white/60 flex items-center justify-center transition-all text-[10px] leading-none"
                title="Manage habits"
              >
                <Pencil size={10} />
              </button>
            )}
            <button
              onClick={() => setShowCreate(true)}
              className="w-5 h-5 rounded-md border border-cosmic/25 text-cosmic-light/60 hover:bg-cosmic/10 hover:text-cosmic-light flex items-center justify-center transition-all"
              title="Add habit"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Progress bar + count right below header */}
        <div className="flex items-center gap-3 mt-2 mb-4">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden flex-1">
            <div
              className="h-full bg-gradient-to-r from-cosmic to-cosmic-light rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/30 flex-shrink-0">
            {completedCount}/{habits.length}
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => {
            const done = completedIds.has(habit.id)
            const streak = streakByHabit.get(habit.id) ?? 0
            return (
              <button
                key={habit.id}
                onClick={() => onToggle(habit.id, !done)}
                className="flex items-center gap-2.5 w-full text-left py-1.5 group"
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex-shrink-0 flex items-center justify-center transition-all ${
                    done
                      ? "border-cosmic/50 bg-cosmic/20"
                      : "border-white/15 group-hover:border-white/30"
                  }`}
                >
                  {done && <Check size={10} className="text-cosmic-light" />}
                </div>
                <span className="text-sm mr-1">{habit.icon}</span>
                <span
                  className={`text-xs transition-all flex-1 ${
                    done ? "text-white/30 line-through" : "text-white/70"
                  }`}
                >
                  {habit.name}
                </span>
                {streak > 0 && (
                  <span className="text-[10px] font-mono text-white/20">{streak}d</span>
                )}
              </button>
            )
          })}
        </div>

        {/* 7-Day Mini Grid */}
        {habits.length > 0 && allLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">This week</p>
            <div className="grid gap-y-2.5 gap-x-1" style={{ gridTemplateColumns: `24px repeat(7, 1fr)` }}>
              <div />
              {last7.map((d) => (
                <div key={d.date} className="text-[9px] text-white/25 text-center pb-1">
                  {d.dayOfWeek.charAt(0)}
                </div>
              ))}
              {habits.map((habit) => {
                const habitDates = completionGrid.get(habit.id)
                const habitHex = resolveColor(habit.color).hex
                return (
                  <div key={habit.id} className="contents">
                    <div className="text-xs leading-none flex items-center justify-center">{habit.icon}</div>
                    {last7.map((d) => {
                      const completed = habitDates?.has(d.date) ?? false
                      return (
                        <div key={d.date} className="flex items-center justify-center py-0.5">
                          <div
                            className="w-3.5 h-3.5 rounded-[3px] transition-colors"
                            style={{
                              backgroundColor: completed ? habitHex : "rgba(255,255,255,0.04)",
                              boxShadow: completed ? `0 0 6px ${habitHex}44` : "none",
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Create Habit Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Habit">
        <div className="space-y-4">
          <Input value={newName} onChange={setNewName} placeholder="Habit name" />

          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">Icon</p>
            <div className="space-y-2">
              {ICON_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <p className="text-[9px] text-white/15 uppercase tracking-wider mb-1">{cat.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewIcon(icon)}
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base transition-all ${
                          newIcon === icon
                            ? "border-cosmic/50 bg-cosmic/15"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setNewColor(c.name)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    newColor === c.name ? "border-white/50 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <GlowButton variant="cosmic" size="sm" onClick={handleCreate} disabled={!newName.trim()}>
              Create Habit
            </GlowButton>
            <GlowButton variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
              Cancel
            </GlowButton>
          </div>
        </div>
      </Modal>

      {/* Manage Habits Modal */}
      <Modal isOpen={showManage} onClose={() => { setShowManage(false); setEditingId(null) }} title="Manage Habits">
        <div className="space-y-3">
          {habits.map((habit) => {
            const isEditing = editingId === habit.id
            if (isEditing) {
              return (
                <div key={habit.id} className="p-4 rounded-2xl border border-cosmic/30 bg-cosmic/[0.03] space-y-3">
                  <Input value={editName} onChange={setEditName} placeholder="Habit name" />

                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Icon</p>
                    <div className="space-y-2">
                      {ICON_CATEGORIES.map((cat) => (
                        <div key={cat.label}>
                          <p className="text-[9px] text-white/15 uppercase tracking-wider mb-1">{cat.label}</p>
                          <div className="flex flex-wrap gap-1">
                            {cat.icons.map((icon) => (
                              <button
                                key={icon}
                                onClick={() => setEditIcon(icon)}
                                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                                  editIcon === icon
                                    ? "border-cosmic/50 bg-cosmic/15"
                                    : "border-white/10 hover:border-white/20"
                                }`}
                              >
                                {icon}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Color</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setEditColor(c.name)}
                          className={`w-7 h-7 rounded-lg border-2 transition-all ${
                            editColor === c.name ? "border-white/50 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <GlowButton variant="cosmic" size="sm" onClick={saveEdit} disabled={!editName.trim()}>
                      Save
                    </GlowButton>
                    <GlowButton variant="ghost" size="sm" onClick={cancelEdit}>
                      Cancel
                    </GlowButton>
                  </div>
                </div>
              )
            }

            return (
              <div key={habit.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <span className="text-base">{habit.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80">{habit.name}</p>
                </div>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: resolveColor(habit.color).hex }} />
                <button
                  onClick={() => startEditing(habit)}
                  className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
                >
                  Edit
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(habit.id)}
                    className="text-[10px] px-2 py-1 rounded-lg border border-red-500/15 text-red-400/40 hover:text-red-400/80 hover:border-red-500/30 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            )
          })}

          {habits.length === 0 && (
            <p className="text-sm text-white/30 py-4 text-center">No habits yet.</p>
          )}
        </div>
      </Modal>
    </>
  )
}
