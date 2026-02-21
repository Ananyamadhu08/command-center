"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { Modal } from "@/components/ui/Modal"
import type { Brief, TechBriefContent, TechStory, TechCategory } from "@/lib/types"

interface TechBriefPageProps {
  brief: Brief
}

type Tab = "news" | "discourse"

const NEWS_CATEGORIES: TechCategory[] = [
  "ai_ml",
  "web_dev",
  "infra_devops",
  "tools",
  "india_tech",
  "mobile",
  "security",
  "open_source",
  "startups",
]

const CATEGORY_LABELS: Record<TechCategory, string> = {
  ai_ml: "AI / ML",
  twitter_buzz: "Twitter/X",
  web_dev: "Web Dev",
  infra_devops: "Infra & DevOps",
  startups: "Startups",
  open_source: "Open Source",
  india_tech: "India Tech",
  tools: "Dev Tools",
  mobile: "Mobile",
  security: "Security",
}

const CATEGORY_ICONS: Record<TechCategory, string> = {
  ai_ml: "\u{1F9E0}",
  twitter_buzz: "\u{1D54F}",
  web_dev: "\u{1F310}",
  infra_devops: "\u2601",
  startups: "\u{1F680}",
  open_source: "\u{1F4E6}",
  india_tech: "\u{1F1EE}\u{1F1F3}",
  tools: "\u{1F527}",
  mobile: "\u{1F4F1}",
  security: "\u{1F512}",
}

function parseTechContent(content: string): TechBriefContent | null {
  try {
    return JSON.parse(content) as TechBriefContent
  } catch {
    return null
  }
}

function GlassBadge({ category }: { category: TechCategory }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap " +
        "text-[10px] font-medium px-2.5 py-1 rounded-lg " +
        "backdrop-blur-md bg-white/[0.05] border border-white/[0.12] text-white/70 " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      }
    >
      <span className="text-xs leading-none">{CATEGORY_ICONS[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  )
}

function GlassTag({ tag }: { tag: string }) {
  return (
    <span className="text-[9px] px-2 py-0.5 rounded-md font-mono bg-white/[0.04] border border-white/[0.08] text-white/30">
      #{tag}
    </span>
  )
}

function StoryCard({ story, index, onSelect }: { story: TechStory; index: number; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04 }}
    >
      <GlassCard hover onClick={onSelect}>
        <div className="space-y-3">
          {/* Badge + Source */}
          <div className="flex items-center gap-2.5">
            <GlassBadge category={story.category} />
            <span className="text-[10px] font-mono text-white/20">{story.source}</span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-white/90 leading-snug tracking-tight">
            {story.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-white/45 leading-relaxed">{story.summary}</p>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {story.tags.map((tag) => (
                <GlassTag key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* Takeaway — purple text is the accent */}
          <div className="flex items-center gap-3 pt-2.5 border-t border-white/[0.06]">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest shrink-0">
              Takeaway
            </span>
            <p className="text-xs text-cosmic-light flex-1 min-w-0 truncate">{story.takeaway}</p>
            <span className="text-white/20 text-sm shrink-0">{"\u2192"}</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export function TechBriefPage({ brief }: TechBriefPageProps) {
  const parsed = parseTechContent(brief.content)
  const [activeTab, setActiveTab] = useState<Tab>("news")
  const [activeCategory, setActiveCategory] = useState<TechCategory | "all">("all")
  const [selectedStory, setSelectedStory] = useState<TechStory | null>(null)

  if (!parsed) {
    return (
      <GlassCard>
        <div className="text-sm text-white/70 whitespace-pre-wrap">{brief.content}</div>
      </GlassCard>
    )
  }

  const discussions = parsed.featured_discussions ?? []
  const hotTakes = parsed.twitter_hot_takes ?? []
  const newsCount = parsed.stories.length
  const discourseCount = hotTakes.length + discussions.length

  const newsCategories = useMemo(() => {
    const present = new Set(parsed.stories.map((s) => s.category))
    return NEWS_CATEGORIES.filter((c) => present.has(c))
  }, [parsed.stories])

  const filteredStories = useMemo(
    () =>
      activeCategory === "all"
        ? parsed.stories
        : parsed.stories.filter((s) => s.category === activeCategory),
    [parsed.stories, activeCategory],
  )

  const storyCounts = useMemo(
    () =>
      parsed.stories.reduce<Record<string, number>>(
        (acc, s) => ({ ...acc, [s.category]: (acc[s.category] ?? 0) + 1 }),
        {},
      ),
    [parsed.stories],
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{"\u26A1"}</span>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-white/90">{brief.title}</h1>
          <p className="text-xs font-mono text-white/30">
            {newsCount + discussions.length} stories {"\u00B7"} {hotTakes.length} hot takes {"\u00B7"}{" "}
            {new Date(brief.created_at).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveTab("news")
            setActiveCategory("all")
          }}
          className={
            "text-xs px-5 py-2 rounded-lg border transition-all font-medium " +
            (activeTab === "news"
              ? "border-white/20 bg-white/10 text-white/90"
              : "border-white/[0.08] text-white/35 hover:border-white/15 hover:text-white/55")
          }
        >
          News ({newsCount})
        </button>
        <button
          onClick={() => {
            setActiveTab("discourse")
            setActiveCategory("all")
          }}
          className={
            "text-xs px-5 py-2 rounded-lg border transition-all font-medium " +
            (activeTab === "discourse"
              ? "border-white/20 bg-white/10 text-white/90"
              : "border-white/[0.08] text-white/35 hover:border-white/15 hover:text-white/55")
          }
        >
          Discourse ({discourseCount})
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "news" ? (
          <motion.div
            key="news"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCategory("all")}
                className={
                  "text-[10px] px-3 py-1.5 rounded-lg border transition-all " +
                  (activeCategory === "all"
                    ? "border-white/20 bg-white/10 text-white/80"
                    : "border-white/[0.08] text-white/30 hover:border-white/15 hover:text-white/50")
                }
              >
                All ({newsCount})
              </button>
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    "text-[10px] px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 " +
                    (activeCategory === cat
                      ? "border-white/20 bg-white/10 text-white/80"
                      : "border-white/[0.08] text-white/30 hover:border-white/15 hover:text-white/50")
                  }
                >
                  <span className="text-[9px]">{CATEGORY_ICONS[cat]}</span>
                  {CATEGORY_LABELS[cat]} ({storyCounts[cat]})
                </button>
              ))}
            </div>

            {/* News Stories */}
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {filteredStories.map((story, i) => (
                  <StoryCard
                    key={`news-${story.title}-${i}`}
                    story={story}
                    index={i}
                    onSelect={() => setSelectedStory(story)}
                  />
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="discourse"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Hot Takes */}
            {hotTakes.length > 0 && (
              <div>
                <h2 className="text-xs font-mono text-white/35 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{"\u{1D54F}"}</span> Hot Takes
                </h2>
                <div className="space-y-2.5">
                  {hotTakes.map((take, i) => (
                    <motion.div
                      key={`take-${take.handle}-${i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard hover={false} className="border-l-2 border-l-cosmic/30">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-semibold text-white/85">{take.author}</span>
                            <span className="text-[10px] font-mono text-white/30">{take.handle}</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed italic">
                            {"\u201C"}{take.text}{"\u201D"}
                          </p>
                          <span className="inline-block text-[9px] px-2 py-0.5 rounded-md font-mono bg-white/[0.04] border border-white/[0.08] text-white/25">
                            {take.engagement}
                          </span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Discussions */}
            {discussions.length > 0 && (
              <div>
                <h2 className="text-xs font-mono text-white/35 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{"\u{1F4AC}"}</span> Featured Discussions
                </h2>
                <div className="space-y-3">
                  {discussions.map((story, i) => (
                    <StoryCard
                      key={`disc-${story.title}-${i}`}
                      story={story}
                      index={i}
                      onSelect={() => setSelectedStory(story)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Links Footer */}
      {(parsed.quick_links ?? []).length > 0 && (
        <div className="pt-4 border-t border-white/5">
          <GlassCard hover={false}>
            <h3 className="text-xs font-mono text-white/25 uppercase tracking-wider mb-3">Quick Links</h3>
            <div className="flex flex-wrap gap-2">
              {parsed.quick_links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "text-[11px] px-3 py-1.5 rounded-lg transition-all " +
                    "border border-white/[0.08] text-white/40 " +
                    "hover:text-white/70 hover:border-white/20 hover:bg-white/[0.04]"
                  }
                >
                  {link.label} {"\u2197"}
                </a>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Story Detail Modal */}
      <Modal isOpen={!!selectedStory} onClose={() => setSelectedStory(null)} title={selectedStory?.title ?? ""} wide>
        {selectedStory && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <GlassBadge category={selectedStory.category} />
              <span className="text-[10px] font-mono text-white/25">{selectedStory.source}</span>
            </div>

            <div className="text-sm text-white/65 leading-relaxed space-y-3">
              {selectedStory.detail.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {selectedStory.tags && selectedStory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                {selectedStory.tags.map((tag) => (
                  <GlassTag key={tag} tag={tag} />
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.06]">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">
                Key Takeaway
              </p>
              <p className="text-sm text-cosmic-light">{selectedStory.takeaway}</p>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
