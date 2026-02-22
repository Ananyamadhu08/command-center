"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, AtSign, Globe, Cloud, Rocket, Package, Flag, Wrench, Smartphone, Lock, Zap, MessageCircle, ExternalLink } from "lucide-react"
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

const CATEGORY_ICONS: Record<TechCategory, React.ReactNode> = {
  ai_ml: <Brain size={12} />,
  twitter_buzz: <AtSign size={12} />,
  web_dev: <Globe size={12} />,
  infra_devops: <Cloud size={12} />,
  startups: <Rocket size={12} />,
  open_source: <Package size={12} />,
  india_tech: <Flag size={12} />,
  tools: <Wrench size={12} />,
  mobile: <Smartphone size={12} />,
  security: <Lock size={12} />,
}

const CATEGORY_GLASS: Record<TechCategory, string> = {
  ai_ml: "bg-violet-500/[0.08] border-violet-400/20 text-violet-300",
  twitter_buzz: "bg-sky-500/[0.08] border-sky-400/20 text-sky-300",
  web_dev: "bg-blue-500/[0.08] border-blue-400/20 text-blue-300",
  infra_devops: "bg-teal-500/[0.08] border-teal-400/20 text-teal-300",
  startups: "bg-amber-500/[0.08] border-amber-400/20 text-amber-300",
  open_source: "bg-emerald-500/[0.08] border-emerald-400/20 text-emerald-300",
  india_tech: "bg-orange-500/[0.08] border-orange-400/20 text-orange-300",
  tools: "bg-cyan-500/[0.08] border-cyan-400/20 text-cyan-300",
  mobile: "bg-pink-500/[0.08] border-pink-400/20 text-pink-300",
  security: "bg-red-500/[0.08] border-red-400/20 text-red-300",
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
        "backdrop-blur-md border " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] " +
        CATEGORY_GLASS[category]
      }
    >
      <span className="leading-none">{CATEGORY_ICONS[category]}</span>
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

          {/* Takeaway */}
          <div className="pt-2.5 border-t border-white/[0.06] space-y-1.5">
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
              Takeaway
            </span>
            <p className="text-xs text-cosmic-light leading-relaxed">{story.takeaway}</p>
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
      <div className="flex items-center gap-3 mb-3">
        <Zap size={24} className="text-cosmic-light" />
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
            <div className="flex flex-wrap gap-2">
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
                  <span>{CATEGORY_ICONS[cat]}</span>
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
                  <AtSign size={12} /> Hot Takes
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
                  <MessageCircle size={12} /> Featured Discussions
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
                  {link.label} <ExternalLink size={10} className="inline ml-0.5" />
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

            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
                Key Takeaway
              </span>
              <p className="text-sm text-cosmic-light leading-relaxed">{selectedStory.takeaway}</p>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
