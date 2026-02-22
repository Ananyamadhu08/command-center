"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { generateCookInstructions } from "@/lib/nutrition"
import type { MealPlanData } from "@/lib/types"

interface CookCardProps {
  plan: MealPlanData
}

export function CookCard({ plan }: CookCardProps) {
  const [copied, setCopied] = useState(false)
  const instructions = generateCookInstructions(plan)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(instructions)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may not be available
    }
  }

  return (
    <GlassCard glow="cosmic">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-cosmic-light text-sm">📋</span>
          <h3 className="text-base font-semibold text-white/90">Cook&apos;s Card</h3>
        </div>
        <GlowButton variant="cosmic" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </GlowButton>
      </div>
      <pre className="text-[11px] text-white/50 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
        {instructions}
      </pre>
    </GlassCard>
  )
}
