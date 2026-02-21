"use client"

import { cn } from "@/lib/utils"

interface GlowButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "cosmic" | "electric" | "amber" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  type?: "button" | "submit"
}

const variantStyles = {
  cosmic:
    "bg-cosmic/20 text-cosmic-light border-cosmic/30 hover:bg-cosmic/30 hover:border-cosmic/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
  electric:
    "bg-electric/20 text-electric-light border-electric/30 hover:bg-electric/30 hover:border-electric/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
  amber:
    "bg-amber/20 text-amber-light border-amber/30 hover:bg-amber/30 hover:border-amber/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  ghost:
    "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20",
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
}

export function GlowButton({
  children,
  onClick,
  variant = "cosmic",
  size = "md",
  className,
  disabled = false,
  type = "button",
}: GlowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl border font-medium transition-all duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </button>
  )
}
