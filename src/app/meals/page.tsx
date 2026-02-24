import type { Metadata } from "next"
import { MealsView } from "@/components/sections/MealsView"

export const metadata: Metadata = {
  title: "Meals | Command Center",
}

export default function MealsPage() {
  return <MealsView />
}
