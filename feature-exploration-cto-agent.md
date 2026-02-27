# Feature Exploration: CTO Agent — Inspiration to PRD Pipeline

**Status:** Planned for v2
**Date discussed:** 2026-02-27
**Priority:** Post-v1, after browser extension and core features are stable

---

## The Problem

Currently the workflow from inspiration to building is fragmented:
1. See something inspiring in Command Center
2. Copy the idea over to GPT
3. Talk to a CTO agent there to refine requirements
4. Get a PRD generated
5. Manually hand the PRD to a coding agent (Stitch, Claude Code, Cursor, etc.)

This breaks flow and loses context. The inspiration data (description, features, tech stack, why it's notable) has to be re-explained manually.

## The Vision

An integrated CTO agent inside Command Center that takes you from **inspiration → conversation → PRD** in one flow. No context switching, no copy-pasting between tools.

### How It Works

1. **Trigger:** User clicks "Build This" on any inspiration item
2. **Opens a chat interface** — the agent already has full context from the inspiration item
3. **The agent acts as a CTO** — it doesn't just write a doc, it interrogates the idea:
   - Challenges assumptions: "Why would someone use this over X?", "What's the moat?"
   - Extracts requirements: "Who's the primary user?", "What's the first thing they do?"
   - Asks clarifying questions: "You said real-time — WebSockets or polling?", "What specifically is the AI doing?"
   - Pushes back on scope: "That's 6 months of work. What ships in 2 weeks?", "Do you need auth for MVP?"
   - Doesn't let vague answers slide — keeps digging until the product is well-defined
4. **Back-and-forth conversation** — typically 5-15 messages of refinement
5. **PRD generation** — user says "generate the PRD" and the agent compiles everything into structured markdown
6. **Export** — the markdown file is designed to be agent-friendly, droppable into any coding agent

### The CTO Agent's Personality

- Technical co-founder energy, not a yes-man
- Questions everything, especially scope creep
- Forces specificity — "uses AI" becomes "uses Claude API to extract structured data from voice input via Whisper transcription"
- Thinks about MVP vs full vision
- Considers technical feasibility and suggests trade-offs

### PRD Output Structure

The generated markdown should include:
- **Product overview** — one paragraph summary
- **Problem statement** — what pain point this solves
- **Target users** — who specifically
- **Unique angle** — how this differs from the inspiration source
- **Core features (MVP)** — numbered, with acceptance criteria
- **Future features (v2+)** — what's explicitly out of scope for now
- **Technical requirements** — suggested stack, APIs, infrastructure
- **Data model** — key entities and relationships
- **User flows** — primary journeys described step by step
- **Open questions** — things still to be decided
- **Success metrics** — how you know it's working

## UX Considerations

- **Chat lives inside Command Center** — new view/page that opens from the inspiration detail modal
- **Agent's first message is contextual** — "Interesting — so you want to build something like [title]. Let me understand your angle..."
- **Conversation persists** — can come back and refine later
- **PRD gets saved** — tied to a project or downloadable as .md

## Technical Considerations

- Needs an LLM backend (Claude API via FastAPI)
- Chat history storage (database — ties into the broader storage discussion)
- The CTO agent prompt needs to be carefully crafted (user has an existing prompt from GPT to adapt)
- Could potentially tie PRD output into the Projects page (auto-create project + tasks from MVP scope)
- Memory system may be needed for the agent to remember past conversations

## Dependencies

- FastAPI backend needs to be set up first
- Database/storage solution for chat history and generated PRDs
- Claude API integration
- Browser extension work should be completed first (higher priority for v1)

## Why Wait for v2

- This is a product-within-a-product — needs proper architecture
- Storage, memory, and backend systems need to be solid first
- Core features (browser extension, existing pages) should be stable
- Don't want to rush this — the CTO agent quality depends on good prompt engineering and UX iteration

---

*This document captures the full discussion so nothing is lost when we revisit. The user has an existing CTO agent prompt from GPT that should be adapted when implementation begins.*
