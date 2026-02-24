import type { Metadata } from "next"
import { BriefsView } from "@/components/sections/BriefsView"

export const metadata: Metadata = {
  title: "Tech News | Command Center",
}

export default function BriefsPage() {
  return <BriefsView />
}
