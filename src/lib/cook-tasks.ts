import type { MealPlanData, CookTask } from "./types"

/** Things the user handles themselves — no cooking/prep needed */
const USER_HANDLED_PATTERNS = [
  /soaked almonds/i, /\bwalnuts\b/i, /green tea/i,
  /haldi doodh/i, /turmeric milk/i, /warm water/i, /warm milk/i,
  /\bmakhana\b/i, /roasted chana/i, /roasted foxnuts/i,
  /nimbu pani/i, /peanut butter/i,
]

interface CookRule {
  pattern: RegExp
  task: string
  quantity?: string
  emoji: string
  category: "cooking" | "prep"
}

const COOK_RULES: CookRule[] = [
  // Cooking — breakfast items
  { pattern: /egg bhurji/i, task: "Make egg bhurji", quantity: "2 eggs", emoji: "🍳", category: "cooking" },
  { pattern: /masala omelette/i, task: "Make masala omelette", quantity: "2 eggs", emoji: "🍳", category: "cooking" },
  { pattern: /egg omelette/i, task: "Make egg omelette", quantity: "2 eggs", emoji: "🍳", category: "cooking" },
  { pattern: /fried eggs/i, task: "Make fried eggs", quantity: "2 eggs", emoji: "🍳", category: "cooking" },
  { pattern: /\bpoha\b/i, task: "Make poha", quantity: "with peanuts", emoji: "🍚", category: "cooking" },
  { pattern: /\bupma\b/i, task: "Make upma", emoji: "🍚", category: "cooking" },
  { pattern: /\bdosa\b/i, task: "Make dosas", emoji: "🥞", category: "cooking" },
  { pattern: /besan chilla/i, task: "Make besan chilla", quantity: "2-3", emoji: "🥞", category: "cooking" },
  { pattern: /stuffed paratha/i, task: "Make stuffed parathas", quantity: "2-3", emoji: "🫓", category: "cooking" },
  { pattern: /\bparatha\b(?!.*stuffed)/i, task: "Make parathas", quantity: "2-3", emoji: "🫓", category: "cooking" },
  { pattern: /whole wheat toast/i, task: "Make toast", emoji: "🍞", category: "cooking" },

  // Cooking — rice & grains
  { pattern: /jeera rice/i, task: "Make jeera rice", quantity: "2 cups basmati", emoji: "🍚", category: "cooking" },
  { pattern: /\brice\b(?!.*jeera)/i, task: "Make plain rice", quantity: "2 cups basmati", emoji: "🍚", category: "cooking" },

  // Cooking — rotis
  { pattern: /\broti\b/i, task: "Make rotis", quantity: "4-6", emoji: "🫓", category: "cooking" },

  // Cooking — dals
  { pattern: /dal tadka/i, task: "Make dal tadka", quantity: "1 cup toor dal", emoji: "🫘", category: "cooking" },
  { pattern: /dal makhani/i, task: "Make dal makhani", quantity: "1 cup urad dal", emoji: "🫘", category: "cooking" },
  { pattern: /dal fry/i, task: "Make dal fry", quantity: "1 cup dal", emoji: "🫘", category: "cooking" },
  { pattern: /palak dal/i, task: "Make palak dal", quantity: "1 cup dal + spinach", emoji: "🫘", category: "cooking" },
  { pattern: /toor dal(?!.*tadka)/i, task: "Make toor dal", quantity: "1 cup", emoji: "🫘", category: "cooking" },
  { pattern: /moong dal/i, task: "Make moong dal", quantity: "1 cup", emoji: "🫘", category: "cooking" },
  { pattern: /masoor dal/i, task: "Make masoor dal", quantity: "1 cup", emoji: "🫘", category: "cooking" },
  { pattern: /chana dal/i, task: "Make chana dal", quantity: "1 cup", emoji: "🫘", category: "cooking" },
  { pattern: /\brajma\b/i, task: "Make rajma", quantity: "1 cup", emoji: "🫘", category: "cooking" },
  { pattern: /\bsamb[ah]r\b/i, task: "Make sambhar", quantity: "with vegetables", emoji: "🫘", category: "cooking" },

  // Cooking — proteins
  { pattern: /chicken curry/i, task: "Make chicken curry", quantity: "500g chicken", emoji: "🍗", category: "cooking" },
  { pattern: /chicken tikka/i, task: "Make chicken tikka", quantity: "500g chicken", emoji: "🍗", category: "cooking" },
  { pattern: /grilled chicken/i, task: "Make grilled chicken", quantity: "500g chicken", emoji: "🍗", category: "cooking" },
  { pattern: /chicken keema/i, task: "Make chicken keema", quantity: "300g mince", emoji: "🍗", category: "cooking" },
  { pattern: /mutton curry/i, task: "Make mutton curry", quantity: "500g mutton", emoji: "🥩", category: "cooking" },
  { pattern: /fish fry/i, task: "Make fish fry", quantity: "2-3 pieces", emoji: "🐟", category: "cooking" },
  { pattern: /fish curry/i, task: "Make fish curry", quantity: "2-3 pieces", emoji: "🐟", category: "cooking" },
  { pattern: /egg curry/i, task: "Make egg curry", quantity: "4 eggs", emoji: "🥚", category: "cooking" },

  // Cooking — sabzis
  { pattern: /palak paneer/i, task: "Make palak paneer", quantity: "200g paneer + spinach", emoji: "🥬", category: "cooking" },
  { pattern: /paneer bhurji/i, task: "Make paneer bhurji", quantity: "200g paneer", emoji: "🧀", category: "cooking" },
  { pattern: /aloo gobi/i, task: "Make aloo gobi", emoji: "🥔", category: "cooking" },
  { pattern: /bhindi fry/i, task: "Make bhindi fry", quantity: "250g bhindi", emoji: "🥬", category: "cooking" },
  { pattern: /beans poriyal/i, task: "Make beans poriyal", quantity: "250g beans", emoji: "🥬", category: "cooking" },
  { pattern: /beans thoran/i, task: "Make beans thoran", quantity: "250g beans", emoji: "🥬", category: "cooking" },
  { pattern: /palak sabzi/i, task: "Make palak sabzi", quantity: "1 bunch spinach", emoji: "🥬", category: "cooking" },
  { pattern: /lauki sabzi/i, task: "Make lauki sabzi", quantity: "1 lauki", emoji: "🥬", category: "cooking" },
  { pattern: /cabbage sabzi/i, task: "Make cabbage sabzi", quantity: "half cabbage", emoji: "🥬", category: "cooking" },
  { pattern: /mixed veg curry/i, task: "Make mixed veg curry", emoji: "🥬", category: "cooking" },
  { pattern: /mushroom matar/i, task: "Make mushroom matar", quantity: "200g mushroom + peas", emoji: "🍄", category: "cooking" },
  { pattern: /baingan bharta/i, task: "Make baingan bharta", quantity: "2 baingan", emoji: "🍆", category: "cooking" },

  // Cooking — chutneys
  { pattern: /coconut chutney/i, task: "Make coconut chutney", emoji: "🥥", category: "cooking" },

  // Prep tasks — things cook can do and store
  { pattern: /cucumber raita/i, task: "Make cucumber raita", quantity: "1 cup dahi + cucumber", emoji: "🥒", category: "prep" },
  { pattern: /\braita\b(?!.*cucumber)/i, task: "Make raita", quantity: "1 cup dahi", emoji: "🥒", category: "prep" },
  { pattern: /\bsalad\b/i, task: "Chop salad vegetables", quantity: "cucumber, onion, tomato, lemon", emoji: "🥗", category: "prep" },
  { pattern: /boiled eggs/i, task: "Boil eggs", quantity: "2-3", emoji: "🥚", category: "prep" },
  { pattern: /\bbuttermilk\b/i, task: "Make buttermilk", quantity: "2 glasses", emoji: "🥛", category: "prep" },
  { pattern: /\blassi\b/i, task: "Make lassi", quantity: "2 glasses", emoji: "🥛", category: "prep" },
  { pattern: /banana milkshake/i, task: "Make banana milkshake", emoji: "🥛", category: "prep" },
  { pattern: /\bfruit|banana|apple|papaya|orange|guava|pomegranate|pear|watermelon/i, task: "Cut fruits and store in fridge", emoji: "🍎", category: "prep" },
]

export function extractCookTasks(plan: MealPlanData): CookTask[] {
  const allText = Object.values(plan).join(" + ")

  const seen = new Set<string>()
  const tasks: CookTask[] = []
  let cookIdx = 0
  let prepIdx = 0

  for (const rule of COOK_RULES) {
    if (!rule.pattern.test(allText)) continue

    const isUserHandled = USER_HANDLED_PATTERNS.some((p) => p.test(rule.task))
    if (isUserHandled) continue

    if (seen.has(rule.task)) continue
    seen.add(rule.task)

    const id = rule.category === "cooking" ? `cooking-${cookIdx++}` : `prep-${prepIdx++}`
    tasks.push({
      id,
      category: rule.category,
      description: rule.task,
      quantity: rule.quantity,
      emoji: rule.emoji,
    })
  }

  return tasks
}

/** Items that need overnight soaking or advance prep for tomorrow */
const OVERNIGHT_PREP_RULES: CookRule[] = [
  { pattern: /\brajma\b/i, task: "Soak rajma overnight", quantity: "1 cup", emoji: "🫘", category: "prep" },
  { pattern: /dal makhani/i, task: "Soak urad dal overnight", quantity: "1 cup", emoji: "🫘", category: "prep" },
  { pattern: /chana dal/i, task: "Soak chana dal", quantity: "1 cup, 4-5 hours", emoji: "🫘", category: "prep" },
  { pattern: /chicken|grilled chicken|chicken tikka|chicken curry|chicken keema/i, task: "Ensure chicken is available", quantity: "500g, order/defrost if needed", emoji: "🍗", category: "prep" },
  { pattern: /mutton/i, task: "Ensure mutton is available", quantity: "500g, order/defrost if needed", emoji: "🥩", category: "prep" },
  { pattern: /fish/i, task: "Ensure fish is available", quantity: "order/defrost if needed", emoji: "🐟", category: "prep" },
  { pattern: /paneer/i, task: "Ensure paneer is available", quantity: "200g, check stock", emoji: "🧀", category: "prep" },
  { pattern: /\bdosa\b/i, task: "Prepare dosa batter", quantity: "soak rice + urad dal", emoji: "🥞", category: "prep" },
  { pattern: /sprout/i, task: "Sprout moong/chana", quantity: "soak today, sprouts ready tomorrow", emoji: "🌱", category: "prep" },
]

/** Extract prep tasks needed TODAY for TOMORROW's meal plan */
export function extractTomorrowPrep(tomorrowPlan: MealPlanData): CookTask[] {
  const allText = Object.values(tomorrowPlan).join(" + ")

  const seen = new Set<string>()
  const tasks: CookTask[] = []
  let idx = 0

  for (const rule of OVERNIGHT_PREP_RULES) {
    if (!rule.pattern.test(allText)) continue
    if (seen.has(rule.task)) continue
    seen.add(rule.task)

    tasks.push({
      id: `tomorrow-${idx++}`,
      category: "prep",
      description: rule.task,
      quantity: rule.quantity,
      emoji: rule.emoji,
    })
  }

  return tasks
}
