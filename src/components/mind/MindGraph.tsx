"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from "d3-force"
import { buildGraphData } from "@/lib/mind/graph"
import { MindGraphTooltip } from "./MindGraphTooltip"
import { MIND_TYPE_CONFIG } from "@/lib/types"
import type { MindItem } from "@/lib/types"
import type { Simulation, SimulationNodeDatum, SimulationLinkDatum } from "d3-force"

interface SimNode extends SimulationNodeDatum {
  id: string
  item: MindItem
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: SimNode | string
  target: SimNode | string
}

interface MindGraphProps {
  items: MindItem[]
  loading: boolean
  onItemClick: (item: MindItem) => void
}

const NODE_RADIUS = 6
const NODE_RADIUS_HOVER = 8

export function MindGraph({ items, loading, onItemClick }: MindGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null)
  const nodesRef = useRef<SimNode[]>([])
  const linksRef = useRef<SimLink[]>([])
  const hoveredRef = useRef<SimNode | null>(null)
  const animRef = useRef<number>(0)
  const dimsRef = useRef({ width: 0, height: 0 })
  const simRunningRef = useRef(true)
  const drawRef = useRef<() => void>(() => {})

  const [tooltipItem, setTooltipItem] = useState<MindItem | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Connected edge set for hover highlighting
  const connectedRef = useRef<Set<string>>(new Set())

  const updateConnected = useCallback((node: SimNode | null) => {
    const next = new Set<string>()
    if (node) {
      for (const link of linksRef.current) {
        const s = typeof link.source === "object" ? link.source.id : link.source
        const t = typeof link.target === "object" ? link.target.id : link.target
        if (s === node.id || t === node.id) {
          next.add(`${s}:${t}`)
        }
      }
    }
    connectedRef.current = next
  }, [])

  // Request a single redraw for hover interactions after simulation settles
  const requestDraw = useCallback(() => {
    if (!simRunningRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = requestAnimationFrame(() => drawRef.current())
    }
  }, [])

  // Initialize simulation when items change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || items.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    simRunningRef.current = true

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      dimsRef.current = { width: rect.width, height: rect.height }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame()
    }

    function drawFrame() {
      if (!ctx) return
      const { width: cw, height: ch } = dimsRef.current
      ctx.clearRect(0, 0, cw, ch)

      const hovered = hoveredRef.current
      const connected = connectedRef.current
      const currentLinks = linksRef.current
      const currentNodes = nodesRef.current

      // Draw edges
      for (const link of currentLinks) {
        const s = link.source as SimNode
        const t = link.target as SimNode
        if (s.x == null || s.y == null || t.x == null || t.y == null) continue

        const edgeKey = `${s.id}:${t.id}`
        const isConnected = hovered != null && connected.has(edgeKey)

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(t.x, t.y)
        ctx.strokeStyle = isConnected
          ? "rgba(255, 255, 255, 0.25)"
          : "rgba(255, 255, 255, 0.06)"
        ctx.lineWidth = isConnected ? 1.5 : 1
        ctx.stroke()
      }

      // Draw nodes
      for (const node of currentNodes) {
        if (node.x == null || node.y == null) continue

        const isHovered = hovered?.id === node.id
        const r = isHovered ? NODE_RADIUS_HOVER : NODE_RADIUS
        const color = MIND_TYPE_CONFIG[node.item.type].color

        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? color : hexToRgba(color, 0.8)
        ctx.fill()

        if (isHovered) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(color, 0.15)
          ctx.fill()
        }
      }
    }

    // Store drawFrame in ref so requestDraw can access it
    drawRef.current = drawFrame

    resize()

    const { nodes, edges } = buildGraphData(items)
    const { width: w, height: h } = dimsRef.current

    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      x: w / 2 + (Math.random() - 0.5) * w * 0.6,
      y: h / 2 + (Math.random() - 0.5) * h * 0.6,
    }))

    const simLinks: SimLink[] = edges.map((e) => ({
      source: e.source,
      target: e.target,
    }))

    nodesRef.current = simNodes
    linksRef.current = simLinks

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(80)
          .strength(0.3),
      )
      .force("charge", forceManyBody<SimNode>().strength(-150))
      .force("center", forceCenter<SimNode>(w / 2, h / 2))
      .force("collide", forceCollide<SimNode>(12))
      .alphaDecay(0.02)

    simRef.current = sim

    // Draw on each simulation tick — stops automatically when simulation cools
    sim.on("tick", drawFrame)

    sim.on("end", () => {
      simRunningRef.current = false
    })

    // Use ResizeObserver for container resize
    const observer = new ResizeObserver(() => resize())
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(animRef.current)
      sim.stop()
      observer.disconnect()
    }
  }, [items])

  // Mouse interactions — trigger redraw on hover changes
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      let closest: SimNode | null = null
      let closestDist = 20

      for (const node of nodesRef.current) {
        if (node.x == null || node.y == null) continue
        const dx = node.x - mx
        const dy = node.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < closestDist) {
          closest = node
          closestDist = dist
        }
      }

      const prevHovered = hoveredRef.current
      hoveredRef.current = closest
      updateConnected(closest)

      if (closest) {
        setTooltipItem(closest.item)
        setTooltipPos({ x: e.clientX, y: e.clientY })
        canvas.style.cursor = "pointer"
      } else {
        setTooltipItem(null)
        canvas.style.cursor = "default"
      }

      // Redraw if hover state changed and simulation is settled
      if (prevHovered?.id !== closest?.id) {
        requestDraw()
      }
    },
    [updateConnected, requestDraw],
  )

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = null
    updateConnected(null)
    setTooltipItem(null)
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default"
    }
    requestDraw()
  }, [updateConnected, requestDraw])

  const handleClick = useCallback(() => {
    const hovered = hoveredRef.current
    if (hovered) {
      onItemClick(hovered.item)
    }
  }, [onItemClick])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-xs text-white/20 font-mono">Loading graph...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-xs text-white/20 font-mono">
          No items to visualize
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/[0.04]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      <MindGraphTooltip item={tooltipItem} x={tooltipPos.x} y={tooltipPos.y} />
    </div>
  )
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex || hex.length < 7) return `rgba(128, 128, 128, ${alpha})`
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(128, 128, 128, ${alpha})`
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
