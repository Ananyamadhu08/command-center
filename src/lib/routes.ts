import { Sun, FolderOpen, Zap, CheckCircle, Utensils, BarChart3, FileText, Brain } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/today", label: "Today", shortcut: "1", icon: Sun },
  { href: "/mind", label: "Mind", shortcut: "2", icon: Brain },
  { href: "/projects", label: "Projects", shortcut: "3", icon: FolderOpen },
  { href: "/briefs", label: "Tech News", shortcut: "4", icon: Zap },
  { href: "/habits", label: "Habits", shortcut: "5", icon: CheckCircle },
  { href: "/meals", label: "Meals", shortcut: "6", icon: Utensils },
  { href: "/analytics", label: "Analytics", shortcut: "7", icon: BarChart3 },
  { href: "/notes", label: "Notes", shortcut: "8", icon: FileText },
] as const

export const ROUTE_PATHS = NAV_ITEMS.map((item) => item.href)
