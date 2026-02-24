"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ROUTE_PATHS } from "@/lib/routes"

export function KeyboardNav() {
  const router = useRouter()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox"
      ) return

      const key = parseInt(e.key, 10)
      if (key >= 1 && key <= ROUTE_PATHS.length) {
        router.push(ROUTE_PATHS[key - 1])
      }
    },
    [router],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return null
}
