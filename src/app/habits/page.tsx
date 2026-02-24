import type { Metadata } from "next"
import { HabitsView } from "@/components/sections/HabitsView"

export const metadata: Metadata = {
  title: "Habits | Command Center",
}

export default function HabitsPage() {
  return <HabitsView />
}
