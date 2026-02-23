export interface IconCategory {
  readonly label: string
  readonly icons: readonly string[]
}

export const ICON_CATEGORIES: readonly IconCategory[] = [
  {
    label: "Fitness & Health",
    icons: ["💪", "🏃", "🧘", "🚶", "🏋️", "🚴", "🏊", "⚽", "🤸", "🧗"],
  },
  {
    label: "Mind & Focus",
    icons: ["🧠", "🎯", "📵", "🔇", "💭", "🪷", "🕯️", "🌅", "💤", "😊"],
  },
  {
    label: "Learning & Creative",
    icons: ["📖", "✍️", "📚", "🎵", "🎨", "💻", "📝", "🎸", "🎹", "📐"],
  },
  {
    label: "Nutrition & Self-Care",
    icons: ["💧", "🥗", "🍎", "🧴", "💊", "🍵", "🥤", "🪥", "🧹", "🌿"],
  },
  {
    label: "Social & Misc",
    icons: ["👋", "📞", "💌", "🐕", "🌱", "☀️", "⏰", "✅", "🔥", "⭐"],
  },
] as const

export const ALL_ICONS: readonly string[] = ICON_CATEGORIES.flatMap((c) => c.icons)

export const DEFAULT_ICON = "🎯"
