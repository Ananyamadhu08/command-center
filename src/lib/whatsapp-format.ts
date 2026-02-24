import type { CookTask } from "./types"

export function formatCookTasksForWhatsApp(tasks: CookTask[], dayLabel: string): string {
  if (tasks.length === 0) {
    return `📋 *Cook's Tasks* (${dayLabel})\n\nNo tasks for today.`
  }

  const cookingTasks = tasks.filter((t) => t.category === "cooking")
  const prepTasks = tasks.filter((t) => t.category === "prep")

  const lines: string[] = [
    `📋 *Cook's Tasks — ${dayLabel}*`,
    "",
  ]

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

  lines.push(`Total: ${tasks.length} tasks`)

  return lines.join("\n")
}
