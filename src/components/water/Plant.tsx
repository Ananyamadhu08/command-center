"use client"

import { motion } from "framer-motion"

export type PlantState = "dead" | "wilted" | "dry" | "healthy" | "thriving"

interface PlantProps {
  state: PlantState
  size?: "sm" | "lg"
}

const PLANT_COLORS: Record<PlantState, { stem: string; leaf: string; pot: string; soil: string }> = {
  dead:     { stem: "#4a3728", leaf: "#5c4a3a", pot: "#6b5b4a", soil: "#3a2e22" },
  wilted:   { stem: "#7a8a50", leaf: "#8b9a5a", pot: "#8b6b4a", soil: "#4a3a2a" },
  dry:      { stem: "#6a9a40", leaf: "#7ab050", pot: "#8b6b4a", soil: "#4a3a2a" },
  healthy:  { stem: "#3a9a4a", leaf: "#4aba5a", pot: "#8b6b4a", soil: "#4a3a2a" },
  thriving: { stem: "#2a9a4a", leaf: "#3aca5a", pot: "#8b6b4a", soil: "#4a3a2a" },
}

const LEAF_DROOP: Record<PlantState, number> = {
  dead: 50,
  wilted: 30,
  dry: 15,
  healthy: 0,
  thriving: -5,
}

export function Plant({ state, size = "lg" }: PlantProps) {
  const colors = PLANT_COLORS[state]
  const droop = LEAF_DROOP[state]
  const dim = size === "sm" ? 64 : 160
  const scale = dim / 160

  const stemHeight = state === "dead" ? 25 : state === "wilted" ? 35 : 50
  const leafScale = state === "dead" ? 0.4 : state === "wilted" ? 0.6 : state === "dry" ? 0.8 : 1

  return (
    <motion.svg
      width={dim}
      height={dim}
      viewBox="0 0 160 160"
      fill="none"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Pot */}
      <motion.path
        d="M55 120 L60 145 Q80 152 100 145 L105 120 Z"
        fill={colors.pot}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={0.5}
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      />
      {/* Pot rim */}
      <rect x="50" y="116" width="60" height="6" rx="3" fill={colors.pot} opacity={0.8} />
      {/* Soil */}
      <ellipse cx="80" cy="120" rx="25" ry="4" fill={colors.soil} />

      {/* Stem */}
      <motion.line
        x1="80"
        y1="120"
        x2="80"
        initial={{ y2: 120 }}
        animate={{ y2: 120 - stemHeight }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        stroke={colors.stem}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Left leaf */}
      <motion.g
        initial={{ rotate: droop + 10, opacity: 0 }}
        animate={{ rotate: droop, opacity: leafScale }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ transformOrigin: "80px 90px" }}
      >
        <motion.path
          d={`M80 ${120 - stemHeight + 10} Q60 ${120 - stemHeight - 10} 50 ${120 - stemHeight + 5}`}
          stroke={colors.leaf}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
        <motion.ellipse
          cx={58}
          cy={120 - stemHeight}
          rx={14 * leafScale}
          ry={8 * leafScale}
          fill={colors.leaf}
          opacity={0.7}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </motion.g>

      {/* Right leaf */}
      <motion.g
        initial={{ rotate: -(droop + 10), opacity: 0 }}
        animate={{ rotate: -droop, opacity: leafScale }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: "80px 85px" }}
      >
        <motion.path
          d={`M80 ${120 - stemHeight + 5} Q100 ${120 - stemHeight - 15} 112 ${120 - stemHeight}`}
          stroke={colors.leaf}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
        <motion.ellipse
          cx={104}
          cy={120 - stemHeight - 3}
          rx={14 * leafScale}
          ry={8 * leafScale}
          fill={colors.leaf}
          opacity={0.7}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      </motion.g>

      {/* Top leaf (only healthy+) */}
      {(state === "healthy" || state === "thriving") && (
        <motion.ellipse
          cx={80}
          cy={120 - stemHeight - 8}
          rx={10}
          ry={6}
          fill={colors.leaf}
          opacity={0.8}
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      )}

      {/* Flower (thriving only) */}
      {state === "thriving" && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
          style={{ transformOrigin: `80px ${120 - stemHeight - 14}px` }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <motion.ellipse
              key={angle}
              cx={80 + Math.cos((angle * Math.PI) / 180) * 7}
              cy={120 - stemHeight - 14 + Math.sin((angle * Math.PI) / 180) * 7}
              rx={4}
              ry={3}
              fill="#f9a8d4"
              opacity={0.9}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: angle / 360,
              }}
            />
          ))}
          <circle cx={80} cy={120 - stemHeight - 14} r={3} fill="#fbbf24" />
        </motion.g>
      )}

      {/* Breathing animation for healthy/thriving */}
      {(state === "healthy" || state === "thriving") && (
        <motion.ellipse
          cx={80}
          cy={125}
          rx={30}
          ry={3}
          fill="rgba(74, 186, 90, 0.1)"
          animate={{
            rx: [28, 32, 28],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.svg>
  )
}

export function getPlantState(glasses: number): PlantState {
  if (glasses <= 1) return "dead"
  if (glasses <= 3) return "wilted"
  if (glasses <= 5) return "dry"
  if (glasses <= 7) return "healthy"
  return "thriving"
}
