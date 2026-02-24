"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Check, ChefHat, MessageCircle } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlowButton } from "@/components/ui/GlowButton"
import { extractCookTasks } from "@/lib/cook-tasks"
import { formatCookTasksForWhatsApp } from "@/lib/whatsapp-format"
import type { MealPlanData } from "@/lib/types"

interface CookCardProps {
  plan: MealPlanData
}

export function CookCard({ plan }: CookCardProps) {
  const tasks = useMemo(() => extractCookTasks(plan), [plan])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const progress = tasks.length > 0 ? checked.size / tasks.length : 0

  function toggle(taskId: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  async function handleCopyWhatsApp() {
    try {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const dayLabel = dayNames[new Date().getDay()]
      const message = formatCookTasksForWhatsApp(tasks, dayLabel)
      await navigator.clipboard.writeText(message)
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
          <ChefHat size={14} className="text-cosmic-light" />
          <h3 className="text-base font-semibold text-white/90">Cook&apos;s Tasks</h3>
          <span className="text-[10px] font-mono text-white/30">
            {checked.size}/{tasks.length}
          </span>
        </div>
        <GlowButton variant="cosmic" size="sm" onClick={handleCopyWhatsApp}>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={12} />
            {copied ? "Copied!" : "WhatsApp"}
          </span>
        </GlowButton>
      </div>

      <div className="h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cosmic to-cosmic-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-1.5">
        {tasks.map((task, index) => (
          <motion.button
            key={task.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            onClick={() => toggle(task.id)}
            className="flex items-center gap-2.5 w-full text-left py-1.5 px-1 rounded-lg hover:bg-white/[0.02] transition-colors group"
          >
            <div
              className={`w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${
                checked.has(task.id)
                  ? "border-cosmic/50 bg-cosmic/20 text-cosmic-light"
                  : "border-white/15 group-hover:border-white/30"
              }`}
            >
              {checked.has(task.id) && <Check size={10} />}
            </div>
            <span className="text-xs mr-1">{task.emoji}</span>
            <span
              className={`text-xs transition-all flex-1 ${
                checked.has(task.id)
                  ? "text-white/30 line-through"
                  : "text-white/60 group-hover:text-white/80"
              }`}
            >
              {task.description}
              {task.quantity && (
                <span className="text-white/30 ml-1.5">({task.quantity})</span>
              )}
            </span>
          </motion.button>
        ))}
      </div>
    </GlassCard>
  )
}
