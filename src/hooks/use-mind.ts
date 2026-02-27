"use client"

import { useState, useEffect, useCallback } from "react"
import type { MindItem, MindItemType } from "@/lib/types"

interface TagCount {
  tag: string
  count: number
}

interface SearchResult {
  item: MindItem
  similarity: number
}

export function useMindItems(typeFilter: MindItemType | null, tagFilter: string | null) {
  const [items, setItems] = useState<MindItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set("type", typeFilter)
      if (tagFilter) params.set("tag", tagFilter)
      params.set("limit", "50")

      const res = await fetch(`/api/mind/items?${params}`)
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setItems(json.data)
          setTotal(json.meta?.total ?? json.data.length)
        }
      }
    } catch {
      // Silent fail — items stay empty
    } finally {
      setLoading(false)
    }
  }, [typeFilter, tagFilter])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { items, loading, total, refetch: fetchItems }
}

export function useMindTags() {
  const [tags, setTags] = useState<TagCount[]>([])

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/mind/tags")
        if (res.ok) {
          const json = await res.json()
          if (json.success) setTags(json.data)
        }
      } catch {
        // Silent fail
      }
    }
    fetchTags()
  }, [])

  return tags
}

export function useMindSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const res = await fetch(`/api/mind/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const json = await res.json()
        if (json.success) setResults(json.data)
      }
    } catch {
      // Silent fail
    } finally {
      setSearching(false)
    }
  }, [])

  return { query, setQuery, results, searching, search }
}

const GRAPH_ITEM_LIMIT = 500

export function useMindAllItems(enabled: boolean) {
  const [items, setItems] = useState<MindItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return

    async function fetchAll() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("limit", String(GRAPH_ITEM_LIMIT))
        const res = await fetch(`/api/mind/items?${params}`)
        if (res.ok) {
          const json = await res.json()
          if (json.success) setItems(json.data)
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [enabled])

  return { items, loading }
}

export function useMindSave(onSaved: () => void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = useCallback(
    async (input: { url?: string; content?: string; title?: string; type?: string }) => {
      setSaving(true)
      setError(null)
      try {
        const res = await fetch("/api/mind/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
        const json = await res.json()
        if (json.success) {
          onSaved()
          return json.data as MindItem
        }
        setError(json.error ?? "Failed to save")
        return null
      } catch {
        setError("Network error")
        return null
      } finally {
        setSaving(false)
      }
    },
    [onSaved],
  )

  return { save, saving, error }
}
