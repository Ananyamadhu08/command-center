import { Sun, FolderOpen, Zap, CheckCircle, Utensils, BarChart3, FileText } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/today", label: "Today", shortcut: "1", icon: Sun },
  { href: "/projects", label: "Projects", shortcut: "2", icon: FolderOpen },
  { href: "/briefs", label: "Tech News", shortcut: "3", icon: Zap },
  { href: "/habits", label: "Habits", shortcut: "4", icon: CheckCircle },
  { href: "/meals", label: "Meals", shortcut: "5", icon: Utensils },
  { href: "/analytics", label: "Analytics", shortcut: "6", icon: BarChart3 },
  { href: "/notes", label: "Notes", shortcut: "7", icon: FileText },
] as const

export const ROUTE_PATHS = NAV_ITEMS.map((item) => item.href)
