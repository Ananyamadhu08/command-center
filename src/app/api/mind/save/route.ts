import { NextResponse } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase"
import { processSave } from "@/lib/mind/pipeline"

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase not configured" },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    )
  }

  const { url, content, title, type, image_url } = body

  if (!url && !content && !image_url) {
    return NextResponse.json(
      { success: false, error: "At least one of url, content, or image_url is required" },
      { status: 400 },
    )
  }

  try {
    const result = await processSave({
      url: url as string | null,
      content: content as string | null,
      title: title as string | null,
      type: type as string | null,
      image_url: image_url as string | null,
    })

    return NextResponse.json({
      success: true,
      data: result.item,
      meta: { ai_processed: result.ai_processed },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save item"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
