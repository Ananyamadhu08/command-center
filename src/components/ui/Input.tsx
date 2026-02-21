"use client"

import { cn } from "@/lib/utils"

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
  label?: string
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  label,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5",
          "text-sm text-white/90 placeholder:text-white/30",
          "transition-all duration-200",
          "focus:border-cosmic/50 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-cosmic/30",
          className,
        )}
      />
    </div>
  )
}

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  rows?: number
}

export function TextArea({
  value,
  onChange,
  placeholder,
  className,
  label,
  rows = 3,
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5",
          "text-sm text-white/90 placeholder:text-white/30 resize-none",
          "transition-all duration-200",
          "focus:border-cosmic/50 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-cosmic/30",
          className,
        )}
      />
    </div>
  )
}
