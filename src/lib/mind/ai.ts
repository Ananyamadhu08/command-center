/**
 * AI processing for The Mind.
 * Summarization, auto-tagging, and embedding generation via OpenAI.
 * Falls back to basic heuristics when OPENAI_API_KEY is not set.
 */

import OpenAI from "openai"
import { truncate, extractKeywords } from "./extract"

function getClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY
  if (!key || key.includes("your-key")) return null
  return new OpenAI({ apiKey: key })
}

export async function generateSummary(content: string, title?: string | null): Promise<string> {
  const client = getClient()

  if (!client) {
    return truncate(content.replace(/\s+/g, " ").trim(), 200)
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the following content in 2-3 concise sentences. Be direct and informative.",
        },
        {
          role: "user",
          content: title ? `Title: ${title}\n\n${truncate(content, 4000)}` : truncate(content, 4000),
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    })
    return response.choices[0]?.message?.content?.trim() ?? truncate(content, 200)
  } catch {
    return truncate(content.replace(/\s+/g, " ").trim(), 200)
  }
}

export async function generateTags(content: string, title?: string | null): Promise<string[]> {
  const client = getClient()

  if (!client) {
    const text = [title, content].filter(Boolean).join(" ")
    return extractKeywords(text, 6)
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate 4-8 relevant tags for the following content. Return ONLY a JSON array of lowercase tag strings, nothing else. Example: [\"javascript\", \"react\", \"web-development\"]",
        },
        {
          role: "user",
          content: title ? `Title: ${title}\n\n${truncate(content, 3000)}` : truncate(content, 3000),
        },
      ],
      max_tokens: 100,
      temperature: 0.2,
    })

    const raw = response.choices[0]?.message?.content?.trim() ?? "[]"
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.toLowerCase().trim())
        .slice(0, 8)
    }
    return extractKeywords([title, content].filter(Boolean).join(" "), 6)
  } catch {
    return extractKeywords([title, content].filter(Boolean).join(" "), 6)
  }
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  const client = getClient()
  if (!client) return null

  try {
    const response = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: truncate(text, 8000),
    })
    return response.data[0]?.embedding ?? null
  } catch {
    return null
  }
}
