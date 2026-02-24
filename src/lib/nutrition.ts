import type { MealPlanData } from "./types"
import { extractCookTasks, extractTomorrowPrep } from "./cook-tasks"
import { formatCookTasksForWhatsApp } from "./whatsapp-format"

export const DAILY_ESSENTIALS = [
  { item: "5 soaked almonds + 2 walnuts", icon: "🥜", time: "Early morning" },
  { item: "1 banana", icon: "🍌", time: "With breakfast" },
  { item: "2 eggs (any style)", icon: "🥚", time: "Breakfast" },
  { item: "Milk or dahi", icon: "🥛", time: "With meals" },
  { item: "Green leafy vegetable", icon: "🥬", time: "Lunch/Dinner" },
  { item: "Dal / lentils", icon: "🫘", time: "Lunch/Dinner" },
  { item: "2+ fruits", icon: "🍎", time: "Snack times" },
  { item: "8-10 glasses water", icon: "💧", time: "Throughout day" },
]

export const MEAL_TEMPLATES: MealPlanData[] = [
  {
    early_morning: "Warm water with lemon + 5 soaked almonds + 2 walnuts",
    breakfast: "Egg bhurji (2 eggs) with whole wheat toast + banana",
    mid_morning_snack: "Apple + green tea",
    lunch: "Jeera rice + dal tadka + chicken curry + cucumber raita + salad",
    evening_snack: "Makhana (roasted foxnuts) + green tea",
    dinner: "2 roti + palak paneer + moong dal + mixed salad",
    before_bed: "Haldi doodh (turmeric milk)",
  },
  {
    early_morning: "Warm water + 5 soaked almonds + 2 walnuts",
    breakfast: "Masala omelette (2 eggs) with paratha + banana",
    mid_morning_snack: "Papaya slices + handful of peanuts",
    lunch: "Rice + sambhar + fish fry + beans poriyal + dahi",
    evening_snack: "Sprout chaat + nimbu pani",
    dinner: "2 roti + egg curry + toor dal + onion-tomato salad",
    before_bed: "Warm milk with a pinch of nutmeg",
  },
  {
    early_morning: "Warm water with honey + 5 soaked almonds + 2 walnuts",
    breakfast: "Poha with peanuts + boiled eggs (2) + banana",
    mid_morning_snack: "Orange + walnuts",
    lunch: "Roti + rajma + chicken keema + bhindi fry + buttermilk",
    evening_snack: "Roasted chana + green tea",
    dinner: "2 roti + mixed veg curry + masoor dal + carrot salad",
    before_bed: "Haldi doodh",
  },
  {
    early_morning: "Warm water + 5 soaked almonds + 2 walnuts",
    breakfast: "Upma + egg bhurji (2 eggs) + banana milkshake",
    mid_morning_snack: "Guava + a few cashews",
    lunch: "Rice + dal fry + mutton curry + cabbage sabzi + raita",
    evening_snack: "Makhana + green tea",
    dinner: "2 roti + paneer bhurji + palak dal + cucumber salad",
    before_bed: "Warm milk with cardamom",
  },
  {
    early_morning: "Warm water with lemon + 5 soaked almonds + 2 walnuts",
    breakfast: "Dosa + coconut chutney + boiled eggs (2) + banana",
    mid_morning_snack: "Pomegranate + almonds",
    lunch: "Jeera rice + chana dal + grilled chicken + lauki sabzi + dahi",
    evening_snack: "Fruit chaat + green tea",
    dinner: "2 roti + aloo gobi + moong dal + beetroot salad",
    before_bed: "Haldi doodh",
  },
  {
    early_morning: "Warm water + 5 soaked almonds + 2 walnuts",
    breakfast: "Besan chilla (2) + fried eggs (2) + banana",
    mid_morning_snack: "Pear + peanut butter on toast",
    lunch: "Rice + sambar + fish curry + beans thoran + buttermilk",
    evening_snack: "Roasted makhana + green tea",
    dinner: "2 roti + mushroom matar + toor dal + mixed salad",
    before_bed: "Warm milk with turmeric and honey",
  },
  {
    early_morning: "Warm water with ginger + 5 soaked almonds + 2 walnuts",
    breakfast: "Stuffed paratha + egg omelette (2 eggs) + banana + lassi",
    mid_morning_snack: "Watermelon + a few pistachios",
    lunch: "Rice + dal makhani + chicken tikka + palak sabzi + raita",
    evening_snack: "Sprout salad + green tea",
    dinner: "2 roti + baingan bharta + moong dal + onion salad",
    before_bed: "Haldi doodh",
  },
]

export function getTodaysMealPlan(): MealPlanData {
  const dayIndex = new Date().getDay()
  return MEAL_TEMPLATES[dayIndex]
}

export function getTomorrowsMealPlan(): MealPlanData {
  const tomorrowIndex = (new Date().getDay() + 1) % 7
  return MEAL_TEMPLATES[tomorrowIndex]
}

export function generateCookInstructions(plan: MealPlanData): string {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const todayIdx = new Date().getDay()
  const tomorrowIdx = (todayIdx + 1) % 7
  const todayTasks = extractCookTasks(plan)
  const tomorrowPlan = MEAL_TEMPLATES[tomorrowIdx]
  const tomorrowPrep = extractTomorrowPrep(tomorrowPlan)
  return formatCookTasksForWhatsApp(todayTasks, dayNames[todayIdx], tomorrowPrep, dayNames[tomorrowIdx])
}

export const MEAL_TYPE_OPTIONS = [
  "early_morning",
  "breakfast",
  "mid_morning_snack",
  "lunch",
  "evening_snack",
  "dinner",
  "before_bed",
] as const

export const MEAL_ICONS: Record<string, string> = {
  early_morning: "\uD83C\uDF05",
  breakfast: "\uD83C\uDF73",
  mid_morning_snack: "\uD83C\uDF4F",
  lunch: "\uD83C\uDF5B",
  evening_snack: "\u2615",
  dinner: "\uD83C\uDF19",
  before_bed: "\uD83D\uDE34",
}

export const MEAL_TYPE_LABELS: Record<string, string> = {
  early_morning: "Early Morning",
  breakfast: "Breakfast",
  mid_morning_snack: "Mid-Morning Snack",
  lunch: "Lunch",
  evening_snack: "Evening Snack",
  dinner: "Dinner",
  before_bed: "Before Bed",
}
