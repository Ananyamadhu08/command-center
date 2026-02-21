"use client"

import { useState, useEffect, useCallback } from "react"
import { StarBackground } from "@/components/layout/StarBackground"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { TodayView } from "@/components/sections/TodayView"
import { BriefsView } from "@/components/sections/BriefsView"
import { MealsView } from "@/components/sections/MealsView"
import { HabitsView } from "@/components/sections/HabitsView"
import { AnalyticsView } from "@/components/sections/AnalyticsView"
import { NotesView } from "@/components/sections/NotesView"
import type { NavSection } from "@/lib/types"

export default function Home() {
  const [activeSection, setActiveSection] = useState<NavSection>("today")

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    const sections: NavSection[] = ["today", "briefs", "meals", "habits", "analytics", "notes"]
    const key = parseInt(e.key, 10)
    if (key >= 1 && key <= 6) {
      setActiveSection(sections[key - 1])
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <Sidebar active={activeSection} onChange={setActiveSection} />

      <main className="ml-16 lg:ml-56 min-h-screen relative z-10 p-6 lg:p-10 max-w-5xl">
        <Header />

        {activeSection === "today" && <TodayView onNavigate={setActiveSection} />}
        {activeSection === "briefs" && <BriefsView />}
        {activeSection === "meals" && <MealsView />}
        {activeSection === "habits" && <HabitsView />}
        {activeSection === "analytics" && <AnalyticsView />}
        {activeSection === "notes" && <NotesView />}
      </main>
    </div>
  )
}
