"use client"

import React, { createContext, useContext, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/routes"

const DESKTOP_OPEN_WIDTH = 224
const DESKTOP_COLLAPSED_WIDTH = 64
const SPRING_CONFIG = { type: "spring", stiffness: 260, damping: 30 } as const

// --- Collapsible text wrapper ---

function Collapsible({
  open,
  className,
  children,
}: {
  open: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: open ? 1 : 0, maxWidth: open ? 200 : 0 }}
      transition={SPRING_CONFIG}
      style={{ overflow: "hidden", display: "flex" }}
      className={cn("whitespace-nowrap", className)}
    >
      {children}
    </motion.div>
  )
}

// --- Sidebar context ---

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider />")
  return ctx
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ open, setOpen }), [open])

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

// --- Main sidebar ---

export function Sidebar() {
  const { open, setOpen } = useSidebar()
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? DESKTOP_OPEN_WIDTH : DESKTOP_COLLAPSED_WIDTH }}
      transition={SPRING_CONFIG}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative z-30 h-full shrink-0 flex overflow-hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Gradient definition — gradientUnits="userSpaceOnUse" is critical:
          without it, horizontal/vertical lines get a zero-dimension bounding box
          and the gradient collapses, making those strokes invisible */}
      <svg
        style={{ width: 0, height: 0, position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="sidebar-icon-gradient"
            x1="0"
            y1="12"
            x2="24"
            y2="12"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex h-full w-full flex-col border-r border-white/[0.06] py-6">
        {/* Logo */}
        <div className={cn("flex items-center mb-8", open ? "px-4 gap-3" : "px-0 justify-center")}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)" }}
          >
            <Rocket size={18} strokeWidth={1.75} className="text-white" />
          </div>
          <Collapsible open={open} className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white/80 tracking-wide">
              Command Center
            </span>
          </Collapsible>
        </div>

        {/* Nav items */}
        <div className={cn("flex flex-col gap-1 flex-1 w-full", open ? "px-3" : "px-2")}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group"
                aria-current={isActive ? "page" : undefined}
                aria-keyshortcuts={item.shortcut}
                title={item.label}
              >
                <div
                  className={cn(
                    "rounded-xl relative flex items-center w-full cursor-pointer transition-all duration-200",
                    open ? "justify-start gap-3 px-3 py-2.5" : "justify-center gap-0 p-2.5",
                    isActive
                      ? "bg-white/10 text-white shadow-[inset_0_0_12px_rgba(139,92,246,0.1)]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5",
                  )}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.75}
                    className="shrink-0"
                    style={{ stroke: "url(#sidebar-icon-gradient)" }}
                  />
                  <Collapsible open={open} className="text-sm font-medium flex-1 text-left">
                    {item.label}
                  </Collapsible>
                  {isActive && open && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-cosmic-light rounded-r" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className={cn("mt-auto", open ? "px-4" : "px-2")}>
          <div className="h-px bg-white/5 mb-4" />
          <Collapsible open={open}>
            <span className="text-[10px] text-white/20 font-mono px-1">v1.0</span>
          </Collapsible>
        </div>
      </div>
    </motion.aside>
  )
}
