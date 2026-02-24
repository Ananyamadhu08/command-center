"use client"

import { GlowButton } from "@/components/ui/GlowButton"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ message = "Something went wrong", onRetry, className = "" }: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}>
      <p className="text-sm text-white/30">{message}</p>
      {onRetry && (
        <GlowButton variant="cosmic" size="sm" onClick={onRetry}>
          Try again
        </GlowButton>
      )}
    </div>
  )
}
