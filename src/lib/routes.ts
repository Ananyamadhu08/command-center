import { Sun, FolderOpen, Zap, CheckCircle, Utensils, BarChart3, FileText, Brain, Flame } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/today", label: "Today", shortcut: "1", icon: Sun },
  { href: "/mind", label: "Mind", shortcut: "2", icon: Brain },
  { href: "/projects", label: "Projects", shortcut: "3", icon: FolderOpen },
  { href: "/briefs", label: "Tech News", shortcut: "4", icon: Zap },
  { href: "/inspiration", label: "Inspiration", shortcut: "5", icon: Flame },
  { href: "/habits", label: "Habits", shortcut: "6", icon: CheckCircle },
  { href: "/meals", label: "Meals", shortcut: "7", icon: Utensils },
  { href: "/analytics", label: "Analytics", shortcut: "8", icon: BarChart3 },
  { href: "/notes", label: "Notes", shortcut: "9", icon: FileText },
] as const

export const ROUTE_PATHS = NAV_ITEMS.map((item) => item.href)
