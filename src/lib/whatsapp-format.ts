import type { CookTask } from "./types"

export function formatCookTasksForWhatsApp(
  todayTasks: CookTask[],
  dayLabel: string,
  tomorrowPrep?: CookTask[],
  tomorrowDayLabel?: string,
): string {
  const lines: string[] = []

  // Today's tasks
  if (todayTasks.length === 0) {
    lines.push(`📋 *Cook's Tasks — ${dayLabel}*`, "", "No tasks for today.")
  } else {
    const cookingTasks = todayTasks.filter((t) => t.category === "cooking")
    const prepTasks = todayTasks.filter((t) => t.category === "prep")

    lines.push(`📋 *Cook's Tasks — ${dayLabel}*`, "")

    if (cookingTasks.length > 0) {
      lines.push("🔥 *Cooking*")
      for (const task of cookingTasks) {
        const qty = task.quantity ? ` (${task.quantity})` : ""
        lines.push(`☐ ${task.description}${qty}`)
      }
      lines.push("")
    }

    if (prepTasks.length > 0) {
      lines.push("🔪 *Prep*")
      for (const task of prepTasks) {
        const qty = task.quantity ? ` (${task.quantity})` : ""
        lines.push(`☐ ${task.description}${qty}`)
      }
      lines.push("")
    }
  }

  // Tomorrow's prep
  if (tomorrowPrep && tomorrowPrep.length > 0 && tomorrowDayLabel) {
    lines.push(`📦 *Prep for Tomorrow (${tomorrowDayLabel})*`)
    for (const task of tomorrowPrep) {
      const qty = task.quantity ? ` (${task.quantity})` : ""
      lines.push(`☐ ${task.description}${qty}`)
    }
    lines.push("")
  }

  const total = todayTasks.length + (tomorrowPrep?.length ?? 0)
  lines.push(`Total: ${total} tasks`)

  return lines.join("\n")
}
