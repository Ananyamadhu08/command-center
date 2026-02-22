"use client"

import { cn } from "@/lib/utils"
import type { NavSection } from "@/lib/types"

interface SidebarProps {
  active: NavSection
  onChange: (section: NavSection) => void
}

interface NavItem {
  id: NavSection
  label: string
  shortcut: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "today", label: "Today", shortcut: "1" },
  { id: "projects", label: "Projects", shortcut: "2" },
  { id: "briefs", label: "Tech News", shortcut: "3" },
  { id: "habits", label: "Habits", shortcut: "4" },
  { id: "meals", label: "Meals", shortcut: "5" },
  { id: "analytics", label: "Analytics", shortcut: "6" },
  { id: "notes", label: "Notes", shortcut: "7" },
]

function NavIcon({ id, className }: { id: NavSection; className?: string }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  }

  switch (id) {
    case "today":
      // Sun icon
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )
    case "projects":
      // Folder icon
      return (
        <svg {...props}>
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      )
    case "briefs":
      // Zap / lightning icon
      return (
        <svg {...props}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    case "habits":
      // Check circle icon
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      )
    case "meals":
      // Utensils icon
      return (
        <svg {...props}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )
    case "analytics":
      // Bar chart icon
      return (
        <svg {...props}>
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      )
    case "notes":
      // File text icon
      return (
        <svg {...props}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8M16 13H8M16 17H8" />
        </svg>
      )
  }
}

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
        {NAV_ITEMS.map((item) => (
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
            <NavIcon
              id={item.id}
              className={cn(
                "shrink-0 transition-colors",
                active === item.id ? "text-cosmic-light" : "text-white/30 group-hover:text-white/50",
              )}
            />
            <span className="hidden lg:block text-sm font-medium">{item.label}</span>
          </button>
        ))}
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
