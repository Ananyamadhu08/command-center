import type { Metadata } from "next"
import { TodayView } from "@/components/sections/TodayView"

export const metadata: Metadata = {
  title: "Today | Command Center",
}

export default function TodayPage() {
  return <TodayView />
}
