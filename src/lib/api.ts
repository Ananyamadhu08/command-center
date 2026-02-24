interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function fetchApi<T>(url: string): Promise<T | null> {
  const res = await fetch(url)
  const json: ApiResponse<T> = await res.json()
  if (json.success && json.data !== undefined) {
    return json.data
  }
  return null
}

export async function postApi<T>(
  url: string,
  body: unknown,
): Promise<T | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json: ApiResponse<T> = await res.json()
  if (json.success && json.data !== undefined) {
    return json.data
  }
  return null
}

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}
