import type { Brief, Habit, HabitLog, ExerciseLog as ExerciseLogType, ReadingLog as ReadingLogType, Note } from "./types"
import { getToday } from "./utils"

const today = getToday()

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split("T")[0]
}

export const SAMPLE_BRIEFS: Brief[] = [
  {
    id: "b1",
    type: "morning_briefing",
    title: "Your Morning Brief",
    content: `Good morning, Ananya!

Weather: 28°C, partly cloudy in Bangalore

Today's Focus:
- Complete dashboard MVP
- Review nutrition plan for the week
- 30 min morning stretch

Reminders:
- Team standup at 10 AM
- Grocery run for weekly meal prep
- Evening reading session

Quote of the day: "The secret of getting ahead is getting started." - Mark Twain`,
    date: today,
    created_at: new Date().toISOString(),
  },
  {
    id: "b2",
    type: "tech_news",
    title: "Tech News Digest",
    content: `Top Stories:

1. Claude 4.6 Released - Anthropic launches new model family with enhanced reasoning capabilities and faster output.

2. Next.js 16.1 Update - New features include improved App Router performance and better static analysis.

3. Supabase Raises Series C - Database platform continues growth with new real-time features.

4. India's AI Push - Government announces new AI compute initiative for startups.

5. React 19.3 Stable - React Compiler now production-ready with automatic memoization.`,
    date: today,
    created_at: new Date().toISOString(),
  },
  {
    id: "b3",
    type: "evening_review",
    title: "Evening Review",
    content: `Daily Summary:

Completed:
- Morning stretch routine (20 min)
- Reviewed project requirements
- Healthy meals tracked

In Progress:
- Dashboard development
- Reading - 15 pages completed

Tomorrow's Priorities:
1. Deploy dashboard to Vercel
2. Set up OpenClaw integrations
3. Gym session (upper body)

Reflection: Productive day with good focus. Need to improve water intake.`,
    date: today,
    created_at: new Date().toISOString(),
  },
]

export const SAMPLE_HABITS: Habit[] = [
  { id: "h1", name: "Morning Stretch", icon: "🌅", color: "#3b82f6", created_at: "" },
  { id: "h2", name: "Read 20 Pages", icon: "📚", color: "#8b5cf6", created_at: "" },
  { id: "h3", name: "8 Glasses Water", icon: "💧", color: "#06b6d4", created_at: "" },
  { id: "h4", name: "No Social Media before 12", icon: "📵", color: "#f59e0b", created_at: "" },
  { id: "h5", name: "Journal Entry", icon: "✍️", color: "#10b981", created_at: "" },
  { id: "h6", name: "Meditate 10 min", icon: "🧘", color: "#ec4899", created_at: "" },
]

export const SAMPLE_HABIT_LOGS: HabitLog[] = [
  { id: "hl1", habit_id: "h1", date: today, completed: true, created_at: "" },
  { id: "hl2", habit_id: "h4", date: today, completed: true, created_at: "" },
]

export const SAMPLE_EXERCISE_LOGS: ExerciseLogType[] = [
  { id: "e1", date: today, type: "morning_stretch", duration_minutes: 20, notes: "Full body stretch", created_at: "" },
  { id: "e2", date: daysAgo(1), type: "gym", duration_minutes: 45, notes: "Upper body", created_at: "" },
  { id: "e3", date: daysAgo(1), type: "walk", duration_minutes: 30, notes: "Evening walk", created_at: "" },
  { id: "e4", date: daysAgo(2), type: "morning_stretch", duration_minutes: 15, notes: "Quick stretch", created_at: "" },
  { id: "e5", date: daysAgo(2), type: "yoga", duration_minutes: 30, notes: "Surya namaskar", created_at: "" },
  { id: "e6", date: daysAgo(3), type: "gym", duration_minutes: 50, notes: "Leg day", created_at: "" },
  { id: "e7", date: daysAgo(5), type: "walk", duration_minutes: 40, notes: "Long walk", created_at: "" },
  { id: "e8", date: daysAgo(6), type: "morning_stretch", duration_minutes: 20, notes: "", created_at: "" },
]

export const SAMPLE_READING_LOGS: ReadingLogType[] = [
  { id: "r1", book_title: "Atomic Habits", pages_read: 15, date: today, notes: "Habit stacking", created_at: "" },
  { id: "r2", book_title: "Atomic Habits", pages_read: 20, date: daysAgo(1), notes: "4 laws of behavior change", created_at: "" },
  { id: "r3", book_title: "Deep Work", pages_read: 25, date: daysAgo(2), notes: "Finished Part 1", created_at: "" },
  { id: "r4", book_title: "Deep Work", pages_read: 18, date: daysAgo(4), notes: "", created_at: "" },
]

export const SAMPLE_NOTES: Note[] = [
  { id: "n1", content: "Remember to set up OpenClaw webhook after deploying to Vercel", created_at: new Date().toISOString() },
  { id: "n2", content: "Meal prep idea: make a big batch of dal on Sunday for the week", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "n3", content: "Look into adding Spotify integration for focus music tracking", created_at: new Date(Date.now() - 7200000).toISOString() },
]
