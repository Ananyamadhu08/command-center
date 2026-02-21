export type BriefType = "tech_news" | "morning_briefing" | "evening_review"

export interface Brief {
  id: string
  type: BriefType
  title: string
  content: string
  date: string
  created_at: string
}

export interface MealPlan {
  id: string
  date: string
  plan: MealPlanData
  cook_instructions: string
  created_at: string
}

export interface MealPlanData {
  early_morning: string
  breakfast: string
  mid_morning_snack: string
  lunch: string
  evening_snack: string
  dinner: string
  before_bed: string
}

export interface MealLog {
  id: string
  date: string
  meal_type: string
  description: string
  created_at: string
}

export interface ExerciseLog {
  id: string
  date: string
  type: "morning_stretch" | "gym" | "walk" | "yoga"
  duration_minutes: number
  notes: string
  created_at: string
}

export interface ReadingLog {
  id: string
  book_title: string
  pages_read: number
  date: string
  notes: string
  created_at: string
}

export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  date: string
  completed: boolean
  created_at: string
}

export interface Note {
  id: string
  content: string
  created_at: string
}

export type NavSection = "today" | "briefs" | "meals" | "habits" | "notes"
