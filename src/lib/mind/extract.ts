/**
 * Content extraction utilities for The Mind.
 * Extracts readable text from URLs and detects content types.
 */

export function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace("www.", "")
  } catch {
    return null
  }
}

export function detectLanguage(code: string): string {
  const patterns: [RegExp, string][] = [
    [/^\s*(import|export|const|let|var|function|class)\b/m, "javascript"],
    [/^\s*(interface|type|enum)\s+\w+/m, "typescript"],
    [/^\s*(def|class|import|from|print)\b/m, "python"],
    [/^\s*(func|package|import|type|struct)\b/m, "go"],
    [/^\s*(fn|let|mut|use|impl|pub)\b/m, "rust"],
    [/^\s*<[a-zA-Z][^>]*>/m, "html"],
    [/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\b/im, "sql"],
    [/^\s*\{[\s\S]*"[^"]+"\s*:/m, "json"],
    [/^\s*(apiVersion|kind|metadata):/m, "yaml"],
    [/^\s*#!\s*\/bin\/(bash|sh|zsh)/m, "bash"],
  ]

  for (const [pattern, lang] of patterns) {
    if (pattern.test(code)) return lang
  }
  return "text"
}

export function detectContentType(input: {
  url?: string | null
  content?: string | null
  image_url?: string | null
  type?: string | null
}): "article" | "highlight" | "image" | "code" | "thought" | "screenshot" {
  if (input.type && ["article", "highlight", "image", "code", "thought", "screenshot"].includes(input.type)) {
    return input.type as ReturnType<typeof detectContentType>
  }

  if (input.image_url) return "image"

  if (input.url) {
    const url = input.url.toLowerCase()
    if (/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/.test(url)) return "image"
    return "article"
  }

  if (input.content) {
    const trimmed = input.content.trim()
    const codeIndicators = [
      /^(import|export|const|let|var|function|class|def|func|fn|package)\b/m,
      /[{}\[\]];?\s*$/m,
      /^\s*\/\//m,
      /^\s*#\s*(include|define|pragma)/m,
    ]
    const isCode = codeIndicators.some((p) => p.test(trimmed))
    if (isCode) return "code"

    if (trimmed.length < 280) return "thought"
  }

  return "thought"
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}

export function extractKeywords(text: string, count: number = 8): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "above", "below", "between", "out", "off", "over",
    "under", "again", "further", "then", "once", "here", "there", "when",
    "where", "why", "how", "all", "each", "every", "both", "few", "more",
    "most", "other", "some", "such", "no", "not", "only", "own", "same",
    "so", "than", "too", "very", "just", "because", "but", "and", "or",
    "if", "while", "about", "this", "that", "these", "those", "it", "its",
    "i", "me", "my", "we", "our", "you", "your", "he", "she", "they",
    "them", "his", "her", "their", "what", "which", "who", "whom",
  ])

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))

  const freq = new Map<string, number>()
  for (const w of words) {
    freq.set(w, (freq.get(w) ?? 0) + 1)
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word)
}
