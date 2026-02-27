import type { Metadata } from "next"
import { InspirationView } from "@/components/inspiration/InspirationView"

export const metadata: Metadata = {
  title: "Inspiration | Command Center",
}

export default function InspirationPage() {
  return <InspirationView />
}
