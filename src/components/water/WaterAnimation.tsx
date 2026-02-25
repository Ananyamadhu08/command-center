"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Droplets } from "lucide-react"

interface WaterAnimationProps {
  active: boolean
}

export function WaterAnimation({ active }: WaterAnimationProps) {
  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Main water drop */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0"
            initial={{ y: -15, opacity: 0, scale: 0.6 }}
            animate={{ y: 80, opacity: [0, 1, 1, 0.6, 0], scale: [0.6, 1, 0.9, 0.7, 0.3] }}
            transition={{ duration: 0.65, ease: "easeIn" }}
          >
            <Droplets size={18} className="text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
          </motion.div>

          {/* Trailing smaller drops */}
          {[
            { x: -6, delay: 0.08, size: 4 },
            { x: 4, delay: 0.15, size: 3 },
            { x: -3, delay: 0.22, size: 2.5 },
          ].map((drop, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0 rounded-full bg-sky-400/70"
              style={{ width: drop.size, height: drop.size * 1.4, marginLeft: drop.x }}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 85, opacity: [0, 0.8, 0.6, 0] }}
              transition={{ duration: 0.6, delay: drop.delay, ease: "easeIn" }}
            />
          ))}

          {/* Splash particles on impact */}
          {[
            { x: -18, y: -12, angle: -40 },
            { x: -10, y: -18, angle: -25 },
            { x: 0, y: -20, angle: 0 },
            { x: 10, y: -18, angle: 25 },
            { x: 18, y: -12, angle: 40 },
            { x: -14, y: -8, angle: -50 },
            { x: 14, y: -8, angle: 50 },
          ].map((p, i) => (
            <motion.div
              key={`splash-${i}`}
              className="absolute left-1/2 rounded-full bg-sky-300/80"
              style={{ bottom: "38%", width: 3, height: 3 }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [0, 0, 1, 0],
                scale: [0, 0, 1.2, 0],
              }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Water ring ripple */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 border border-sky-400/40 rounded-full"
            style={{ bottom: "36%" }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: [0, 30, 50],
              height: [0, 8, 14],
              opacity: [0, 0.6, 0],
              x: [-15, -25],
            }}
            transition={{ duration: 0.5, delay: 0.52, ease: "easeOut" }}
          />

          {/* Second ripple */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 border border-sky-300/25 rounded-full"
            style={{ bottom: "35%" }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: [0, 40, 65],
              height: [0, 10, 18],
              opacity: [0, 0.4, 0],
              x: [-20, -32],
            }}
            transition={{ duration: 0.55, delay: 0.6, ease: "easeOut" }}
          />

          {/* Brief glow on impact */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-sky-400/20 blur-md"
            style={{ bottom: "35%", width: 30, height: 12 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.3, 1.5] }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
