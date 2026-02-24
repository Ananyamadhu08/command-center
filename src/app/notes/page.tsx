import type { Metadata } from "next"
import { NotesView } from "@/components/sections/NotesView"

export const metadata: Metadata = {
  title: "Notes | Command Center",
}

export default function NotesPage() {
  return <NotesView />
}
