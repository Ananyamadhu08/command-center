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

export interface WeekComparison {
  exercise_minutes: { this_week: number; last_week: number }
  habit_completion: { this_week: number; last_week: number }
  reading_pages: { this_week: number; last_week: number }
  meals_tracked: { this_week: number; last_week: number }
}

export interface WeeklyGoals {
  exercise_minutes: { current: number; target: number }
  reading_pages: { current: number; target: number }
  habit_completion: { current: number; target: number }
  meals_tracked: { current: number; target: number }
}

export interface HabitDailyGrid {
  name: string
  icon: string
  color: string
  days: { date: string; completed: boolean }[]
}

export interface AnalyticsData {
  exercise: AnalyticsExercise
  habits: AnalyticsHabits
  reading: AnalyticsReading
  meals: AnalyticsMeals
  overall: { on_track: string[]; off_track: string[] }
  weekly_score: number
  week_comparison: WeekComparison
  weekly_goals: WeeklyGoals
  habit_grid: HabitDailyGrid[]
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
export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done"

export const TASK_STATUSES: TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
]

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; className: string }
> = {
  backlog: { label: "Backlog", color: "#6b7280", className: "bg-white/10 text-white/40 border-white/10" },
  todo: { label: "To Do", color: "#a78bfa", className: "bg-cosmic/20 text-cosmic-light border-cosmic/30" },
  in_progress: { label: "In Progress", color: "#60a5fa", className: "bg-electric/20 text-electric-light border-electric/30" },
  in_review: { label: "In Review", color: "#fbbf24", className: "bg-amber/20 text-amber-light border-amber/30" },
  done: { label: "Done", color: "#34d399", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
}

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
  description?: string
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

export interface GitHubOverview {
  commits_today: number
  prs_today: number
  repos_contributed_today: number
  total_repos: number
}
