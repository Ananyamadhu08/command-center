export type ColorName =
  | "violet" | "purple" | "fuchsia" | "pink" | "rose"
  | "red" | "orange" | "amber" | "yellow" | "lime"
  | "green" | "emerald" | "teal" | "cyan" | "sky"
  | "blue" | "indigo"

export interface ColorDef {
  readonly name: ColorName
  readonly label: string
  readonly hex: string
  readonly hexLight: string
  readonly hexDark: string
}

export const COLORS: readonly ColorDef[] = [
  { name: "violet",  label: "Violet",  hex: "#8b5cf6", hexLight: "#a78bfa", hexDark: "#7c3aed" },
  { name: "purple",  label: "Purple",  hex: "#a855f7", hexLight: "#c084fc", hexDark: "#9333ea" },
  { name: "fuchsia", label: "Fuchsia", hex: "#d946ef", hexLight: "#e879f9", hexDark: "#c026d3" },
  { name: "pink",    label: "Pink",    hex: "#ec4899", hexLight: "#f472b6", hexDark: "#db2777" },
  { name: "rose",    label: "Rose",    hex: "#f43f5e", hexLight: "#fb7185", hexDark: "#e11d48" },
  { name: "red",     label: "Red",     hex: "#ef4444", hexLight: "#f87171", hexDark: "#dc2626" },
  { name: "orange",  label: "Orange",  hex: "#f97316", hexLight: "#fb923c", hexDark: "#ea580c" },
  { name: "amber",   label: "Amber",   hex: "#f59e0b", hexLight: "#fbbf24", hexDark: "#d97706" },
  { name: "yellow",  label: "Yellow",  hex: "#eab308", hexLight: "#facc15", hexDark: "#ca8a04" },
  { name: "lime",    label: "Lime",    hex: "#84cc16", hexLight: "#a3e635", hexDark: "#65a30d" },
  { name: "green",   label: "Green",   hex: "#22c55e", hexLight: "#4ade80", hexDark: "#16a34a" },
  { name: "emerald", label: "Emerald", hex: "#10b981", hexLight: "#34d399", hexDark: "#059669" },
  { name: "teal",    label: "Teal",    hex: "#14b8a6", hexLight: "#2dd4bf", hexDark: "#0d9488" },
  { name: "cyan",    label: "Cyan",    hex: "#06b6d4", hexLight: "#22d3ee", hexDark: "#0891b2" },
  { name: "sky",     label: "Sky",     hex: "#0ea5e9", hexLight: "#38bdf8", hexDark: "#0284c7" },
  { name: "blue",    label: "Blue",    hex: "#3b82f6", hexLight: "#60a5fa", hexDark: "#2563eb" },
  { name: "indigo",  label: "Indigo",  hex: "#6366f1", hexLight: "#818cf8", hexDark: "#4f46e5" },
]

export const DEFAULT_COLOR: ColorName = "violet"

const BY_NAME = new Map<string, ColorDef>(COLORS.map((c) => [c.name, c]))

const HEX_TO_NAME: Record<string, ColorName> = {
  "#8b5cf6": "violet",
  "#3b82f6": "blue",
  "#10b981": "emerald",
  "#f59e0b": "amber",
  "#ef4444": "red",
  "#ec4899": "pink",
  "#06b6d4": "cyan",
  "#84cc16": "lime",
  "#93c5fd": "blue",
  "#a78bfa": "violet",
  "#60a5fa": "blue",
  "#fbbf24": "amber",
  "#34d399": "emerald",
}

const FALLBACK: ColorDef = COLORS[0]

export function resolveColor(value: string): ColorDef {
  const byName = BY_NAME.get(value)
  if (byName) return byName

  const mapped = HEX_TO_NAME[value.toLowerCase()]
  if (mapped) return BY_NAME.get(mapped)!

  return FALLBACK
}
