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

const CATEGORY_COLORS: Record<TechCategory, string> = {
  ai_ml: "text-cosmic-light border-cosmic/40 bg-cosmic/15",
  twitter_buzz: "text-sky-400 border-sky-500/40 bg-sky-500/15",
  web_dev: "text-electric-light border-electric/40 bg-electric/15",
  infra_devops: "text-teal-400 border-teal-500/40 bg-teal-500/15",
  startups: "text-amber-light border-amber/40 bg-amber/15",
  open_source: "text-emerald-400 border-emerald-500/40 bg-emerald-500/15",
  india_tech: "text-orange-400 border-orange-500/40 bg-orange-500/15",
  tools: "text-cyan-400 border-cyan-500/40 bg-cyan-500/15",
  mobile: "text-pink-400 border-pink-500/40 bg-pink-500/15",
  security: "text-red-400 border-red-500/40 bg-red-500/15",
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
    () => (activeCategory === "all" ? parsed.stories : parsed.stories.filter((s) => s.category === activeCategory)),
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
          className={`text-xs px-4 py-2 rounded-lg border transition-all font-medium ${
            activeTab === "news"
              ? "border-cosmic/40 bg-cosmic/15 text-cosmic-light"
              : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
          }`}
        >
          News ({newsCount})
        </button>
        <button
          onClick={() => {
            setActiveTab("discourse")
            setActiveCategory("all")
          }}
          className={`text-xs px-4 py-2 rounded-lg border transition-all font-medium ${
            activeTab === "discourse"
              ? "border-sky-500/40 bg-sky-500/15 text-sky-400"
              : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
          }`}
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
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCategory("all")}
                className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all ${
                  activeCategory === "all"
                    ? "border-white/30 bg-white/10 text-white/80"
                    : "border-white/10 text-white/40 hover:border-white/20"
                }`}
              >
                All ({newsCount})
              </button>
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                    activeCategory === cat
                      ? CATEGORY_COLORS[cat]
                      : "border-white/10 text-white/40 hover:border-white/20"
                  }`}
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
                  <motion.div
                    key={`news-${story.title}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <GlassCard hover onClick={() => setSelectedStory(story)}>
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium text-white/90 leading-snug">{story.title}</h3>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${CATEGORY_COLORS[story.category]}`}
                          >
                            {CATEGORY_ICONS[story.category]} {CATEGORY_LABELS[story.category]}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-white/30">{story.source}</p>
                        <p className="text-xs text-white/55 leading-relaxed">{story.summary}</p>
                        {story.tags && story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {story.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/25 font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <p className="text-xs text-cosmic-light/60">
                            <span className="text-[10px] font-mono text-white/20 mr-1.5">TAKEAWAY</span>
                            {story.takeaway}
                          </p>
                          <span className="text-[10px] text-white/20 shrink-0 ml-2">Read more {"\u2192"}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
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
                <h2 className="text-xs font-mono text-sky-400/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{"\u{1D54F}"}</span> Hot Takes
                </h2>
                <div className="space-y-2">
                  {hotTakes.map((take, i) => (
                    <motion.div
                      key={`take-${take.handle}-${i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard hover={false} className="border-l-2 border-l-sky-500/30">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white/80">{take.author}</span>
                            <span className="text-[10px] font-mono text-sky-400/50">{take.handle}</span>
                          </div>
                          <p className="text-xs text-white/60 leading-relaxed">{take.text}</p>
                          <p className="text-[10px] font-mono text-white/20">{take.engagement}</p>
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
                <h2 className="text-xs font-mono text-sky-400/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{"\u{1F4AC}"}</span> Featured Discussions
                </h2>
                <div className="space-y-3">
                  {discussions.map((story, i) => (
                    <motion.div
                      key={`disc-${story.title}-${i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard hover onClick={() => setSelectedStory(story)}>
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-sm font-medium text-white/90 leading-snug">{story.title}</h3>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${CATEGORY_COLORS[story.category]}`}
                            >
                              {CATEGORY_ICONS[story.category]} {CATEGORY_LABELS[story.category]}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-white/30">{story.source}</p>
                          <p className="text-xs text-white/55 leading-relaxed">{story.summary}</p>
                          {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {story.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/25 font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <p className="text-xs text-cosmic-light/60">
                              <span className="text-[10px] font-mono text-white/20 mr-1.5">TAKEAWAY</span>
                              {story.takeaway}
                            </p>
                            <span className="text-[10px] text-white/20 shrink-0 ml-2">Read more {"\u2192"}</span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
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
            <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-3">Quick Links</h3>
            <div className="flex flex-wrap gap-2">
              {parsed.quick_links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[selectedStory.category]}`}>
                {CATEGORY_ICONS[selectedStory.category]} {CATEGORY_LABELS[selectedStory.category]}
              </span>
              <span className="text-[10px] font-mono text-white/30">{selectedStory.source}</span>
            </div>

            <div className="text-sm text-white/70 leading-relaxed space-y-3">
              {selectedStory.detail.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {selectedStory.tags && selectedStory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                {selectedStory.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/30 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/5">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider mb-1">Key Takeaway</p>
              <p className="text-sm text-cosmic-light/70">{selectedStory.takeaway}</p>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
