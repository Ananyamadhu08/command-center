import { getToday } from "@/lib/utils"

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const dateSet = new Set(dates)
  const today = getToday()

  let streak = 0
  let checkDate = new Date(today + "T00:00:00")

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split("T")[0]
    if (dateSet.has(dateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function getLast7Days(): { date: string; label: string; dayOfWeek: string }[] {
  const today = new Date()
  const days: { date: string; label: string; dayOfWeek: string }[] = []
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      dayOfWeek: dayNames[d.getDay()],
    })
  }
  return days
}

export function getLast30Days(): { date: string; label: string }[] {
  const today = new Date()
  const days: { date: string; label: string }[] = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    })
  }
  return days
}
