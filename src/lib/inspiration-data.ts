import type { InspirationItem } from "./types"

export const SAMPLE_INSPIRATION: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Granola — AI Meeting Notepad",
    creator: "Chris Pedregal",
    description:
      "An AI notepad that listens to your meetings and enhances your rough notes into polished summaries. Not a transcription tool — it augments what you actually write.",
    why_notable:
      "Nailed the UX problem that transcription tools missed: people want to write their own notes, just better. $10M ARR in under a year as a solo-ish product.",
    category: "product",
    image_url: null,
    source_url: null,
    source: "Product Hunt",
    tags: ["ai", "productivity", "saas"],
    build_this: true,
    created_at: "2026-02-27T08:00:00Z",
  },
  {
    id: "insp-2",
    title: "Generative Aurora Shader",
    creator: "@spite",
    description:
      "A real-time WebGL shader that generates aurora borealis effects using noise fields and chromatic aberration. Runs at 120fps on mobile.",
    why_notable:
      "Proves that generative art can be both computationally elegant and visually stunning. The color blending algorithm is genius-level math made visual.",
    category: "creative_tech",
    image_url: null,
    source_url: null,
    source: "Twitter/X",
    tags: ["webgl", "generative-art", "shaders"],
    build_this: false,
    created_at: "2026-02-27T07:30:00Z",
  },
  {
    id: "insp-3",
    title: "Linear's 2026 Redesign",
    creator: "Linear Team",
    description:
      "Complete redesign featuring fluid spring animations, contextual command menus, and a spatial canvas view for project planning. Every interaction feels intentional.",
    why_notable:
      "Set a new bar for what a SaaS dashboard can feel like. The micro-interactions and transitions make enterprise software feel like a creative tool.",
    category: "ui_design",
    image_url: null,
    source_url: null,
    source: "Twitter/X",
    tags: ["design-system", "animations", "saas"],
    build_this: false,
    created_at: "2026-02-26T22:00:00Z",
  },
  {
    id: "insp-4",
    title: "Doodle-to-Game Engine",
    creator: "@maxbittker",
    description:
      "Draw a rough sketch on paper, point your phone camera at it, and the AI turns it into a playable 2D platformer in real-time. Characters, physics, and everything.",
    why_notable:
      "The most creative use of multimodal AI I've seen. Takes the 'AI generates code' idea and makes it tactile and fun. Kids go absolutely wild with it.",
    category: "creative_tech",
    image_url: null,
    source_url: null,
    source: "GitHub",
    tags: ["ai", "games", "computer-vision"],
    build_this: true,
    created_at: "2026-02-26T18:00:00Z",
  },
  {
    id: "insp-5",
    title: "Raycast-Style Command Palette Site",
    creator: "@emilkowalski_",
    description:
      "A personal portfolio built entirely around a command palette interface. Navigate everything with keyboard shortcuts, fuzzy search, and contextual actions.",
    why_notable:
      "Rethinks what a personal website can be. Zero scrolling, pure intent-driven navigation. The spring animations and blur effects are pixel-perfect.",
    category: "ui_design",
    image_url: null,
    source_url: null,
    source: "Twitter/X",
    tags: ["portfolio", "command-palette", "animations"],
    build_this: true,
    created_at: "2026-02-26T15:00:00Z",
  },
  {
    id: "insp-6",
    title: "AI Product Photoshoot Studio",
    creator: "Flair AI",
    description:
      "Upload a product photo and generate studio-quality lifestyle shots with custom backgrounds, lighting, and styling. Replaces $5K photoshoots with a $20/mo subscription.",
    why_notable:
      "Solves a real pain point for e-commerce sellers. The quality gap between AI-generated and real photography has essentially closed for product shots.",
    category: "product",
    image_url: null,
    source_url: null,
    source: "Product Hunt",
    tags: ["ai", "e-commerce", "image-generation"],
    build_this: true,
    created_at: "2026-02-26T12:00:00Z",
  },
  {
    id: "insp-7",
    title: "Spatial Music Visualizer",
    creator: "@mattdesl",
    description:
      "A 3D audio visualizer that creates real-time spatial environments from music. Frequencies map to terrain, rhythm drives camera movement, vocals generate particle trails.",
    why_notable:
      "Creative coding at its finest. Uses Web Audio API analysis piped into Three.js with custom post-processing. The synesthesia effect is mesmerizing.",
    category: "creative_tech",
    image_url: null,
    source_url: null,
    source: "CodePen",
    tags: ["three.js", "audio", "creative-coding"],
    build_this: false,
    created_at: "2026-02-25T20:00:00Z",
  },
  {
    id: "insp-8",
    title: "Glass Morphism Dashboard Kit",
    creator: "@juxtopposed",
    description:
      "Open-source dashboard component library featuring layered glass effects, dynamic blur depths, and gradient mesh backgrounds. Everything animates with spring physics.",
    why_notable:
      "The glass layering technique is genuinely novel — multiple blur depths create a sense of z-space that flat design can't achieve. Gorgeous on dark mode.",
    category: "ui_design",
    image_url: null,
    source_url: null,
    source: "GitHub",
    tags: ["glassmorphism", "components", "open-source"],
    build_this: false,
    created_at: "2026-02-25T16:00:00Z",
  },
  {
    id: "insp-9",
    title: "Voice-First CRM for Freelancers",
    creator: "IndieHacker @sarah_codes",
    description:
      "A CRM where you just talk about your client interactions and it automatically creates contacts, logs notes, sets follow-ups, and tracks deals. Zero manual data entry.",
    why_notable:
      "Flips the CRM model on its head. Instead of filling forms, you just narrate your day. Hit $8K MRR in 3 months. The NLP pipeline for extracting structured data from casual speech is impressive.",
    category: "product",
    image_url: null,
    source_url: null,
    source: "Indie Hackers",
    tags: ["ai", "crm", "voice", "indie"],
    build_this: true,
    created_at: "2026-02-25T10:00:00Z",
  },
  {
    id: "insp-10",
    title: "Terminal That Looks Like a Spaceship",
    creator: "@warp_dev",
    description:
      "A custom terminal emulator themed like a sci-fi spaceship cockpit. HUD-style overlays, holographic syntax highlighting, and command history displayed as a star map.",
    why_notable:
      "Pure joy engineering. Zero commercial purpose, maximum vibes. The attention to detail in the animations — from the boot sequence to the cursor glow — is insane.",
    category: "creative_tech",
    image_url: null,
    source_url: null,
    source: "Twitter/X",
    tags: ["terminal", "sci-fi", "design"],
    build_this: false,
    created_at: "2026-02-24T22:00:00Z",
  },
]
