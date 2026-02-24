interface EmptyStateProps {
  message?: string
  className?: string
}

export function EmptyState({ message = "No data to display", className = "" }: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <p className="text-sm text-white/30">{message}</p>
    </div>
  )
}
