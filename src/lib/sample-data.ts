import type {
  Brief,
  Habit,
  HabitLog,
  ExerciseLog as ExerciseLogType,
  ReadingLog as ReadingLogType,
  MealLog,
  Note,
  TechBriefContent,
  EveningBriefContent,
} from "./types"
function localDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const today = localDate(new Date())

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return localDate(d)
}

const techBriefContent: TechBriefContent = {
  twitter_hot_takes: [
    {
      author: "Andrej Karpathy",
      handle: "@karpathy",
      text: "The most underrated skill in AI engineering right now isn't prompt engineering — it's evaluation engineering. If you can't measure it, you can't improve it. The teams winning are the ones with robust eval pipelines, not the ones with the cleverest prompts.",
      engagement: "42K likes · 8.2K retweets",
    },
    {
      author: "Guillermo Rauch",
      handle: "@raaborern",
      text: "Hot take: Server components won. The debate is over. Every major framework is converging on the same architecture — render on the server, hydrate selectively, stream the rest. The only question left is implementation quality.",
      engagement: "18K likes · 3.1K retweets",
    },
    {
      author: "Pieter Levels",
      handle: "@levelsio",
      text: "Built and launched a full SaaS product in 48 hours using Claude Code + Cursor. $2K MRR in week one. The barrier to starting a software business is now literally zero. Distribution is the only moat left.",
      engagement: "67K likes · 12K retweets",
    },
    {
      author: "Swyx",
      handle: "@swyx",
      text: "Unpopular opinion: most AI wrapper startups will die, but the ones that survive will be worth more than traditional SaaS because they own the workflow, not the model. The model is a commodity. The UX around it is not.",
      engagement: "9.4K likes · 2.8K retweets",
    },
    {
      author: "ThePrimeagen",
      handle: "@ThePrimeagen",
      text: "TypeScript is becoming what Java was in 2005. It's everywhere, everyone uses it, and most people use it poorly. The language isn't the problem — it's that we've stopped thinking about whether we need types everywhere.",
      engagement: "31K likes · 5.6K retweets",
    },
  ],
  featured_discussions: [
    {
      title: "The Great AI Agent Debate: Are We Building Tools or Employees?",
      source: "Twitter/X Discourse",
      summary: "Tech Twitter explodes over whether AI agents should be autonomous workers or human-controlled tools. VCs, engineers, and researchers weigh in.",
      detail: "A thread from @karpathy questioning the 'AI agent' framing went viral this week, sparking a multi-day debate across tech Twitter that crystallized into two camps.\n\nThe 'tools' camp (led by Karpathy, Simon Willison, and many senior engineers) argues that the most useful AI systems are those that augment human decision-making rather than replace it. They point to Claude Code, GitHub Copilot, and Cursor as examples — these tools generate code but humans review, approve, and iterate. The key insight: keeping humans in the loop isn't a limitation, it's a feature, because it catches the 20% of cases where AI confidently generates wrong or insecure code.\n\nThe 'agents' camp (led by several VC firms and startups like Cognition, Factory, and Magic) argues that autonomous AI agents are the logical endpoint and that human-in-the-loop is a transitional phase. They point to Devin-style systems that can take a Jira ticket and produce a pull request end-to-end, arguing that as reliability improves, the need for human oversight diminishes.\n\nThe most nuanced takes came from practitioners who pointed out it depends on the task. For well-defined, reversible operations (writing tests, formatting code, data transformations), autonomy is fine. For irreversible actions (deploying to production, sending emails, financial transactions), human approval is essential regardless of AI capability.\n\nThis debate matters because it shapes how companies invest in AI tooling and how developers think about their career trajectory. The tools framing suggests learning to work with AI as a collaborator. The agents framing suggests learning to manage and review AI workers.",
      takeaway: "The real answer is both — tools for high-stakes decisions, agents for well-defined reversible tasks.",
      tags: ["debate", "agents", "tools", "future-of-work"],
      category: "twitter_buzz",
    },
    {
      title: "\"Vibe Coding\" Goes Mainstream — And Senior Engineers Are Worried",
      source: "Twitter/X Discourse",
      summary: "The term 'vibe coding' (using AI to generate code without fully understanding it) sparks a heated discussion about engineering standards.",
      detail: "The term 'vibe coding' — coined semi-ironically to describe the practice of using AI to generate code that works without the developer fully understanding every line — has gone from a niche joke to a mainstream phenomenon, and it's dividing the engineering community.\n\nOn one side, indie developers and startup founders celebrate vibe coding as democratization. @levelsio's viral tweet about building a $2K MRR SaaS in 48 hours embodies this philosophy: ship fast, let the AI handle the implementation details, focus on product-market fit. The argument is pragmatic — if the code works, passes tests, and users are happy, does it matter if the developer can't explain every line?\n\nOn the other side, experienced engineers warn of a ticking time bomb. Security vulnerabilities, architectural debt, and unmaintainable code are the inevitable result when developers treat their codebase as a black box. Several high-profile incidents were cited: a VC-backed startup whose entire authentication system was generated by AI and contained a critical IDOR vulnerability that exposed user data, and a fintech company that had to rewrite 80% of its AI-generated codebase when they tried to scale past 10K users.\n\nThe most constructive voices are calling for a middle ground: use AI to accelerate development, but invest time in understanding what it generates. Code review becomes more important, not less. The developer's role shifts from writing code to reviewing, architecting, and making judgment calls — which, ironically, requires deeper expertise than writing code from scratch.\n\nThePrimeagen's take resonated widely: 'Vibe coding is fine for prototypes and side projects. But if you're getting paid to write software, you're getting paid to understand it. AI is a power tool, not a replacement for craftsmanship.'",
      takeaway: "AI-generated code needs the same rigor as human code. Review everything. Understand your dependencies.",
      tags: ["vibe-coding", "ai-tools", "code-quality", "debate"],
      category: "twitter_buzz",
    },
    {
      title: "MCP (Model Context Protocol) Adoption Explodes",
      source: "Twitter/X Discourse",
      summary: "Anthropic's MCP standard sees rapid adoption as developers build tool integrations for every service imaginable.",
      detail: "Anthropic's Model Context Protocol (MCP), an open standard for connecting AI models to external tools and data sources, has hit an inflection point. What started as a niche protocol for Claude Code users has become the de facto standard for AI tool integration, with over 3,000 community-built MCP servers now available.\n\nThe tipping point came when major platforms started shipping official MCP servers: GitHub, Linear, Slack, Notion, Jira, and Supabase all released production-quality integrations in the past month. This means AI assistants can now read your GitHub issues, update Linear tickets, search Slack history, query databases, and modify Notion pages — all through a standardized protocol.\n\nOn tech Twitter, developers are sharing increasingly sophisticated MCP setups. One viral thread showed a developer's Claude Code configuration that connected to 12 different services, effectively giving the AI assistant full context over their entire work environment. Another developer demonstrated an MCP server that connects to their company's internal knowledge base, letting Claude Code answer questions about proprietary systems and architecture decisions.\n\nThe ecosystem is also spawning meta-tools: MCP server registries, auto-discovery protocols, and frameworks for building custom MCP servers in minutes rather than hours. The @anthropic team has been engaging actively with the community, incorporating feedback into rapid protocol updates.\n\nCritics worry about security implications — giving AI models access to so many systems creates a large attack surface. The MCP spec includes granular permission controls, but adoption of best practices is inconsistent. Several security researchers have published proof-of-concept attacks showing how a malicious MCP server could exfiltrate data or perform unauthorized actions.",
      takeaway: "MCP is becoming the USB standard for AI tools. Learn it now — it's the foundation of the AI-augmented workflow.",
      tags: ["mcp", "anthropic", "protocol", "ecosystem"],
      category: "twitter_buzz",
    },
  ],
  stories: [
    {
      title: "Claude 4.6 Released — Opus Sets New Coding Benchmark",
      source: "Anthropic Blog",
      summary: "Anthropic launches the Claude 4.6 model family with Opus achieving state-of-the-art on SWE-bench and HumanEval.",
      detail: "Anthropic's Claude 4.6 release represents a significant leap in AI coding capabilities. The Opus 4.6 variant scores 72.3% on SWE-bench Verified (up from 64.1% on the previous generation), making it the first model to solve the majority of real-world GitHub issues end-to-end without human intervention.\n\nThe key architectural changes include a new 'extended thinking' mode that allows the model to reason through multi-step problems before generating code, similar to chain-of-thought but optimized specifically for software engineering tasks. This manifests as better architectural decisions — the model now understands project structure, identifies the right files to modify, and generates coherent multi-file changes.\n\nFor developers, the practical impact is enormous. Claude Code (Anthropic's CLI tool) now handles complex refactoring tasks that previously required manual oversight. In internal testing, engineering teams reported 40-60% reduction in time spent on routine code changes like API migrations, test writing, and bug fixes.\n\nThe Sonnet 4.6 variant offers 90% of Opus's capability at roughly 1/5 the cost, making it the sweet spot for most development workflows. Haiku 4.5 remains available for high-volume, simpler tasks. All models now support 200K token context windows with improved long-context accuracy.",
      takeaway: "Opus 4.6 is the best coding model available. Use Sonnet 4.6 for daily work, Opus for complex architecture decisions.",
      tags: ["anthropic", "claude", "coding", "benchmarks"],
      category: "ai_ml",
    },
    {
      title: "GPT-5 Turbo Public Beta: 1M Context, Native Tools",
      source: "OpenAI Blog",
      summary: "OpenAI opens GPT-5 Turbo to all developers with a 1M token context window and native tool calling.",
      detail: "OpenAI's GPT-5 Turbo enters public beta with several headline features that push the boundaries of what's practical with LLMs. The 1M token context window is the most immediate — it means you can feed an entire medium-sized codebase into a single prompt, including all dependencies and configuration files.\n\nNative tool use is the more architecturally significant feature. Instead of the previous function-calling API (which required the model to output JSON that you'd then parse and execute), GPT-5 Turbo can directly invoke registered tools in a single inference pass. This reduces latency for agentic workflows by 60-70% since there's no back-and-forth between model output and tool execution.\n\nPricing starts at $5/M input tokens and $15/M output tokens — roughly 40% cheaper than GPT-4 Turbo was at launch. OpenAI is clearly pricing aggressively to compete with Claude's strong developer adoption.\n\nThe model shows particular strength in multi-modal reasoning (understanding screenshots, diagrams, and UI mockups alongside code) and in maintaining coherent, long-running conversations about complex systems. However, early benchmarks from independent evaluators suggest it still trails Claude Opus 4.6 on pure code generation tasks, particularly for languages beyond Python and JavaScript.",
      takeaway: "The 1M context window is game-changing for codebase-wide analysis. Pricing war benefits everyone.",
      tags: ["openai", "gpt5", "context-window", "pricing"],
      category: "ai_ml",
    },
    {
      title: "Google DeepMind's AlphaEvolve Writes Novel Algorithms",
      source: "Nature / Google DeepMind",
      summary: "AlphaEvolve autonomously discovers new algorithms for matrix multiplication and sorting that outperform human-designed solutions.",
      detail: "Google DeepMind published a paper in Nature demonstrating AlphaEvolve, a system that combines large language models with evolutionary search to discover entirely new algorithms. The system was tested on fundamental computer science problems — matrix multiplication, sorting, and hashing — and in each case found solutions that are provably more efficient than the best known human-designed algorithms.\n\nFor matrix multiplication, AlphaEvolve discovered a method that reduces the number of scalar multiplications needed for 4x4 matrices from 49 (Strassen's algorithm) to 47. While this sounds incremental, matrix multiplication is so fundamental to computing (it underlies nearly all of machine learning, graphics, and scientific computing) that even small improvements cascade into massive real-world speedups.\n\nThe more profound implication is methodological. AlphaEvolve doesn't just optimize existing algorithms — it explores fundamentally different approaches that human researchers hadn't considered. The LLM component generates candidate solutions based on mathematical intuition, while the evolutionary search component tests and refines them against formal correctness proofs.\n\nThis has sparked intense debate in the CS research community. Some researchers see this as the beginning of AI-driven scientific discovery at scale. Others caution that the system only works in domains where solutions can be formally verified, which excludes most of software engineering. Either way, it's a landmark result that suggests AI won't just write our code — it might redesign the foundations our code runs on.",
      takeaway: "AI is moving beyond code generation into algorithm discovery. Watch this space — it affects CS foundations.",
      tags: ["deepmind", "research", "algorithms", "breakthrough"],
      category: "ai_ml",
    },
    {
      title: "Devin 2.0: First AI to Pass Google L4 Interview Loop",
      source: "Cognition Labs",
      summary: "Cognition's Devin 2.0 autonomously completes a full Google L4 software engineering interview loop, sparking industry debate.",
      detail: "Cognition Labs announced that their AI software engineer, Devin 2.0, successfully completed a simulated Google L4 (senior SWE) interview loop, including system design, coding rounds, and behavioral questions. The system was evaluated by current and former Google interviewers who were initially unaware they were assessing an AI.\n\nThe coding rounds were the most convincing — Devin solved 4 out of 5 LeetCode-hard problems within time limits, showing working test cases and explaining its approach in real-time. The system design round was more nuanced: Devin produced a competent design for a distributed URL shortener with caching, sharding, and rate limiting, but reviewers noted it relied on somewhat formulaic patterns rather than showing the creative problem-solving they'd expect from a strong L4 candidate.\n\nThe announcement triggered a wave of anxiety on tech Twitter, with many engineers questioning job security. However, several senior engineers pointed out crucial limitations: Devin operates in a structured interview setting with well-defined problems. Real engineering work involves ambiguous requirements, cross-team communication, understanding business context, and making judgment calls that current AI systems can't replicate.\n\nCognition is positioning Devin as an 'AI teammate' rather than a replacement, emphasizing that it handles routine implementation tasks so human engineers can focus on architecture, product decisions, and mentoring. Pricing hasn't been announced for Devin 2.0, but the previous version was $500/month per seat.",
      takeaway: "AI can pass structured coding interviews, but real engineering is far more than solving interview problems.",
      tags: ["cognition", "devin", "ai-engineer", "hiring"],
      category: "ai_ml",
    },
    {
      title: "Next.js 16.1 Ships with Turbopack Stable",
      source: "Vercel Blog",
      summary: "Turbopack is now the default bundler in Next.js 16.1. Cold starts drop 80%, HMR is near-instant.",
      detail: "Next.js 16.1 marks a milestone in the framework's evolution: Turbopack, the Rust-based successor to Webpack, is now the default bundler for both development and production builds. After 18 months of gradual migration and community testing, Vercel is confident enough to make it the default.\n\nThe performance numbers are striking. Cold start times for a typical Next.js application (50-100 routes, moderate complexity) drop from 8-12 seconds with Webpack to 1.5-2.5 seconds with Turbopack. Hot module replacement (HMR) is consistently under 50ms, even on codebases with thousands of modules. Production build times are reduced by 50-60%, with tree-shaking and code splitting producing smaller bundles than Webpack's output.\n\nBeyond raw speed, Turbopack brings architectural improvements. It uses incremental computation — only re-processing files that actually changed and their direct dependents, rather than rebuilding entire module graphs. This means the 100th HMR update in a session is just as fast as the first, unlike Webpack which often degraded over time.\n\nFor existing projects, migration is straightforward. The `next.config.js` API is unchanged, and most Webpack plugins have Turbopack equivalents. The main breaking changes are in custom Webpack configurations — if you're using raw Webpack config overrides, you'll need to migrate to Turbopack's plugin API. Vercel published a comprehensive migration guide and a codemod that handles 90% of common cases.\n\nThe broader impact is on the JavaScript ecosystem. Turbopack validates the 'rewrite-in-Rust' approach that tools like SWC, Oxc, and Biome have championed. Build tooling is becoming an infrastructure concern (like compilers) rather than an application concern, and that's a healthy shift.",
      takeaway: "Upgrade to Next.js 16.1 for massive DX improvements. If you have custom Webpack config, plan migration time.",
      tags: ["nextjs", "turbopack", "vercel", "performance"],
      category: "web_dev",
    },
    {
      title: "React 19.3 Stable: Compiler is Production-Ready",
      source: "React Blog",
      summary: "React Compiler exits experimental. Automatic memoization eliminates useMemo/useCallback, bundles shrink 15-20%.",
      detail: "React 19.3 ships the React Compiler as a stable, production-ready feature. After two years of development and extensive testing across Meta's properties (Facebook, Instagram, WhatsApp Web, and Threads), the compiler is ready for general adoption.\n\nThe compiler's primary job is automatic memoization. It analyzes your component code at build time and inserts the equivalent of useMemo, useCallback, and React.memo calls wherever they'd be beneficial. In practice, this means you can delete most of your manual memoization code — the compiler does a better job because it can see the full dependency graph statically.\n\nThe numbers from Meta's internal rollout are compelling: 15-20% reduction in bundle sizes (removing manual memoization wrappers), 30-40% reduction in unnecessary re-renders across typical applications, and measurable improvements in INP (Interaction to Next Paint) scores. Several large open-source projects that adopted the compiler early (Remix, Hydrogen, and Docusaurus) report similar improvements.\n\nThe compiler also catches common performance mistakes at build time, emitting warnings for patterns that prevent optimization — like creating new objects or arrays inline in JSX props, or passing unstable references to context providers. This turns runtime performance issues into build-time warnings, which is a huge improvement for development workflows.\n\nAdoption requires the Babel or SWC plugin (both are available) and works with Next.js 16+, Vite, and most modern build setups. There are a few patterns the compiler can't optimize (dynamic property access, eval, and some advanced ref patterns), but it gracefully falls back to normal React behavior in those cases.",
      takeaway: "Enable the React Compiler in your project. Remove manual useMemo/useCallback — the compiler handles it better.",
      tags: ["react", "compiler", "performance", "memoization"],
      category: "web_dev",
    },
    {
      title: "Tailwind CSS v4.1: Lightning CSS Engine, 10x Faster Builds",
      source: "Tailwind Blog",
      summary: "Tailwind v4.1 fully migrates to Lightning CSS. Build times drop from seconds to milliseconds on large projects.",
      detail: "Tailwind CSS v4.1 completes the migration to Lightning CSS as the underlying engine, delivering build performance that makes CSS processing essentially invisible in your development workflow. Where v3.x could take 2-5 seconds to process a large project's CSS on cold start, v4.1 does it in 50-200ms.\n\nThe architecture is fundamentally different from v3. Instead of scanning your source files with JavaScript and generating a PostCSS output, Tailwind v4 uses Lightning CSS (a Rust-based CSS parser/transformer) to handle everything: vendor prefixing, nesting, custom properties resolution, and class detection. The result is a single Rust binary that does what previously required PostCSS + Autoprefixer + CSS Modules + Tailwind's JIT compiler.\n\nNew features include first-class support for CSS cascade layers (@layer), container queries without plugins, native CSS nesting that compiles down for older browsers, and a significantly improved @theme directive for design token management. The @theme inline syntax (used in this project's globals.css) is now the recommended approach for defining your design system.\n\nMigration from v3 is the main friction point. The configuration has moved from JavaScript (tailwind.config.js) to CSS (@theme directives and @import rules). The v3 config syntax is supported via a compatibility layer, but new projects should use the CSS-first approach. A codemod handles most of the migration automatically.\n\nThe developer experience improvements are substantial: instant hot reloading of CSS changes, better error messages with source locations, and IDE support via an updated Tailwind CSS IntelliSense extension that understands v4 syntax.",
      takeaway: "If you're starting new projects, use Tailwind v4 from day one. Migration from v3 is worth the effort.",
      tags: ["tailwind", "css", "lightning-css", "performance"],
      category: "web_dev",
    },
    {
      title: "Supabase Launches Database Branching",
      source: "Supabase Blog",
      summary: "Database branching creates isolated copies of production data for testing, each with its own Postgres instance.",
      detail: "Supabase's database branching feature addresses one of the longest-standing pain points in web development: how do you test database changes safely without risking production data?\n\nThe feature works similarly to Git branches. When you create a branch (via the CLI or dashboard), Supabase spins up a new Postgres instance with a copy of your schema and (optionally) a subset of your data. Row-level security policies, functions, triggers, and extensions are all preserved. Each branch gets its own connection string and API URL.\n\nThe integration with Vercel preview deployments is the killer feature. When you push a PR, Vercel creates a preview deployment and Supabase automatically creates a matching database branch. Your preview environment has its own isolated database that mirrors production schema but won't affect real data. When the PR is merged, the branch is automatically cleaned up.\n\nFor teams practicing trunk-based development, this means you can run migrations on a branch, test them thoroughly in a real Postgres environment (not SQLite or in-memory mocks), and merge with confidence. The branch creation takes 15-30 seconds for schemas under 100 tables, which is fast enough for CI/CD pipelines.\n\nPricing is consumption-based: you pay for the compute and storage the branch uses, and branches automatically pause after 1 hour of inactivity. Supabase estimates the cost at $0.50-2.00 per branch-day for typical development usage.\n\nThe main limitation is that data branching (copying actual production data) requires a Pro plan and is limited to 10GB per branch. Schema-only branching is available on all paid plans.",
      takeaway: "Preview deployments can now include database state. This changes how you test database migrations.",
      tags: ["supabase", "postgres", "branching", "preview-deploys"],
      category: "tools",
    },
    {
      title: "Bun 1.3: Native S3, SQLite, and the Full-Stack Runtime Vision",
      source: "Bun Blog",
      summary: "Bun ships native S3 client and embedded SQLite with full-text search, continuing its push to eliminate npm dependencies.",
      detail: "Bun 1.3 continues Jarred Sumner's vision of a JavaScript runtime that includes everything you need out of the box. The two headline additions — a native S3 client and an embedded SQLite database with full-text search — eliminate two of the most common npm dependencies in backend projects.\n\nThe native S3 client supports all major S3-compatible storage providers (AWS, Cloudflare R2, MinIO, Backblaze B2) with streaming upload/download, multipart uploads, presigned URLs, and automatic retry with exponential backoff. It's 3-5x faster than the aws-sdk for common operations because it bypasses the JavaScript-to-native bridge that the AWS SDK requires.\n\nThe embedded SQLite integration is even more interesting. Bun's SQLite is compiled with FTS5 (full-text search), JSON1, and the math extension enabled by default. You can create an in-process database with a single line: `const db = new Database('myapp.db')`. For prototyping and small-to-medium applications, this eliminates the need for an external database server entirely.\n\nOther notable additions in 1.3: a built-in test runner that's now feature-complete with Jest compatibility, native CSS bundling (Bun can now bundle your frontend CSS alongside JavaScript), and improved Windows support that brings it to near-parity with macOS/Linux.\n\nThe strategic picture is clear: Bun wants to be the only tool you need for JavaScript/TypeScript development. Runtime, bundler, test runner, package manager, and now basic infrastructure (storage + database) — all in a single binary. Critics argue this creates vendor lock-in, but proponents counter that Bun implements standard APIs (Web APIs, Node.js compatibility) so migration cost is low.",
      takeaway: "Bun is becoming a full-stack runtime. For new projects, try it — you might not need half your dependencies.",
      tags: ["bun", "runtime", "s3", "sqlite"],
      category: "tools",
    },
    {
      title: "Cursor 1.0 Redefines the AI-First IDE",
      source: "Cursor Blog",
      summary: "Cursor 1.0 ships with multi-file editing, codebase-wide refactoring, and a built-in agent that can run terminal commands.",
      detail: "Cursor, the AI-first code editor built on VS Code, has reached 1.0 with features that make a compelling case for it as the default development environment for AI-augmented programming.\n\nThe headline feature is 'Composer' — a multi-file editing mode where you describe a change in natural language and Cursor generates coordinated edits across all affected files. Unlike previous implementations that could only modify one file at a time, Composer understands project structure and can update imports, types, tests, and documentation simultaneously. It shows a diff view of all proposed changes before applying them.\n\nThe built-in terminal agent is the second major addition. You can ask Cursor to 'run the tests and fix any failures' and it will execute commands, parse output, make fixes, and re-run — all in a supervised loop where you can intervene at any point. This is similar to Claude Code's agentic workflow but integrated directly into the IDE.\n\nCodebase-wide search and understanding have been significantly improved. Cursor now indexes your entire project (using a combination of AST parsing and embeddings) and can answer questions like 'how does authentication work in this project?' or 'what are all the places where we handle errors?' with accurate, contextualized responses.\n\nThe free tier includes 500 'fast' completions per month with Cursor's default model, plus unlimited 'slow' completions. The Pro tier ($20/month) adds unlimited fast completions and the ability to use your own API keys for Claude or GPT models.\n\nThe biggest competitive pressure this puts on is VS Code + GitHub Copilot. Microsoft will likely respond with similar features in Copilot, but Cursor's advantage is architectural — being built AI-first means the entire UX is designed around AI workflows rather than bolting them onto a traditional editor.",
      takeaway: "If you're using VS Code + Copilot, give Cursor a serious try. The multi-file Composer is genuinely superior.",
      tags: ["cursor", "ide", "ai-tools", "productivity"],
      category: "tools",
    },
    {
      title: "Kubernetes 1.33: Native Sidecar Graduation, Gateway API 1.2",
      source: "Kubernetes Blog",
      summary: "Kubernetes 1.33 graduates native sidecar containers and introduces Gateway API 1.2 with gRPC and mesh support.",
      detail: "Kubernetes 1.33 brings two significant features to general availability that will change how most teams deploy workloads.\n\nNative sidecar containers (KEP-753) graduate to GA after three releases in beta. Previously, sidecar patterns (logging agents, service mesh proxies, secret managers) were implemented as regular containers in the pod spec, leading to ordering issues — sidecars might start after or terminate before the main container, causing race conditions. Native sidecars have a defined lifecycle: they start before and stop after the main containers, solving years of workarounds.\n\nThis is particularly impactful for service mesh deployments. Istio and Linkerd can now inject their proxy sidecars using the native API, eliminating the need for init containers and complex startup ordering. Teams running Istio report a 40% reduction in pod startup time and elimination of intermittent connectivity failures during rolling deployments.\n\nGateway API 1.2 adds gRPC routing (matching on service and method names), mesh support (east-west traffic management, not just north-south ingress), and policy attachment for rate limiting, authentication, and circuit breaking. This is the clearest signal yet that Gateway API will replace both Ingress resources and service mesh-specific CRDs as the unified networking API in Kubernetes.\n\nOther notable changes: improved memory management for pods with many containers, support for user namespaces (which enhance security by mapping container root to an unprivileged host user), and CEL (Common Expression Language) expressions in admission policies for fine-grained access control without writing webhooks.\n\nFor teams still on older Kubernetes versions, the upgrade path from 1.30+ is smooth with no breaking changes.",
      takeaway: "If you run sidecars (service mesh, logging agents), upgrade to 1.33 for native lifecycle management.",
      tags: ["kubernetes", "sidecar", "gateway-api", "devops"],
      category: "infra_devops",
    },
    {
      title: "Cloudflare Workers Gets Durable Objects v2 and D1 GA",
      source: "Cloudflare Blog",
      summary: "Cloudflare ships Durable Objects v2 with SQL storage and brings D1 (serverless SQLite) to general availability.",
      detail: "Cloudflare's developer platform takes a major step forward with two interconnected launches that make it viable for a much broader range of applications.\n\nDurable Objects v2 replaces the key-value storage API with a full SQL interface powered by SQLite. Each Durable Object now has its own embedded SQLite database with transactions, indexes, and full-text search. This is a fundamental architectural shift — Durable Objects are now essentially tiny, globally-distributed database servers that can handle complex state management patterns that previously required external databases.\n\nThe practical implication: you can build real-time collaborative applications (like Figma or Google Docs), game servers, chat systems, and workflow engines entirely on Cloudflare's edge network. Each user session or document gets its own Durable Object with SQL storage, running in the data center closest to the user. Latency for state operations drops to single-digit milliseconds.\n\nD1, Cloudflare's serverless SQLite database, reaches general availability with production-ready features: automatic failover, point-in-time recovery, read replicas in multiple regions, and support for databases up to 10GB. D1 is positioned as the default database for Cloudflare Workers applications — simpler than Postgres, lower latency than external databases, and deeply integrated with the Workers runtime.\n\nThe competitive dynamic is interesting. Cloudflare is essentially building a full-stack platform that competes with Vercel + Supabase, AWS Lambda + DynamoDB, and Fly.io + PostgreSQL. Their advantage is the global edge network — your code and data run in 300+ data centers worldwide, with automatic routing to the nearest one.\n\nPricing is generous: the free tier includes 5M Durable Object requests and 5GB D1 storage. The paid tier starts at $5/month with usage-based scaling.",
      takeaway: "Cloudflare Workers is now a serious full-stack platform. For global, low-latency apps, it's hard to beat.",
      tags: ["cloudflare", "workers", "durable-objects", "d1", "edge"],
      category: "infra_devops",
    },
    {
      title: "Zerodha's Tech Stack Handles 15M Daily Users on Simple Infra",
      source: "YourStory",
      summary: "Zerodha shares their architecture: Go microservices, PostgreSQL, Redis — processing 200K orders/second.",
      detail: "Nithin Kamath's team at Zerodha published a detailed technical blog post about their infrastructure, and it's a masterclass in pragmatic engineering. India's largest stock broker processes 200K orders per second during peak market hours, handles 15 million daily active users, and does it all with a remarkably simple technology stack.\n\nThe core trading engine is written in Go — not because Go was trendy when they started (it wasn't), but because it offers the right tradeoffs: fast compilation, predictable performance with garbage collection pauses under 1ms, excellent concurrency primitives, and easy deployment as static binaries. The entire backend team is 30 engineers, which is tiny for a platform of this scale.\n\nDatabase strategy is straightforward: PostgreSQL for transactional data (orders, positions, holdings) with careful schema design and query optimization rather than exotic databases. Redis for caching and real-time data distribution. No Kafka, no Elasticsearch, no Cassandra. When they need search, they use PostgreSQL's built-in full-text search. When they need real-time streaming, they use Redis Pub/Sub.\n\nThe infrastructure runs on bare metal servers in Indian data centers (not cloud), which gives them two advantages: lower latency to Indian stock exchanges, and dramatically lower costs. Kamath estimates they spend 1/10th what they would on AWS for equivalent compute.\n\nThe key architectural principle is 'solve the problem, not a generalization of the problem.' They don't build for hypothetical scale — they build for current needs and evolve incrementally. Most of their critical services have been rewritten 2-3 times as requirements changed, but each rewrite was targeted and small.\n\nFor Indian developers especially, this is an inspiring example: you don't need Silicon Valley-scale infrastructure to build world-class products. Simple tools, used well, scale further than complex tools used poorly.",
      takeaway: "Simple, boring technology stacks scale better than trendy ones. PostgreSQL + Go + Redis is enough for 15M users.",
      tags: ["zerodha", "architecture", "go", "postgres", "scale"],
      category: "india_tech",
    },
    {
      title: "India AI Compute Mission: ₹10,000 Cr for GPU Clusters",
      source: "Economic Times",
      summary: "Government announces 10,000 GPU cluster for Indian AI startups with subsidized access starting next quarter.",
      detail: "The Indian government's AI Compute Mission, announced at the IndiaAI summit in Bangalore, commits ₹10,000 crore (~$1.2 billion) to building domestic AI infrastructure. The centerpiece is a 10,000 GPU cluster (NVIDIA H100s) to be hosted across four data centers in Bangalore, Hyderabad, Pune, and Delhi NCR.\n\nThe program has three tiers of access. Tier 1 (free) provides up to 100 GPU-hours per month for startups in their first two years, sufficient for fine-tuning small models and running inference. Tier 2 (subsidized at 30% market rate) offers larger allocations for companies with demonstrated traction. Tier 3 (market rate but guaranteed availability) is for established companies that need reliable, large-scale compute.\n\nThe strategic motivation is reducing dependency on US cloud providers. Currently, Indian AI startups spend 60-70% of their compute budget with AWS, Google Cloud, or Azure, sending dollars abroad for what is increasingly a core strategic capability. The mission aims to bring that ratio to 40% domestic / 60% foreign within three years.\n\nBeyond hardware, the mission includes funding for AI research institutions, a national AI dataset repository (with anonymized government data for training), and a regulatory sandbox for testing AI applications in healthcare, agriculture, and financial services.\n\nThe startup community response has been enthusiastic but cautious. Several founders noted that hardware is only part of the challenge — the quality of the software stack (CUDA libraries, model serving infrastructure, monitoring tools) around the GPUs matters just as much. The government has partnered with NVIDIA and Intel to provide software support, but the proof will be in the execution.\n\nApplications open next quarter via the IndiaAI portal, with the first GPU clusters expected to be operational by Q3 2026.",
      takeaway: "Free GPU hours for early-stage startups. Apply as soon as the portal opens — first-mover advantage matters.",
      tags: ["india", "ai-compute", "government", "gpu"],
      category: "india_tech",
    },
    {
      title: "Razorpay Open-Sources Their Payment Orchestration Engine",
      source: "Razorpay Engineering Blog",
      summary: "Razorpay releases their internal payment orchestration layer as an open-source project, enabling intelligent routing across payment gateways.",
      detail: "Razorpay has open-sourced Juspay HyperSwitch, their internal payment orchestration engine that powers intelligent routing across multiple payment gateways. This is significant because payment orchestration has been a proprietary competitive advantage for large payment companies — making it open-source democratizes access to infrastructure that typically costs $50K-200K/year from commercial providers.\n\nHyperSwitch handles the complex logic of routing payment transactions: which gateway to use based on success rates, costs, and latency; automatic fallback when a gateway is down; smart retries for failed transactions; and unified reporting across all connected gateways. For a typical Indian merchant processing payments through Razorpay, PayU, and Stripe, HyperSwitch can improve overall success rates by 3-5% through intelligent routing.\n\nThe technical architecture is interesting — it's written in Rust for performance (payment processing is latency-sensitive and high-throughput), uses PostgreSQL for persistent state, and Redis for real-time routing decisions. The codebase is well-structured with clear abstractions for adding new payment gateways via connector modules.\n\nFor Indian startups, this is particularly valuable because the payment ecosystem in India is fragmented. UPI, cards, net banking, wallets, and BNPL all have different success rate patterns across different gateways. HyperSwitch can route each transaction type to the gateway with the best success rate, dynamically adjusting based on real-time performance data.\n\nThe open-source release includes a self-hosted option (deploy on your own infrastructure) and a managed cloud version. The self-hosted version is free with no transaction limits.",
      takeaway: "If you process payments in India, HyperSwitch can improve success rates by 3-5% with zero gateway lock-in.",
      tags: ["razorpay", "payments", "open-source", "india"],
      category: "india_tech",
    },
    {
      title: "Y Combinator W26: 65% AI-Native, India's Cohort Doubles",
      source: "TechCrunch",
      summary: "YC's Winter 2026 batch is the most AI-heavy ever. India-based startups represent 18% of the cohort, up from 9%.",
      detail: "Y Combinator's Winter 2026 batch statistics reveal accelerating trends in both AI adoption and geographic diversification.\n\n65% of the batch (approximately 150 companies) are classified as 'AI-native' — meaning AI is the core technology, not an add-on feature. The top verticals are AI agents for healthcare (automated clinical documentation, diagnostic assistance), legal automation (contract analysis, compliance monitoring), developer tools (code generation, testing, deployment), and vertical SaaS with AI (real estate, logistics, accounting).\n\nThe India cohort has doubled from 9% (W25) to 18% (W26), making it the second-largest country representation after the US. Notable Indian companies include an AI-powered SEBI compliance platform, a rural healthcare telemedicine service using multilingual AI, and a developer tools company building AI-native CI/CD.\n\nYC partner Gustaf Alströmer noted in an interview that the bar for 'just an AI wrapper' is now very high. The successful applicants in this batch demonstrate proprietary data advantages, deep domain expertise, or novel interaction paradigms that go beyond 'ChatGPT with a custom prompt.' Several companies were accepted specifically because they had unique training data from their industry that gives their AI model a moat.\n\nThe funding environment for YC graduates remains strong despite broader market cooling. The median pre-seed/seed round for W26 graduates is $3.5M at $20M valuation, with AI-native companies commanding a 30-40% premium.\n\nFor aspiring founders, the signal is clear: the opportunity isn't in building general-purpose AI tools (that market is saturated), but in applying AI deeply to specific industries where domain knowledge creates defensibility.",
      takeaway: "AI-native is the default for new startups. The moat is domain expertise and proprietary data, not the model.",
      tags: ["yc", "startups", "ai-native", "india", "funding"],
      category: "startups",
    },
    {
      title: "Deno 3.0: Full Node.js Compatibility, Package Registry",
      source: "Deno Blog",
      summary: "Deno 3.0 achieves near-complete Node.js API compatibility and launches its own package registry with JSR.",
      detail: "Deno 3.0 represents the culmination of Ryan Dahl's original vision: a modern JavaScript runtime that's secure by default, TypeScript-first, and compatible with the existing npm ecosystem. The key achievement is that npm packages now work without flags, configuration, or workarounds in the vast majority of cases.\n\nNode.js API compatibility covers the core modules that matter: fs, path, crypto, http/https, stream, child_process, and worker_threads. The implementation passes 97% of Node.js's own test suite. This means popular npm packages like Express, Fastify, Prisma, and even Next.js can run on Deno without modification.\n\nJSR (JavaScript Registry), Deno's package registry, has reached critical mass with over 15,000 packages. JSR's key differentiator is native TypeScript support — you publish TypeScript source code directly, and JSR handles compilation for different targets. It also generates API documentation automatically and enforces semver compatibility checks.\n\nThe runtime itself has seen significant performance improvements. Deno 3.0 is 2-3x faster than Node.js for HTTP server benchmarks (thanks to hyper, the Rust HTTP library, under the hood) and uses 30-40% less memory for typical web server workloads. The startup time is now comparable to Node.js.\n\nDeno Deploy, the edge hosting platform, now supports persistent storage (Deno KV), cron jobs, and queue workers — making it a complete platform for deploying Deno applications. Pricing starts at free for hobby projects and $10/month for production.\n\nThe strategic significance is that the JavaScript runtime market now has genuine competition. Deno and Bun both offer compelling alternatives to Node.js, and the competition is driving improvements across all three runtimes. Developers benefit regardless of which runtime they choose.",
      takeaway: "The runtime wars benefit everyone. Deno 3.0 is production-ready — try it for new projects, especially with TypeScript.",
      tags: ["deno", "node", "jsr", "typescript", "runtime"],
      category: "open_source",
    },
    {
      title: "Oxc: The Rust-Based JavaScript Toolchain That Might Replace Everything",
      source: "GitHub / Oxc Blog",
      summary: "Oxc (Oxidation Compiler) ships a unified parser, linter, formatter, and bundler — all in Rust, all 10-100x faster.",
      detail: "Oxc (short for Oxidation Compiler) is an ambitious open-source project that aims to be a single, unified toolchain for JavaScript and TypeScript development. It includes a parser, linter, formatter, transformer, resolver, and minifier — all written in Rust, all sharing the same AST, and all dramatically faster than their JavaScript-based equivalents.\n\nThe performance numbers are staggering. Oxlint (the linter) is 50-100x faster than ESLint. Oxc-format (the formatter) is 30x faster than Prettier. The parser is 3x faster than SWC and 5x faster than Babel. For a large monorepo with 10,000 TypeScript files, running the full lint + format pipeline takes 2-3 seconds with Oxc versus 2-3 minutes with ESLint + Prettier.\n\nWhat makes Oxc architecturally interesting is the shared AST. Traditional JavaScript toolchains (ESLint, Prettier, Babel, Webpack) each parse your source code independently, building their own AST. This means your code is parsed 4-5 times during a typical build. Oxc parses once and shares the AST across all tools, eliminating redundant work.\n\nThe project is backed by Void Zero (previously Voidform), the company behind Vite, and has Evan You's endorsement. The plan is to integrate Oxc as the default toolchain for Vite 6, replacing the current mix of esbuild, SWC, and Rollup with a single unified engine.\n\nAdoption is still early but accelerating. Shopify and several large open-source projects have switched to Oxlint. The formatter is approaching Prettier compatibility (currently handles 90% of Prettier's formatting rules identically). The bundler is the least mature component and isn't recommended for production yet.\n\nFor developers, Oxc represents the endgame of the 'rewrite-JavaScript-tools-in-Rust' trend. Instead of piecemeal replacements (SWC for Babel, Biome for ESLint), Oxc offers a single, coherent toolchain that handles everything.",
      takeaway: "Watch Oxc closely. When it ships as Vite 6's default, it'll become the mainstream JavaScript toolchain.",
      tags: ["oxc", "rust", "toolchain", "linter", "bundler"],
      category: "open_source",
    },
    {
      title: "Swift 6.1 and Kotlin 2.2 Converge on Concurrency",
      source: "Swift Blog / JetBrains Blog",
      summary: "Both Swift and Kotlin ship major concurrency updates, converging on similar structured concurrency patterns.",
      detail: "In an interesting case of parallel evolution, both Swift 6.1 and Kotlin 2.2 shipped major concurrency updates this month that arrive at remarkably similar designs — suggesting that the industry is converging on a consensus for how concurrency should work in application-level languages.\n\nSwift 6.1 makes strict concurrency checking the default (previously opt-in), which means the compiler now enforces data-race safety at compile time. All shared mutable state must be protected by actors, sendable protocols, or explicit synchronization. This is the culmination of Swift's multi-year concurrency roadmap and means that data races in Swift are now caught at compile time, similar to Rust's ownership model but with a more ergonomic API.\n\nKotlin 2.2 graduates structured concurrency from experimental status. The coroutine framework now includes built-in support for cancellation scopes, error propagation, and resource cleanup that prevents common concurrency bugs like leaked coroutines and dangling tasks. The new 'context receivers' feature makes it ergonomic to pass coroutine contexts through call hierarchies without manual plumbing.\n\nThe convergence is notable. Both languages now offer: structured concurrency (task hierarchies with automatic cancellation), actor-based isolation for shared state, async/await syntax for sequential async code, and compile-time or analysis-time detection of concurrency hazards.\n\nFor mobile developers working cross-platform (KMM/KMP for Android, SwiftUI for iOS), this convergence is practical good news. The mental model for concurrency is now similar across both platforms, making it easier to write correct concurrent code regardless of target platform.\n\nThe broader industry trend is clear: the Go-style goroutine model, the Rust ownership model, and the Swift/Kotlin structured concurrency model are the three winning patterns. Raw threads and manual synchronization are effectively deprecated for application development.",
      takeaway: "Learn structured concurrency patterns — they're becoming the standard across Swift, Kotlin, and eventually more languages.",
      tags: ["swift", "kotlin", "concurrency", "mobile"],
      category: "mobile",
    },
    {
      title: "React Native 0.80: New Architecture Default, Bridgeless Mode",
      source: "React Native Blog",
      summary: "React Native 0.80 makes the New Architecture (Fabric + TurboModules) the default, removing the legacy bridge.",
      detail: "React Native 0.80 is the most significant release since the framework's creation. The New Architecture — which has been opt-in since 0.68 — is now the default, and the legacy bridge is deprecated.\n\nThe New Architecture consists of two components: Fabric (the new rendering system) and TurboModules (the new native module system). Together, they replace the asynchronous bridge that was React Native's original architecture and its primary performance bottleneck.\n\nFabric renders UI synchronously on the main thread (like native apps), eliminating the 'one frame delay' that made React Native UIs feel slightly less responsive than fully native. TurboModules load native code lazily (only when first called, not at app startup), reducing app launch time by 30-50% for apps with many native dependencies.\n\nThe practical impact for developers is felt in three areas. First, animations and gestures are now butter-smooth because they don't need to cross the bridge. Second, app startup is faster. Third, memory usage is reduced because the bridge maintained a serialization/deserialization buffer that's no longer needed.\n\nThe migration cost is the main concern. Apps using the old bridge API need to update their native modules. React Native's team provides codemods for common patterns, and the most popular community libraries (react-native-reanimated, react-native-gesture-handler, react-native-screens) already support the New Architecture. However, smaller or unmaintained libraries may require manual updates.\n\nExpo SDK 52, released simultaneously, makes the New Architecture the default for Expo projects and handles most of the migration complexity automatically. For teams using Expo, the upgrade is largely painless.\n\nThis release positions React Native competitively against Flutter for performance-sensitive applications, addressing the primary technical criticism the framework has faced for years.",
      takeaway: "If you're building mobile with React Native, upgrade to 0.80. The performance improvements are substantial and real.",
      tags: ["react-native", "mobile", "fabric", "performance"],
      category: "mobile",
    },
    {
      title: "Critical Supply Chain Attack on Popular npm Packages",
      source: "Socket.dev / Snyk",
      summary: "Coordinated attack compromises 15 popular npm packages via expired maintainer email domains, affecting 2M+ weekly downloads.",
      detail: "Security researchers at Socket.dev discovered a coordinated supply chain attack that compromised 15 npm packages with a combined 2 million weekly downloads. The attack vector was novel and concerning: the attackers purchased expired domains that were previously used as email addresses by package maintainers.\n\nHere's how it worked: npm allows password reset via the maintainer's registered email address. Several maintainers had registered using custom domains (like @their-startup.com) that they'd let expire after the company shut down. The attackers purchased these domains, set up email servers, triggered npm password resets, and gained access to the maintainer accounts.\n\nOnce they had account access, they published new versions of the packages with malicious code injected into the postinstall script. The malicious payload was subtle — it collected environment variables (which often contain API keys, database credentials, and cloud access tokens) and exfiltrated them to a remote server via DNS queries, making it harder to detect with traditional network monitoring.\n\nThe packages were compromised for 3-7 days before detection. Socket.dev's automated analysis caught the anomaly when the postinstall scripts suddenly began making network requests. npm responded within hours of the report, reverting the packages and requiring email re-verification for all affected accounts.\n\nThe incident highlights several systemic issues with the npm ecosystem: maintainer email addresses aren't regularly verified, there's no mandatory 2FA for high-download packages, and the lack of package signing means there's no way to verify that a package version was actually published by the legitimate maintainer.\n\nnpm has announced plans to require 2FA for all packages with over 10K weekly downloads and to implement package signing via Sigstore by end of 2026.\n\nFor developers, the immediate action items are: audit your dependency tree with `npm audit`, enable 2FA on your npm account, and consider using lockfile-only installs (`npm ci` instead of `npm install`) to prevent unexpected version updates.",
      takeaway: "Enable 2FA on npm, use lockfiles, audit dependencies regularly. Supply chain attacks are increasing.",
      tags: ["security", "npm", "supply-chain", "vulnerability"],
      category: "security",
    },
    {
      title: "Passkeys Reach 50% Adoption Among Major Platforms",
      source: "FIDO Alliance",
      summary: "Passkeys hit mainstream adoption with 50%+ of major web platforms supporting passwordless authentication.",
      detail: "The FIDO Alliance reports that passkeys — the passwordless authentication standard backed by Apple, Google, and Microsoft — have crossed a critical adoption threshold. Over 50% of the top 100 websites and apps now support passkey authentication, up from 12% a year ago.\n\nThe technical implementation has matured significantly. WebAuthn Level 3 (the underlying standard) now supports cross-device authentication (scan a QR code on your phone to log into a desktop browser), conditional UI (passkey suggestions appear in autofill alongside password suggestions), and enterprise attestation (organizations can require device-specific passkeys for compliance).\n\nFor developers, the integration story has simplified. Libraries like SimpleWebAuthn (JavaScript), py_webauthn (Python), and webauthn-rs (Rust) handle the complex cryptographic operations. The typical integration requires 50-100 lines of backend code and a few lines of frontend JavaScript. Supabase, Auth0, Clerk, and NextAuth all offer passkey support as a configuration option.\n\nThe user experience has also improved. Initial passkey implementations were confusing — users didn't understand the concept and couldn't recover from lost devices. Current implementations handle this gracefully: passkeys sync across devices via iCloud Keychain (Apple), Google Password Manager, or 1Password/Bitwarden. If you lose your phone, your passkeys are still available on your laptop.\n\nThe remaining challenges are organizational. Many companies hesitate to adopt passkeys because their support teams aren't trained to help users with the new flow, and there's concern about alienating less technical users. The data, however, suggests the opposite: sign-in success rates improve by 20-30% when passkeys are offered as the primary option, because there are no passwords to forget.\n\nSecurity benefits are clear: passkeys are phishing-resistant by design (they're bound to a specific domain, so a phishing site can't capture them), eliminate credential stuffing attacks, and remove the need for SMS-based 2FA (which is vulnerable to SIM swapping).",
      takeaway: "Add passkey support to your apps. The libraries are mature, UX is good, and it eliminates entire categories of attacks.",
      tags: ["passkeys", "authentication", "fido", "webauthn"],
      category: "security",
    },
  ],
  quick_links: [
    { label: "Hacker News", url: "https://news.ycombinator.com" },
    { label: "Lobsters", url: "https://lobste.rs" },
    { label: "Dev.to", url: "https://dev.to" },
    { label: "Product Hunt", url: "https://producthunt.com" },
    { label: "IndiaAI", url: "https://indiaai.gov.in" },
    { label: "TLDRsec", url: "https://tldrsec.com" },
    { label: "TLDR Newsletter", url: "https://tldr.tech" },
    { label: "Bytes.dev", url: "https://bytes.dev" },
  ],
}

const eveningBriefContent: EveningBriefContent = {
  completed: [
    "Morning stretch routine (20 min)",
    "Reviewed project requirements",
    "Tracked all meals for the day",
    "Read 15 pages of Atomic Habits",
    "Meditated for 10 minutes",
  ],
  in_progress: [
    "Dashboard development — analytics section pending",
    "Weekly meal prep planning",
  ],
  tomorrow: [
    "Deploy dashboard to Vercel",
    "Set up OpenClaw integrations",
    "Gym session (upper body)",
    "Finish Atomic Habits chapter 5",
  ],
  reflection:
    "Productive day with good focus. Morning routine was solid. Need to improve water intake — only 5 glasses today. The tech brief reading was really useful for staying current.",
}

export const SAMPLE_BRIEFS: Brief[] = [
  {
    id: "b1",
    type: "morning_briefing",
    title: "Your Morning Brief",
    content: `Good morning, Ananya!

Weather: 28°C, partly cloudy in Bangalore

Today's Focus:
- Complete dashboard MVP
- Review nutrition plan for the week
- 30 min morning stretch

Reminders:
- Team standup at 10 AM
- Grocery run for weekly meal prep
- Evening reading session

Quote of the day: "The secret of getting ahead is getting started." - Mark Twain`,
    date: today,
    created_at: new Date().toISOString(),
  },
  {
    id: "b2",
    type: "tech_news",
    title: "Tech News Digest",
    content: JSON.stringify(techBriefContent),
    date: today,
    created_at: new Date().toISOString(),
  },
  {
    id: "b3",
    type: "evening_review",
    title: "Evening Review",
    content: JSON.stringify(eveningBriefContent),
    date: today,
    created_at: new Date().toISOString(),
  },
]

export const SAMPLE_HABITS: Habit[] = [
  { id: "h1", name: "Morning Stretch", icon: "🌅", color: "#3b82f6", created_at: "" },
  { id: "h2", name: "Read 20 Pages", icon: "📚", color: "#8b5cf6", created_at: "" },
  { id: "h3", name: "8 Glasses Water", icon: "💧", color: "#06b6d4", created_at: "" },
  { id: "h4", name: "No Social Media before 12", icon: "📵", color: "#f59e0b", created_at: "" },
  { id: "h5", name: "Journal Entry", icon: "✍️", color: "#10b981", created_at: "" },
  { id: "h6", name: "Meditate 10 min", icon: "🧘", color: "#ec4899", created_at: "" },
]

export const SAMPLE_HABIT_LOGS: HabitLog[] = [
  { id: "hl1", habit_id: "h1", date: today, completed: true, created_at: "" },
  { id: "hl2", habit_id: "h4", date: today, completed: true, created_at: "" },
  { id: "hl3", habit_id: "h2", date: today, completed: true, created_at: "" },
  { id: "hl4", habit_id: "h6", date: today, completed: true, created_at: "" },
  { id: "hl5", habit_id: "h1", date: daysAgo(1), completed: true, created_at: "" },
  { id: "hl6", habit_id: "h2", date: daysAgo(1), completed: true, created_at: "" },
  { id: "hl7", habit_id: "h3", date: daysAgo(1), completed: true, created_at: "" },
  { id: "hl8", habit_id: "h4", date: daysAgo(1), completed: true, created_at: "" },
  { id: "hl9", habit_id: "h5", date: daysAgo(1), completed: true, created_at: "" },
  { id: "hl10", habit_id: "h1", date: daysAgo(2), completed: true, created_at: "" },
  { id: "hl11", habit_id: "h3", date: daysAgo(2), completed: true, created_at: "" },
  { id: "hl12", habit_id: "h4", date: daysAgo(2), completed: false, created_at: "" },
  { id: "hl13", habit_id: "h1", date: daysAgo(3), completed: true, created_at: "" },
  { id: "hl14", habit_id: "h2", date: daysAgo(3), completed: true, created_at: "" },
  { id: "hl15", habit_id: "h6", date: daysAgo(3), completed: true, created_at: "" },
  { id: "hl16", habit_id: "h1", date: daysAgo(4), completed: true, created_at: "" },
  { id: "hl17", habit_id: "h3", date: daysAgo(4), completed: true, created_at: "" },
  { id: "hl18", habit_id: "h5", date: daysAgo(4), completed: true, created_at: "" },
  { id: "hl19", habit_id: "h2", date: daysAgo(5), completed: true, created_at: "" },
  { id: "hl20", habit_id: "h1", date: daysAgo(6), completed: true, created_at: "" },
  { id: "hl21", habit_id: "h6", date: daysAgo(6), completed: true, created_at: "" },
]

export const SAMPLE_EXERCISE_LOGS: ExerciseLogType[] = [
  { id: "e1", date: today, type: "morning_stretch", duration_minutes: 20, notes: "Full body stretch", created_at: "" },
  { id: "e1b", date: today, type: "walk", duration_minutes: 30, notes: "Morning walk around the block", created_at: "" },
  { id: "e1c", date: today, type: "gym", duration_minutes: 45, notes: "Chest and shoulders", created_at: "" },
  { id: "e1d", date: today, type: "walk", duration_minutes: 25, notes: "Evening walk", created_at: "" },
  { id: "e2", date: daysAgo(1), type: "gym", duration_minutes: 45, notes: "Upper body", created_at: "" },
  { id: "e3", date: daysAgo(1), type: "walk", duration_minutes: 30, notes: "Evening walk", created_at: "" },
  { id: "e4", date: daysAgo(2), type: "morning_stretch", duration_minutes: 15, notes: "Quick stretch", created_at: "" },
  { id: "e5", date: daysAgo(2), type: "yoga", duration_minutes: 30, notes: "Surya namaskar", created_at: "" },
  { id: "e6", date: daysAgo(3), type: "gym", duration_minutes: 50, notes: "Leg day", created_at: "" },
  { id: "e7", date: daysAgo(3), type: "walk", duration_minutes: 25, notes: "Afternoon walk", created_at: "" },
  { id: "e8", date: daysAgo(4), type: "morning_stretch", duration_minutes: 20, notes: "Full stretch", created_at: "" },
  { id: "e9", date: daysAgo(4), type: "yoga", duration_minutes: 40, notes: "Power yoga", created_at: "" },
  { id: "e10", date: daysAgo(5), type: "walk", duration_minutes: 40, notes: "Long walk", created_at: "" },
  { id: "e11", date: daysAgo(6), type: "morning_stretch", duration_minutes: 20, notes: "Stretch routine", created_at: "" },
  { id: "e12", date: daysAgo(6), type: "gym", duration_minutes: 55, notes: "Full body", created_at: "" },
  { id: "e13", date: daysAgo(7), type: "walk", duration_minutes: 35, notes: "Morning walk", created_at: "" },
  { id: "e14", date: daysAgo(8), type: "morning_stretch", duration_minutes: 15, notes: "Quick stretch", created_at: "" },
  { id: "e15", date: daysAgo(8), type: "gym", duration_minutes: 45, notes: "Back and biceps", created_at: "" },
  { id: "e16", date: daysAgo(9), type: "yoga", duration_minutes: 30, notes: "Hatha yoga", created_at: "" },
  { id: "e17", date: daysAgo(10), type: "walk", duration_minutes: 30, notes: "Evening walk", created_at: "" },
  { id: "e18", date: daysAgo(11), type: "gym", duration_minutes: 50, notes: "Chest and shoulders", created_at: "" },
  { id: "e19", date: daysAgo(12), type: "morning_stretch", duration_minutes: 20, notes: "", created_at: "" },
  { id: "e20", date: daysAgo(13), type: "walk", duration_minutes: 45, notes: "Long evening walk", created_at: "" },
]

export const SAMPLE_READING_LOGS: ReadingLogType[] = [
  { id: "r1", book_title: "Atomic Habits", pages_read: 15, date: today, notes: "Habit stacking", created_at: "" },
  { id: "r2", book_title: "Atomic Habits", pages_read: 20, date: daysAgo(1), notes: "4 laws of behavior change", created_at: "" },
  { id: "r3", book_title: "Atomic Habits", pages_read: 12, date: daysAgo(2), notes: "Environment design", created_at: "" },
  { id: "r4", book_title: "Deep Work", pages_read: 25, date: daysAgo(3), notes: "Finished Part 1", created_at: "" },
  { id: "r5", book_title: "Deep Work", pages_read: 18, date: daysAgo(4), notes: "Scheduling strategies", created_at: "" },
  { id: "r6", book_title: "Deep Work", pages_read: 22, date: daysAgo(5), notes: "Shallow work audit", created_at: "" },
  { id: "r7", book_title: "Deep Work", pages_read: 15, date: daysAgo(6), notes: "Ritual design", created_at: "" },
  { id: "r8", book_title: "Deep Work", pages_read: 20, date: daysAgo(8), notes: "Productive meditation", created_at: "" },
  { id: "r9", book_title: "Deep Work", pages_read: 10, date: daysAgo(9), notes: "Fixed schedule productivity", created_at: "" },
  { id: "r10", book_title: "Sapiens", pages_read: 30, date: daysAgo(10), notes: "Cognitive revolution", created_at: "" },
  { id: "r11", book_title: "Sapiens", pages_read: 25, date: daysAgo(12), notes: "Agricultural revolution", created_at: "" },
  { id: "r12", book_title: "Sapiens", pages_read: 18, date: daysAgo(13), notes: "Unification of humankind", created_at: "" },
]

export const SAMPLE_MEAL_LOGS: MealLog[] = [
  { id: "ml1", date: today, meal_type: "early_morning", description: "Warm water + almonds + walnuts", created_at: "" },
  { id: "ml2", date: today, meal_type: "breakfast", description: "Egg bhurji + toast + banana + chai", created_at: "" },
  { id: "ml3", date: daysAgo(1), meal_type: "early_morning", description: "Warm water + almonds", created_at: "" },
  { id: "ml4", date: daysAgo(1), meal_type: "breakfast", description: "Masala omelette + paratha", created_at: "" },
  { id: "ml5", date: daysAgo(1), meal_type: "lunch", description: "Rice + dal + chicken curry", created_at: "" },
  { id: "ml6", date: daysAgo(1), meal_type: "dinner", description: "Roti + paneer + dal", created_at: "" },
  { id: "ml7", date: daysAgo(2), meal_type: "breakfast", description: "Poha + boiled eggs", created_at: "" },
  { id: "ml8", date: daysAgo(2), meal_type: "lunch", description: "Rice + sambhar + fish fry", created_at: "" },
  { id: "ml9", date: daysAgo(3), meal_type: "breakfast", description: "Dosa + chutney + eggs", created_at: "" },
  { id: "ml10", date: daysAgo(3), meal_type: "lunch", description: "Roti + rajma + salad", created_at: "" },
  { id: "ml11", date: daysAgo(3), meal_type: "dinner", description: "Rice + dal + sabzi", created_at: "" },
  { id: "ml12", date: daysAgo(4), meal_type: "breakfast", description: "Upma + egg bhurji", created_at: "" },
  { id: "ml13", date: daysAgo(5), meal_type: "breakfast", description: "Besan chilla + eggs", created_at: "" },
  { id: "ml14", date: daysAgo(5), meal_type: "lunch", description: "Rice + dal fry + chicken", created_at: "" },
  { id: "ml15", date: daysAgo(6), meal_type: "breakfast", description: "Paratha + omelette + lassi", created_at: "" },
  { id: "ml16", date: daysAgo(6), meal_type: "dinner", description: "Roti + baingan bharta + dal", created_at: "" },
]

export const SAMPLE_NOTES: Note[] = [
  { id: "n1", content: "Remember to set up OpenClaw webhook after deploying to Vercel", created_at: new Date().toISOString() },
  { id: "n2", content: "Meal prep idea: make a big batch of dal on Sunday for the week", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "n3", content: "Look into adding Spotify integration for focus music tracking", created_at: new Date(Date.now() - 7200000).toISOString() },
]
