import type { MindItem } from "@/lib/types"

export interface GraphNode {
  id: string
  item: MindItem
  x: number
  y: number
  vx: number
  vy: number
}

export interface GraphEdge {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// Cap pairwise connections per tag to avoid O(n^2) explosion on popular tags
const MAX_ITEMS_PER_TAG = 20

export function buildGraphData(items: MindItem[]): GraphData {
  const nodes: GraphNode[] = items.map((item) => ({
    id: item.id,
    item,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  }))

  // Build tag-to-item index
  const tagIndex = new Map<string, string[]>()
  for (const item of items) {
    for (const tag of item.tags) {
      const existing = tagIndex.get(tag) ?? []
      tagIndex.set(tag, [...existing, item.id])
    }
  }

  // Connect items that share tags (deduplicated, capped per tag)
  const edgeSet = new Set<string>()
  const edges: GraphEdge[] = []

  for (const itemIds of tagIndex.values()) {
    const capped = itemIds.length > MAX_ITEMS_PER_TAG
      ? itemIds.slice(0, MAX_ITEMS_PER_TAG)
      : itemIds

    for (let i = 0; i < capped.length; i++) {
      for (let j = i + 1; j < capped.length; j++) {
        const key = capped[i] < capped[j]
          ? `${capped[i]}:${capped[j]}`
          : `${capped[j]}:${capped[i]}`

        if (!edgeSet.has(key)) {
          edgeSet.add(key)
          edges.push({ source: capped[i], target: capped[j] })
        }
      }
    }
  }

  return { nodes, edges }
}
