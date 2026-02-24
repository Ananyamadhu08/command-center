"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Cloud, Dumbbell, BookOpen, CheckCircle, UtensilsCrossed, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"
import { BriefCard, PendingBriefCard } from "@/components/briefs/BriefCard"
import { MealPlanCard } from "@/components/meals/MealPlanCard"
import { NutritionTips } from "@/components/meals/NutritionTips"
import { HabitTracker } from "@/components/habits/HabitTracker"
import { getTodaysMealPlan } from "@/lib/nutrition"
import { staggerContainer, staggerItem } from "@/lib/animations"
import { useTodayData, type WeatherData } from "@/hooks/use-today-data"
import type { BriefType } from "@/lib/types"

const WEATHER_ICONS: Record<string, string> = {
  "01d": "\u2600\uFE0F", "01n": "\uD83C\uDF19",
  "02d": "\u26C5", "02n": "\u2601\uFE0F",
  "03d": "\u2601\uFE0F", "03n": "\u2601\uFE0F",
  "04d": "\u2601\uFE0F", "04n": "\u2601\uFE0F",
  "09d": "\uD83C\uDF27\uFE0F", "09n": "\uD83C\uDF27\uFE0F",
  "10d": "\uD83C\uDF26\uFE0F", "10n": "\uD83C\uDF27\uFE0F",
  "11d": "\u26C8\uFE0F", "11n": "\u26C8\uFE0F",
  "13d": "\u2744\uFE0F", "13n": "\u2744\uFE0F",
  "50d": "\uD83C\uDF2B\uFE0F", "50n": "\uD83C\uDF2B\uFE0F",
}

const BRIEF_TYPES: BriefType[] = ["morning_briefing", "tech_news", "evening_review"]

function WeatherCard({ weather }: { weather: WeatherData | null }) {
  return (
    <GlassCard hover={false} className="h-full text-center py-4">
      <div className="h-6 flex items-center justify-center mb-1">
        {weather ? (
          <span className="text-2xl leading-none">{WEATHER_ICONS[weather.icon] ?? <Cloud size={24} className="text-white/60" />}</span>
        ) : (
          <Cloud size={24} className="text-white/60" />
        )}
      </div>
      <p className="text-lg font-semibold text-white/90">
        {weather ? `${weather.temp}\u00B0` : "--\u00B0"}
      </p>
      <p className="text-[10px] font-mono text-white/30 mt-0.5 capitalize truncate">
        {weather?.condition ?? "Loading..."}
      </p>
    </GlassCard>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <GlassCard hover={false} className="h-full text-center py-4">
      <div className="h-6 flex items-center justify-center mb-1">{icon}</div>
      <p className="text-lg font-semibold text-white/90">{value}</p>
      <p className="text-[10px] font-mono text-white/30 mt-0.5 truncate">{label}</p>
    </GlassCard>
  )
}

function SectionHeader({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider">{title}</h3>
      <Link
        href={href}
        className="text-[10px] text-cosmic-light/50 hover:text-cosmic-light transition-colors"
      >
        {linkText} <ArrowRight size={10} className="inline ml-0.5" />
      </Link>
    </div>
  )
}

export function TodayView() {
  const {
    habits,
    habitLogs,
    exerciseMinutes,
    exerciseType,
    pagesRead,
    currentBook,
    completedHabits,
    mealLogs,
    weather,
    briefsByType,
    handleHabitToggle,
  } = useTodayData()

  const mealPlan = getTodaysMealPlan()

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      {/* Today's Overview */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold text-white/80 mb-4">Today&apos;s Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <WeatherCard weather={weather} />
          <StatCard
            icon={<Dumbbell size={24} className="text-electric-light" />}
            value={`${exerciseMinutes > 0 ? exerciseMinutes : "0"} min`}
            label={exerciseType ?? "No workout yet"}
          />
          <StatCard
            icon={<BookOpen size={24} className="text-cosmic-light" />}
            value={`${pagesRead > 0 ? pagesRead : "0"} pages`}
            label={currentBook ?? "No reading yet"}
          />
          <StatCard
            icon={<CheckCircle size={24} className="text-emerald-400" />}
            value={`${completedHabits}/${habits.length}`}
            label="Habits done"
          />
          <StatCard
            icon={<UtensilsCrossed size={24} className="text-amber-light" />}
            value={`${mealLogs.length}/7`}
            label="Meals tracked"
          />
        </div>
      </motion.div>

      {/* Briefs */}
      <motion.div variants={staggerItem}>
        <SectionHeader title="Briefs" href="/briefs" linkText="View all" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BRIEF_TYPES.map((type) => {
            const brief = briefsByType.get(type)
            return brief ? (
              <BriefCard key={type} brief={brief} />
            ) : (
              <PendingBriefCard key={type} type={type} />
            )
          })}
        </div>
      </motion.div>

      {/* Habits */}
      <motion.div variants={staggerItem}>
        <SectionHeader title="Habits" href="/habits" linkText="Details" />
        <HabitTracker habits={habits} todayLogs={habitLogs} onToggle={handleHabitToggle} />
      </motion.div>

      {/* Nutrition */}
      <motion.div variants={staggerItem} className="space-y-5">
        <SectionHeader title="Nutrition" href="/meals" linkText="Full plan" />
        <NutritionTips />
        <MealPlanCard plan={mealPlan} />
      </motion.div>
    </motion.div>
  )
}
