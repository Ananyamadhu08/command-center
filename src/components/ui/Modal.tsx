"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  wide?: boolean
}

export function Modal({ isOpen, onClose, title, children, wide = false }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal panel */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full max-h-[85vh] overflow-hidden rounded-2xl ${wide ? "max-w-2xl" : "max-w-lg"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer glow border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/[0.15] via-white/[0.06] to-white/[0.03]" />

            {/* Glass container */}
            <div
              className="relative rounded-2xl overflow-hidden backdrop-blur-3xl"
              style={{
                background: "rgba(14, 14, 26, 0.15)",
              }}
            >
              {/* Subtle top highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="relative flex items-center justify-between px-6 pt-5 pb-3">
                <h2 className="text-[15px] font-semibold text-white/95 truncate pr-4">{title}</h2>
                <button
                  onClick={onClose}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pt-1 pb-6 max-h-[calc(85vh-60px)] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
