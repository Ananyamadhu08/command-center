import { NextResponse } from "next/server"

interface WeatherResponse {
  temp: number
  condition: string
  icon: string
  city: string
}

const SAMPLE_WEATHER: WeatherResponse = {
  temp: 28,
  condition: "Partly Cloudy",
  icon: "02d",
  city: "Bangalore",
}

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ success: true, data: SAMPLE_WEATHER })
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Bangalore,IN&units=metric&appid=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 1800 } })

    if (!res.ok) {
      return NextResponse.json({ success: true, data: SAMPLE_WEATHER })
    }

    const raw = await res.json()

    const data: WeatherResponse = {
      temp: Math.round(raw.main.temp),
      condition: raw.weather[0]?.description ?? "Unknown",
      icon: raw.weather[0]?.icon ?? "01d",
      city: "Bangalore",
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: true, data: SAMPLE_WEATHER })
  }
}
