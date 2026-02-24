import type { Metadata } from "next"
import { ProjectsView } from "@/components/sections/ProjectsView"

export const metadata: Metadata = {
  title: "Projects | Command Center",
}

export default function ProjectsPage() {
  return <ProjectsView />
}
