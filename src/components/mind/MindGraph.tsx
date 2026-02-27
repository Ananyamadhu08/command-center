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

interface Transform {
  x: number
  y: number
  scale: number
}

const NODE_RADIUS = 6
const NODE_RADIUS_HOVER = 8
const MIN_ZOOM = 0.15
const MAX_ZOOM = 4
const ZOOM_SENSITIVITY = 0.002

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

  // Camera transform: pan + zoom
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: 1 })

  // Drag state
  const dragRef = useRef<{
    active: boolean
    type: "pan" | "node" | null
    node: SimNode | null
    startX: number
    startY: number
    moved: boolean
  }>({ active: false, type: null, node: null, startX: 0, startY: 0, moved: false })

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

  // Convert screen coordinates to world (simulation) coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const t = transformRef.current
    return {
      x: (screenX - t.x) / t.scale,
      y: (screenY - t.y) / t.scale,
    }
  }, [])

  // Find nearest node within snap distance (in world coords)
  const findNode = useCallback((worldX: number, worldY: number, snapDist: number) => {
    let closest: SimNode | null = null
    let closestDist = snapDist

    for (const node of nodesRef.current) {
      if (node.x == null || node.y == null) continue
      const dx = node.x - worldX
      const dy = node.y - worldY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < closestDist) {
        closest = node
        closestDist = dist
      }
    }
    return closest
  }, [])

  // Request a single redraw for interactions after simulation settles
  const requestDraw = useCallback(() => {
    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(() => drawRef.current())
  }, [])

  // Initialize simulation when items change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || items.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    simRunningRef.current = true

    // Reset transform for new data
    transformRef.current = { x: 0, y: 0, scale: 1 }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      dimsRef.current = { width: rect.width, height: rect.height }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      drawFrame()
    }

    function drawFrame() {
      if (!ctx) return
      const { width: cw, height: ch } = dimsRef.current
      const dprLocal = window.devicePixelRatio || 1
      const t = transformRef.current

      // Reset transform and clear
      ctx.setTransform(dprLocal, 0, 0, dprLocal, 0, 0)
      ctx.clearRect(0, 0, cw, ch)

      // Apply camera transform
      ctx.setTransform(
        dprLocal * t.scale,
        0,
        0,
        dprLocal * t.scale,
        dprLocal * t.x,
        dprLocal * t.y,
      )

      const hovered = hoveredRef.current
      const connected = connectedRef.current
      const currentLinks = linksRef.current
      const currentNodes = nodesRef.current

      // Draw edges
      for (const link of currentLinks) {
        const s = link.source as SimNode
        const tgt = link.target as SimNode
        if (s.x == null || s.y == null || tgt.x == null || tgt.y == null) continue

        const edgeKey = `${s.id}:${tgt.id}`
        const isConnected = hovered != null && connected.has(edgeKey)

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tgt.x, tgt.y)
        ctx.strokeStyle = isConnected
          ? "rgba(255, 255, 255, 0.35)"
          : "rgba(255, 255, 255, 0.15)"
        ctx.lineWidth = (isConnected ? 1.5 : 1) / t.scale
        ctx.stroke()
      }

      // Draw nodes
      for (const node of currentNodes) {
        if (node.x == null || node.y == null) continue

        const isHovered = hovered?.id === node.id
        const isDragged = dragRef.current.node?.id === node.id
        const r = (isHovered || isDragged ? NODE_RADIUS_HOVER : NODE_RADIUS) / t.scale
        const color = MIND_TYPE_CONFIG[node.item.type].color

        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = (isHovered || isDragged) ? color : hexToRgba(color, 0.8)
        ctx.fill()

        if (isHovered || isDragged) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, r + 4 / t.scale, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(color, 0.15)
          ctx.fill()
        }
      }

      // Draw labels in screen space so text stays crisp at any zoom
      const LABEL_ZOOM_START = 0.8
      const LABEL_ZOOM_FULL = 1.5

      if (t.scale > LABEL_ZOOM_START) {
        const labelAlpha = Math.min(1, (t.scale - LABEL_ZOOM_START) / (LABEL_ZOOM_FULL - LABEL_ZOOM_START))

        // Switch to screen-space transform for crisp text
        ctx.setTransform(dprLocal, 0, 0, dprLocal, 0, 0)
        ctx.font = `500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "top"

        for (const node of currentNodes) {
          if (node.x == null || node.y == null) continue

          const isHovered = hovered?.id === node.id
          const isDragged = dragRef.current.node?.id === node.id
          const fullLabel = node.item.title ?? node.item.content?.slice(0, 40) ?? ""
          if (!fullLabel) continue

          // Truncate with ellipsis instead of squishing
          const label = truncateLabel(ctx, fullLabel, 140)

          // Convert world position to screen position
          const screenX = node.x * t.scale + t.x
          const screenY = node.y * t.scale + t.y
          const nodeR = (isHovered || isDragged) ? NODE_RADIUS_HOVER : NODE_RADIUS
          const labelY = screenY + nodeR + 4

          const alpha = (isHovered || isDragged) ? 0.9 : labelAlpha * 0.6

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fillText(label, screenX, labelY)
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

    sim.on("tick", drawFrame)
    sim.on("end", () => {
      simRunningRef.current = false
    })

    // --- Wheel zoom (toward cursor) ---
    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const t = transformRef.current
      const delta = -e.deltaY * ZOOM_SENSITIVITY
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.scale * (1 + delta)))
      const ratio = newScale / t.scale

      // Zoom toward cursor: keep the world point under the cursor fixed
      transformRef.current = {
        x: mouseX - (mouseX - t.x) * ratio,
        y: mouseY - (mouseY - t.y) * ratio,
        scale: newScale,
      }

      requestDraw()
    }

    // --- Mouse down: start pan or node drag ---
    function handleMouseDown(e: MouseEvent) {
      if (!canvas || e.button !== 0) return

      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      const world = screenToWorld(sx, sy)

      const snapDist = 20 / transformRef.current.scale
      const node = findNode(world.x, world.y, snapDist)

      if (node) {
        // Start node drag
        dragRef.current = { active: true, type: "node", node, startX: sx, startY: sy, moved: false }
        // Pin the node
        node.fx = node.x
        node.fy = node.y
        // Reheat simulation gently
        sim.alphaTarget(0.3).restart()
        simRunningRef.current = true
      } else {
        // Start pan
        dragRef.current = { active: true, type: "pan", node: null, startX: sx, startY: sy, moved: false }
      }

      canvas.style.cursor = node ? "grabbing" : "grabbing"
    }

    // --- Mouse move: pan or drag node ---
    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      const drag = dragRef.current

      if (drag.active) {
        const dx = sx - drag.startX
        const dy = sy - drag.startY

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          drag.moved = true
        }

        if (drag.type === "pan") {
          const t = transformRef.current
          transformRef.current = {
            ...t,
            x: t.x + (sx - drag.startX),
            y: t.y + (sy - drag.startY),
          }
          drag.startX = sx
          drag.startY = sy
          requestDraw()
        } else if (drag.type === "node" && drag.node) {
          const world = screenToWorld(sx, sy)
          drag.node.fx = world.x
          drag.node.fy = world.y
          // Simulation tick will redraw
        }

        // Hide tooltip while dragging
        setTooltipItem(null)
        return
      }

      // Not dragging — do hover detection
      const world = screenToWorld(sx, sy)
      const snapDist = 20 / transformRef.current.scale
      const closest = findNode(world.x, world.y, snapDist)

      const prevHovered = hoveredRef.current
      hoveredRef.current = closest
      updateConnected(closest)

      if (closest) {
        setTooltipItem(closest.item)
        setTooltipPos({ x: e.clientX, y: e.clientY })
        canvas.style.cursor = "pointer"
      } else {
        setTooltipItem(null)
        canvas.style.cursor = "grab"
      }

      if (prevHovered?.id !== closest?.id) {
        requestDraw()
      }
    }

    // --- Mouse up: end drag ---
    function handleMouseUp(e: MouseEvent) {
      if (!canvas) return

      const drag = dragRef.current

      if (drag.active && drag.type === "node" && drag.node) {
        // Unpin the node so simulation can move it naturally
        drag.node.fx = null
        drag.node.fy = null
        sim.alphaTarget(0)
      }

      // If it was a click (no significant movement) on a node, open detail
      if (drag.active && !drag.moved && drag.type === "node" && drag.node) {
        onItemClick(drag.node.item)
      }

      dragRef.current = { active: false, type: null, node: null, startX: 0, startY: 0, moved: false }
      canvas.style.cursor = "grab"
    }

    function handleMouseLeave() {
      if (!canvas) return

      const drag = dragRef.current
      if (drag.active && drag.type === "node" && drag.node) {
        drag.node.fx = null
        drag.node.fy = null
        sim.alphaTarget(0)
      }

      dragRef.current = { active: false, type: null, node: null, startX: 0, startY: 0, moved: false }
      hoveredRef.current = null
      updateConnected(null)
      setTooltipItem(null)
      requestDraw()
    }

    // Attach event listeners
    canvas.addEventListener("wheel", handleWheel, { passive: false })
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.style.cursor = "grab"

    const observer = new ResizeObserver(() => resize())
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(animRef.current)
      sim.stop()
      observer.disconnect()
      canvas.removeEventListener("wheel", handleWheel)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [items, screenToWorld, findNode, updateConnected, requestDraw, onItemClick])

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
      />
      <MindGraphTooltip item={tooltipItem} x={tooltipPos.x} y={tooltipPos.y} />
    </div>
  )
}

function truncateLabel(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text

  const ellipsis = "..."
  let truncated = text
  while (truncated.length > 0 && ctx.measureText(truncated + ellipsis).width > maxWidth) {
    truncated = truncated.slice(0, -1)
  }
  return truncated + ellipsis
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
