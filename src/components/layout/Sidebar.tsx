"use client"

import { cn } from "@/lib/utils"
import { Sun, FolderOpen, Zap, CheckCircle, Utensils, BarChart3, FileText } from "lucide-react"
import type { NavSection } from "@/lib/types"

interface SidebarProps {
  active: NavSection
  onChange: (section: NavSection) => void
}

const NAV_ITEMS: { id: NavSection; label: string; shortcut: string; icon: typeof Sun }[] = [
  { id: "today", label: "Today", shortcut: "1", icon: Sun },
  { id: "projects", label: "Projects", shortcut: "2", icon: FolderOpen },
  { id: "briefs", label: "Tech News", shortcut: "3", icon: Zap },
  { id: "habits", label: "Habits", shortcut: "4", icon: CheckCircle },
  { id: "meals", label: "Meals", shortcut: "5", icon: Utensils },
  { id: "analytics", label: "Analytics", shortcut: "6", icon: BarChart3 },
  { id: "notes", label: "Notes", shortcut: "7", icon: FileText },
]

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <nav
      className="fixed left-0 top-0 h-full w-16 lg:w-56 flex flex-col items-center lg:items-stretch py-8 z-20"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mb-10 flex items-center justify-center lg:justify-start lg:px-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cosmic to-electric flex items-center justify-center text-white text-sm font-bold">
          C
        </div>
        <span className="hidden lg:block ml-3 text-sm font-semibold text-white/80 tracking-wide">
          Command Center
        </span>
      </div>

      <div className="flex flex-col gap-1 flex-1 w-full px-2 lg:px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group w-full",
                active === item.id
                  ? "bg-white/10 text-white shadow-[inset_0_0_12px_rgba(139,92,246,0.1)]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5",
              )}
              aria-current={active === item.id ? "page" : undefined}
              title={`${item.label} (${item.shortcut})`}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                className={cn(
                  "shrink-0 transition-colors",
                  active === item.id ? "text-cosmic-light" : "text-white/30 group-hover:text-white/50",
                )}
              />
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="px-2 lg:px-3 mt-auto">
        <div className="h-px bg-white/5 mb-4" />
        <div className="text-[10px] text-white/20 text-center lg:text-left lg:px-3 font-mono">
          v1.0
        </div>
      </div>
    </nav>
  )
}
