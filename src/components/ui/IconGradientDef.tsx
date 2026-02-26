"use client"

export function IconGradientDef() {
  return (
    <svg
      style={{ width: 0, height: 0, position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="icon-gradient"
          x1="0"
          y1="12"
          x2="24"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const gradientStroke = { stroke: "url(#icon-gradient)" } as const
