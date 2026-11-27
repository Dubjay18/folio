// Single source of truth for the site's copy and links.

export const SITE = {
  name: "Jay",
  fullName: "Yanfunmi Jeje",
  title: "Jay | Software & Applied AI Engineer",
  description:
    "Jay is an independent software and applied AI engineer building web apps, mobile apps and AI agents, end to end. Open to contracts and full-time roles.",
  url: "https://jayfolio.dev",
  location: "Lagos, NG",
  email: "jejeniyi7@gmail.com",
  resume: "/resume.pdf",
  cal: "https://cal.com/dubjay/quick-chat",
  medium: "https://medium.com/@jejeniyi7",
  mediumFeed: "https://medium.com/feed/@jejeniyi7",
} as const;

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Dubjay18" },
  { label: "X", href: "https://x.com/d_honouredOne" },
  { label: "LinkedIn", href: "https://linkedin.com/in/dubjay" },
  { label: "Medium", href: SITE.medium },
] as const;

export type NavLink = { href: string; label: string; menuLabel?: string };

export const HOME_NAV: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#hiring", label: "For hiring teams", menuLabel: "Hiring" },
  { href: "#writing", label: "Writing" },
];

export const HOME_MENU: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#hiring", label: "Hiring" },
  { href: "#contact", label: "Contact" },
];

export const CASE_NAV: NavLink[] = [
  { href: "/#work", label: "← All work" },
  { href: "/#services", label: "Services" },
  { href: "/#hiring", label: "For hiring teams" },
];

export const CASE_MENU: NavLink[] = [
  { href: "/#work", label: "All work" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#hiring", label: "Hiring" },
  { href: "/#contact", label: "Contact" },
];

export const STATS = [
  { value: 4, suffix: " yrs", label: "Shipping production software" },
  { value: 7, label: "Product teams shipped with" },
  { value: 3, label: "Surfaces: web · mobile · agents" },
  { text: "1 day", label: "Reply time, guaranteed" },
] as const;

export const CLIENTS = ["Grupp", "Sovalabs", "Throughline", "Gearsparks", "Cleverfolks", "Shippack"];

export const INDEX_ROWS = [
  ["Warden", "LLM gateway + observability", "Self-hosted · single binary · Next.js", "2026 · in build"],
  ["PrivateTM", "Private payments + prediction market", "Go · Chainlink CRE · Solidity · CCIP", "2026"],
  ["Specter", "Shadow traffic mirror + divergence analysis", "Go · consistent hashing · gossip", "2026"],
  ["Sanctum", "Encrypted TUI chat", "Go · NaCl · Bubble Tea", "2026"],
] as const;

// A real Son of Anton run: `@soa security` on Dubjay18/soa-sandbox#1 (see lib/job.ts for the steps).
export const TRACE_ROWS = [
  ["receive", "issue_comment webhook, signature verified", "202"],
  ["acknowledge", "👀 reaction on the tag", "ok"],
  ["fetch_diff", "discount.py · 1 file · +10 lines", "ok"],
  ["budget", "lockfiles + build dirs skipped, lines numbered", "fits"],
  ["gemini", "gemini-2.5-flash · security schema", "3 findings"],
  ["post", "one native review, inline on changed lines", "risky"],
] as const;

export const SERVICES = [
  {
    title: "Web app, end to end",
    body: "Product-grade web apps: interface, API, database, auth, payments, deployment.",
    items: ["Next.js / TypeScript frontends", "APIs, Postgres, queues", "Deploy + monitoring"],
  },
  {
    title: "Mobile app",
    body: "Cross-platform apps with native modules where the platform demands it.",
    items: ["React Native + TypeScript", "Native modules (Kotlin)", "Store-ready builds"],
  },
  {
    title: "AI agents & LLM features",
    body: "Agents and AI features that survive real users: tools, retrieval, evals and observability.",
    items: ["Agents, RAG, MCP tools", "Evals + cost/latency budgets", "LLM gateway + tracing"],
  },
  {
    title: "Embedded engineer",
    body: "Join your team for a sprint or a quarter, async-first, in your tools.",
    items: ["Your repo, your standups", "Weekly written + video update", "Pause any month"],
  },
];

export const STEPS = [
  { title: "Scope call", body: "20 minutes on the problem, the users and the constraints. No pitch deck needed.", when: "Day 0" },
  { title: "Plan + fixed quote", body: "A written plan with milestones and risks before any code is written.", when: "Within 3 days" },
  { title: "Weekly drops", body: "Monday plan, Friday demo video. You watch it work every week, not at the end.", when: "Every week" },
  { title: "Launch + 30 days", body: "Production deploy, handover docs, and 30 days of fixes included.", when: "After launch" },
];

export const SKILLS = [
  "TypeScript", "Go", "Next.js", "React Native", "NestJS", "PostgreSQL", "Prisma", "GraphQL",
  "LLM agents", "RAG", "MCP", "Evals", "Docker", "Kubernetes",
];

export const TIMELINE = [
  { co: "Grupp", date: "Jul 2026 to Present", role: "Software Engineer: banking + BaaS platforms, consumer apps", tag: "Fintech" },
  { co: "Sovalabs", date: "Mar 2026 to Present", role: "Backend Engineer: loan repayment module, double-entry ledger", tag: "Fintech" },
  { co: "Gearsparks Consulting", date: "Dec 2025 to Feb 2026", role: "Forward-Deployed Engineer: React/TypeScript, REST + GraphQL", tag: "Consulting" },
  { co: "Mission Sync (now Throughline)", date: "Apr 2025 to Jan 2026", role: "Fullstack Engineer: V2 backend, observability, 40% faster incident resolution", tag: "SaaS" },
  { co: "Cleverfolks", date: "Apr to Jul 2025", role: "Frontend Engineer: real-time agent comms, multi-agent dashboards", tag: "AI" },
  { co: "Shippack", date: "Sep 2023 to Mar 2024", role: "Software Developer: real-time shipment tracking, pricing engine", tag: "Logistics" },
  { co: "Codegarage Africa", date: "Mar to Sep 2023", role: "Frontend Developer: Next.js + TypeScript product build", tag: "Product" },
];

export const NEEDS = ["Web app", "Mobile app", "AI agent / LLM feature", "Ongoing engineer"];
export const TIMELINES = ["ASAP", "1 to 3 months", "Exploring"];
