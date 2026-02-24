"use client"

import { motion } from "framer-motion"

export type PlantState = "dead" | "wilted" | "dry" | "healthy" | "thriving"

interface PlantProps {
  state: PlantState
  size?: "sm" | "lg"
}

const SWAY_AMOUNT: Record<PlantState, number> = {
  dead: 0,
  wilted: 0.3,
  dry: 0.8,
  healthy: 1.5,
  thriving: 2,
}

export function Plant({ state, size = "lg" }: PlantProps) {
  const dim = size === "sm" ? 72 : 180
  const sway = SWAY_AMOUNT[state]
  const isDead = state === "dead"
  const isWilted = state === "wilted"
  const isDry = state === "dry"
  const isHealthy = state === "healthy"
  const isThriving = state === "thriving"
  const isAlive = isHealthy || isThriving

  // Progressive values
  const stemHeight = isDead ? 20 : isWilted ? 30 : isDry ? 42 : 55
  const leafSize = isDead ? 0.3 : isWilted ? 0.5 : isDry ? 0.75 : 1
  const leafOpacity = isDead ? 0.4 : isWilted ? 0.6 : isDry ? 0.8 : 1
  const saturation = isDead ? 0 : isWilted ? 0.4 : isDry ? 0.7 : 1

  return (
    <motion.svg
      width={dim}
      height={dim}
      viewBox="0 0 180 180"
      fill="none"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <defs>
        {/* Pot gradient — warm peach-salmon terracotta, left-to-right for 3D */}
        <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0%" stopColor="#daac7e" />
          <stop offset="35%" stopColor="#d09e6e" />
          <stop offset="65%" stopColor="#c49060" />
          <stop offset="100%" stopColor="#b48254" />
        </linearGradient>
        {/* Rim top surface — slightly lighter, catches overhead light */}
        <linearGradient id="rimTopGrad" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#e4b890" />
          <stop offset="50%" stopColor="#daac82" />
          <stop offset="100%" stopColor="#d0a076" />
        </linearGradient>

        {/* Soil gradient */}
        <radialGradient id="soilGrad" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#5a4030" />
          <stop offset="100%" stopColor="#3a2818" />
        </radialGradient>

        {/* Stem gradient */}
        <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={isDead ? "#4a3020" : `hsl(${100 + saturation * 20}, ${30 + saturation * 40}%, ${20 + saturation * 15}%)`} />
          <stop offset="100%" stopColor={isDead ? "#5a3828" : `hsl(${110 + saturation * 15}, ${35 + saturation * 45}%, ${25 + saturation * 20}%)`} />
        </linearGradient>

        {/* Leaf gradients */}
        <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isDead ? "#5c4a3a" : `hsl(${100 + saturation * 30}, ${20 + saturation * 55}%, ${30 + saturation * 25}%)`} />
          <stop offset="50%" stopColor={isDead ? "#4a3828" : `hsl(${110 + saturation * 25}, ${25 + saturation * 50}%, ${25 + saturation * 30}%)`} />
          <stop offset="100%" stopColor={isDead ? "#3a2e22" : `hsl(${105 + saturation * 20}, ${20 + saturation * 40}%, ${20 + saturation * 20}%)`} />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isDead ? "#5c4a3a" : `hsl(${105 + saturation * 30}, ${25 + saturation * 50}%, ${32 + saturation * 25}%)`} />
          <stop offset="100%" stopColor={isDead ? "#3a2e22" : `hsl(${110 + saturation * 20}, ${20 + saturation * 45}%, ${22 + saturation * 20}%)`} />
        </linearGradient>

        {/* Glow filter for healthy/thriving */}
        <filter id="leafGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.8  0 0 0 0 0.3  0 0 0 0.4 0" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft shadow for pot */}
        <filter id="potShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
        </filter>

        {/* Sparkle filter */}
        <filter id="sparkle">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Ambient ground glow for alive plants */}
      {isAlive && (
        <motion.ellipse
          cx={90}
          cy={172}
          rx={40}
          ry={6}
          fill={isThriving ? "rgba(50,200,80,0.08)" : "rgba(50,180,70,0.05)"}
          animate={{
            rx: [38, 44, 38],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* === TERRACOTTA POT === */}

      {/* Ground shadow */}
      <ellipse cx={90} cy={174} rx={36} ry={3} fill="rgba(0,0,0,0.08)" />

      {/* Saucer plate */}
      <ellipse cx={90} cy={170} rx={44} ry={4.5} fill="#b48660" />
      <ellipse cx={90} cy={169} rx={44} ry={4.5} fill="#d0a478" />
      <ellipse cx={90} cy={169} rx={38} ry={3.5} fill="#c49468" />

      {/* Pot — single continuous shape: straight-sided rim band + tapered body */}
      <path
        d="M56 125 L56 135 L76 166 Q90 171, 104 166 L124 135 L124 125 Z"
        fill="url(#potGrad)"
        filter="url(#potShadow)"
      />

      {/* Subtle rim-body junction shadow (rim's overhang casts a thin shadow) */}
      <path
        d="M57 135 Q90 137.5, 123 135"
        stroke="rgba(80,45,20,0.18)"
        strokeWidth={0.8}
        fill="none"
      />

      {/* Body left highlight for 3D roundness */}
      <path
        d="M60 137 L77 164"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Rim top surface — catches overhead light */}
      <ellipse cx={90} cy={125} rx={34} ry={5} fill="url(#rimTopGrad)" />

      {/* Rim inner edge */}
      <ellipse cx={90} cy={127} rx={30} ry={4} fill="#be9468" />

      {/* Rim highlight arc */}
      <path
        d="M58 124 Q90 119.5, 122 124"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={0.8}
        strokeLinecap="round"
        fill="none"
      />

      {/* Soil inside pot */}
      <ellipse cx={90} cy={133} rx={28} ry={4.5} fill="url(#soilGrad)" />
      {/* Soil texture */}
      {[72, 80, 87, 94, 101, 108].map((x, i) => (
        <circle key={i} cx={x} cy={133 + (i % 2 ? -1 : 0.5)} r={0.8} fill="rgba(80,55,35,0.5)" />
      ))}

      {/* Main plant group with sway */}
      <motion.g
        animate={sway > 0 ? { rotate: [-sway, sway, -sway] } : {}}
        transition={sway > 0 ? { duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ transformOrigin: "90px 133px" }}
      >
        {/* Stem — organic curve */}
        <motion.path
          d={`M90 133 Q${isDead ? "90" : "87"} ${133 - stemHeight * 0.5} 90 ${133 - stemHeight}`}
          stroke="url(#stemGrad)"
          strokeWidth={isDead ? 2.5 : 3.5}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Secondary stem (healthy+) */}
        {isAlive && (
          <motion.path
            d={`M90 ${133 - stemHeight * 0.4} Q95 ${133 - stemHeight * 0.6} 98 ${133 - stemHeight * 0.8}`}
            stroke="url(#stemGrad)"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        )}

        {/* Left leaf cluster */}
        <motion.g
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: leafOpacity, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          filter={isAlive ? "url(#leafGlow)" : undefined}
        >
          {/* Main left leaf */}
          <motion.path
            d={`M90 ${133 - stemHeight + 8} 
                C${75 - leafSize * 5} ${133 - stemHeight - 5}, 
                 ${55 - leafSize * 8} ${133 - stemHeight + 2}, 
                 ${60 - leafSize * 5} ${133 - stemHeight + (isDead ? 18 : isWilted ? 14 : 8)}`}
            fill="url(#leafGrad1)"
            stroke={isDead ? "none" : `hsla(${110 + saturation * 20}, ${40 + saturation * 30}%, ${35 + saturation * 15}%, 0.5)`}
            strokeWidth={0.5}
          />
          {/* Leaf vein */}
          {!isDead && (
            <path
              d={`M88 ${133 - stemHeight + 9} Q${70 - leafSize * 3} ${133 - stemHeight + 2} ${64 - leafSize * 3} ${133 - stemHeight + (isWilted ? 13 : 8)}`}
              stroke={`hsla(${120 + saturation * 15}, ${30 + saturation * 30}%, ${40 + saturation * 20}%, 0.3)`}
              strokeWidth={0.7}
              fill="none"
            />
          )}

          {/* Lower left leaf (dry+) */}
          {(isDry || isHealthy || isThriving) && (
            <motion.path
              d={`M90 ${133 - stemHeight * 0.5 + 4} 
                  C${72} ${133 - stemHeight * 0.5 - 2}, 
                   ${60} ${133 - stemHeight * 0.5 + 6}, 
                   ${65} ${133 - stemHeight * 0.5 + 12}`}
              fill="url(#leafGrad2)"
              opacity={0.7 * leafSize}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ transformOrigin: `90px ${133 - stemHeight * 0.5 + 4}px` }}
            />
          )}
        </motion.g>

        {/* Right leaf cluster */}
        <motion.g
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: leafOpacity, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          filter={isAlive ? "url(#leafGlow)" : undefined}
        >
          {/* Main right leaf */}
          <motion.path
            d={`M90 ${133 - stemHeight + 4} 
                C${105 + leafSize * 5} ${133 - stemHeight - 10}, 
                 ${125 + leafSize * 8} ${133 - stemHeight - 2}, 
                 ${120 + leafSize * 5} ${133 - stemHeight + (isDead ? 16 : isWilted ? 12 : 5)}`}
            fill="url(#leafGrad2)"
            stroke={isDead ? "none" : `hsla(${110 + saturation * 20}, ${40 + saturation * 30}%, ${35 + saturation * 15}%, 0.5)`}
            strokeWidth={0.5}
          />
          {/* Leaf vein */}
          {!isDead && (
            <path
              d={`M92 ${133 - stemHeight + 5} Q${110 + leafSize * 3} ${133 - stemHeight - 3} ${118 + leafSize * 3} ${133 - stemHeight + (isWilted ? 11 : 5)}`}
              stroke={`hsla(${120 + saturation * 15}, ${30 + saturation * 30}%, ${40 + saturation * 20}%, 0.3)`}
              strokeWidth={0.7}
              fill="none"
            />
          )}

          {/* Lower right leaf (dry+) */}
          {(isDry || isHealthy || isThriving) && (
            <motion.path
              d={`M90 ${133 - stemHeight * 0.6 + 2} 
                  C${108} ${133 - stemHeight * 0.6 - 6}, 
                   ${122} ${133 - stemHeight * 0.6 + 2}, 
                   ${116} ${133 - stemHeight * 0.6 + 10}`}
              fill="url(#leafGrad1)"
              opacity={0.7 * leafSize}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ transformOrigin: `90px ${133 - stemHeight * 0.6 + 2}px` }}
            />
          )}
        </motion.g>

        {/* Top crown leaf (healthy+) */}
        {isAlive && (
          <motion.path
            d={`M90 ${133 - stemHeight} 
                C85 ${133 - stemHeight - 15}, 
                 80 ${133 - stemHeight - 20}, 
                 84 ${133 - stemHeight - 22}
                C88 ${133 - stemHeight - 18},
                 90 ${133 - stemHeight - 16},
                 90 ${133 - stemHeight}
                C90 ${133 - stemHeight - 16},
                 92 ${133 - stemHeight - 18},
                 96 ${133 - stemHeight - 22}
                C100 ${133 - stemHeight - 20},
                 95 ${133 - stemHeight - 15},
                 90 ${133 - stemHeight}`}
            fill="url(#leafGrad1)"
            filter="url(#leafGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
            style={{ transformOrigin: `90px ${133 - stemHeight}px` }}
          />
        )}

        {/* Flower for thriving */}
        {isThriving && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring", bounce: 0.4 }}
            style={{ transformOrigin: `90px ${133 - stemHeight - 24}px` }}
          >
            {/* Flower petals — layered for depth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const px = 90 + Math.cos(rad) * 9
              const py = 133 - stemHeight - 24 + Math.sin(rad) * 9
              return (
                <motion.ellipse
                  key={angle}
                  cx={px}
                  cy={py}
                  rx={5.5}
                  ry={3.5}
                  transform={`rotate(${angle}, ${px}, ${py})`}
                  fill={i % 2 === 0 ? "#f9a8d4" : "#fbb4d8"}
                  opacity={0.9}
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              )
            })}
            {/* Inner petals */}
            {[30, 90, 150, 210, 270, 330].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const px = 90 + Math.cos(rad) * 5
              const py = 133 - stemHeight - 24 + Math.sin(rad) * 5
              return (
                <ellipse
                  key={`inner-${angle}`}
                  cx={px}
                  cy={py}
                  rx={3}
                  ry={2}
                  transform={`rotate(${angle}, ${px}, ${py})`}
                  fill="#fce7f3"
                  opacity={0.7}
                />
              )
            })}
            {/* Center */}
            <circle cx={90} cy={133 - stemHeight - 24} r={4} fill="#fbbf24" />
            <circle cx={90} cy={133 - stemHeight - 24} r={2.5} fill="#f59e0b" />
            <circle cx={89} cy={133 - stemHeight - 25} r={1} fill="rgba(255,255,255,0.4)" />
          </motion.g>
        )}

        {/* Dewdrops on leaves (healthy+) */}
        {isAlive && (
          <>
            <motion.circle
              cx={75}
              cy={133 - stemHeight + 5}
              r={1.8}
              fill="rgba(150,220,255,0.5)"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                r: [1.5, 2, 1.5],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx={108}
              cy={133 - stemHeight + 2}
              r={1.5}
              fill="rgba(150,220,255,0.4)"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                r: [1.2, 1.7, 1.2],
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            />
          </>
        )}
      </motion.g>

      {/* Sparkle particles for thriving */}
      {isThriving && (
        <>
          {[
            { x: 65, y: 60, delay: 0 },
            { x: 115, y: 55, delay: 0.8 },
            { x: 75, y: 45, delay: 1.6 },
            { x: 105, y: 70, delay: 2.4 },
            { x: 90, y: 40, delay: 0.4 },
          ].map((spark, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={spark.x}
                cy={spark.y}
                r={1.2}
                fill="#fbbf24"
                filter="url(#sparkle)"
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.2, 0.5],
                  y: [spark.y, spark.y - 8, spark.y],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: spark.delay,
                  ease: "easeInOut",
                }}
              />
              {/* Star cross */}
              <motion.path
                d={`M${spark.x - 3} ${spark.y} L${spark.x + 3} ${spark.y} M${spark.x} ${spark.y - 3} L${spark.x} ${spark.y + 3}`}
                stroke="#fbbf24"
                strokeWidth={0.5}
                opacity={0.6}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: spark.delay,
                  ease: "easeInOut",
                }}
              />
            </motion.g>
          ))}
        </>
      )}

      {/* Dead state — dried soil cracks */}
      {isDead && (
        <>
          <line x1="82" y1="131" x2="86" y2="135" stroke="rgba(60,40,25,0.5)" strokeWidth={0.5} />
          <line x1="95" y1="132" x2="98" y2="134" stroke="rgba(60,40,25,0.5)" strokeWidth={0.5} />
          <line x1="88" y1="130" x2="88" y2="134" stroke="rgba(60,40,25,0.4)" strokeWidth={0.4} />
        </>
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
