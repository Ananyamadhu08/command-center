import { StarBackground } from "@/components/layout/StarBackground"

export default function BriefsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}
