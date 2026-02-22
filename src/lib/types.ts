export type BriefType = "tech_news" | "morning_briefing" | "evening_review"

export interface Brief {
  id: string
  type: BriefType
  title: string
  content: string
  date: string
  created_at: string
}

export type TechCategory =
  | "ai_ml"
  | "twitter_buzz"
  | "web_dev"
  | "infra_devops"
  | "startups"
  | "open_source"
  | "india_tech"
  | "tools"
  | "mobile"
  | "security"

export interface TechStory {
  title: string
  source: string
  summary: string
  detail: string
  takeaway: string
  tags?: string[]
  url?: string
  category: TechCategory
}

export interface TechBriefContent {
  stories: TechStory[]
  featured_discussions: TechStory[]
  quick_links: { label: string; url: string }[]
  twitter_hot_takes?: { author: string; handle: string; text: string; engagement: string }[]
}

export interface EveningBriefContent {
  completed: string[]
  in_progress: string[]
  tomorrow: string[]
  reflection: string
}

export interface AnalyticsExercise {
  total_minutes_7d: number
  total_minutes_14d: number
  daily_breakdown: { date: string; minutes: number }[]
  type_breakdown: Record<string, number>
  active_days_7d: number
}

export interface AnalyticsHabits {
  total_habits: number
  completion_rate_7d: number
  best_streak: string
  per_habit: { name: string; icon: string; rate: number }[]
}

export interface AnalyticsReading {
  pages_7d: number
  pages_14d: number
  current_book: string
  daily_breakdown: { date: string; pages: number }[]
}

export interface AnalyticsMeals {
  tracked_days_7d: number
  total_logged: number
}

export interface AnalyticsData {
  exercise: AnalyticsExercise
  habits: AnalyticsHabits
  reading: AnalyticsReading
  meals: AnalyticsMeals
  overall: { on_track: string[]; off_track: string[] }
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

export type NavSection = "today" | "briefs" | "meals" | "habits" | "analytics" | "notes" | "projects"

export type ProjectStatus = "active" | "paused" | "archived"
export type TaskStatus = "todo" | "in_progress" | "done"

export interface Project {
  id: string
  name: string
  repo: string
  description: string
  status: ProjectStatus
  created_at: string
}

export interface ProjectTask {
  id: string
  project_id: string
  title: string
  status: TaskStatus
  created_at: string
}

export interface GitHubPR {
  number: number
  title: string
  state: "open" | "closed" | "merged"
  author: string
  updated_at: string
}

export interface GitHubBranch {
  name: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author: string
  date: string
}

export interface GitHubRepoStats {
  open_prs: GitHubPR[]
  branches: GitHubBranch[]
  recent_commits: GitHubCommit[]
  stars: number
}

export interface GitHubRepoOption {
  full_name: string
  description: string
}
