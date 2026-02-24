import Link from "next/link"
import { EmptyState } from "@/components/ui/EmptyState"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <EmptyState message="Page not found" />
      <Link
        href="/today"
        className="text-cosmic-light text-sm hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
