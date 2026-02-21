"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: "cosmic" | "electric" | "amber" | "none"
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  glow = "none",
  hover = true,
  onClick,
}: GlassCardProps) {
  const glowClass = glow !== "none" ? `glow-${glow}` : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass p-5 transition-all duration-300",
        hover && "hover:translate-y-[-2px]",
        glowClass,
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </motion.div>
  )
}
