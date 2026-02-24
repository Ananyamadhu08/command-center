import { Oval } from "react-loader-spinner"

interface LoaderProps {
  label?: string
  className?: string
  size?: "sm" | "md"
}

const SIZES = { sm: 24, md: 36 } as const

export function Loader({ label, className = "", size = "md" }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <Oval
        height={SIZES[size]}
        width={SIZES[size]}
        color="var(--color-cosmic-light)"
        secondaryColor="rgba(255,255,255,0.1)"
        strokeWidth={3}
        strokeWidthSecondary={3}
      />
      {label && <p className="text-xs text-white/30">{label}</p>}
    </div>
  )
}
