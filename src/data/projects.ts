// Selected work. Every claim here comes from the project's own repository: its README, code,
// tests, or real output (a recorded run, a real PR thread, a real CLI session).

export type CardMedia =
  | { kind: "browser"; url: string }
  | { kind: "phone" }
  | { kind: "term"; lines: [string, string][]; foot: string };

export type Stat = { value: string; label: string };
export type TraceRow = { step: string; detail: string; result?: string };

export type Project = {
  slug: string;
  n: string;
  name: string;
  logo: string;
  tags: string[];
  status: string;
  year: string;
  blurb: string;
  stack: string;
  card: CardMedia;
  /** null when there is no case study yet */
  caseStudy: CaseStudy | null;
};

export type CaseStudy = {
  lede: string;
  role: string;
  timeline: string;
  stackLong: string;
  links: { label: string; href: string }[];
  walkthrough: { label: string; chapters: { t: number; label: string }[] };
  story: { eyebrow: string; title: string; body: string }[];
  highlight: {
    eyebrow: string;
    title: string;
    serif: string;
    body: string;
    stats: Stat[];
    traceCaption: string;
    trace: TraceRow[];
  };
  gallery?: { src: string; alt: string; caption: string; tall?: boolean }[];
};

const loop = (slug: string) => `/videos/${slug}-loop.mp4`;
export const videoFor = (slug: string) => ({
  loop: loop(slug),
  walkthrough: `/videos/${slug}-walkthrough.mp4`,
  poster: `/videos/${slug}-poster.jpg`,
});

export const PROJECTS: Project[] = [
  {
    slug: "reelstack",
    n: "001",
    name: "Reelstack",
    logo: "/work/reelstack/logo.svg",
    tags: ["Web", "Mobile", "Agent"],
    status: "Live",
    year: "2026",
    blurb: "A social film & TV watchlist. Search any title, see where it streams, save it to a list and share it, or let Claude build the list for you.",
    stack: "Go + Fiber · Next.js 14 · Expo · Postgres · Redis · MCP",
    card: { kind: "browser", url: "reelstack-web.vercel.app" },
    caseStudy: {
      lede: "Your film taste, publicly yours. Reelstack is Spotify for your movie taste: search any title, see which services stream it, save it to a list and share the list.",
      role: "Solo: product, design, API, web, mobile, agent",
      timeline: "Apr – Aug 2026",
      stackLong: "Go + Fiber API · Next.js 14 · Expo / React Native · PostgreSQL (Neon) · Redis (Upstash) · MCP server",
      links: [
        { label: "Live site", href: "https://reelstack-web.vercel.app" },
        { label: "Code", href: "https://github.com/Dubjay18/reelstack" },
      ],
      walkthrough: {
        label: "Reelstack walkthrough, 33 seconds",
        chapters: [
          { t: 3, label: "Landing" },
          { t: 7.5, label: "Sign in" },
          { t: 12.5, label: "Search" },
          { t: 16.5, label: "Lists" },
          { t: 20.5, label: "MCP server" },
          { t: 25.5, label: "Riley" },
        ],
      },
      story: [
        {
          eyebrow: "Problem",
          title: "Film taste has no public home",
          body: "Lists live in notes apps and group chats, and nothing tells you which service actually carries a title in your country. Reelstack's first architecture decision was the streaming-data source.",
        },
        {
          eyebrow: "Approach",
          title: "One Go API, three clients",
          body: "A Go + Fiber API on Postgres and Redis serves a Next.js web app, an Expo mobile app, and an MCP server. Curator reputation (0 to 1000) is a materialized view refreshed every six hours.",
        },
        {
          eyebrow: "Outcome",
          title: "Lists you can build by asking",
          body: "Shipped on Vercel and Railway with an Android build. Connect Claude or ChatGPT over OAuth and it can list, create and fill your watchlists through three MCP tools.",
        },
      ],
      highlight: {
        eyebrow: "Inside the agent layer",
        title: "Riley reads the news,",
        serif: "on a budget.",
        body: "Riley digests movie news from five RSS feeds, builds Top Movies and Series rails from TMDB trending, and writes a Top 10 with one-line takes. Chat is budgeted to Groq's free tier, and the MCP server lets outside agents write to your lists.",
        stats: [
          { value: "73", label: "API routes" },
          { value: "3", label: "MCP tools" },
          { value: "0–1000", label: "Curator score" },
          { value: "10/day", label: "Riley chats per user" },
        ],
        traceCaption: "Reelstack MCP server · apps/api/internal/mcp",
        trace: [
          { step: "list_my_lists", detail: "the user's existing lists, so the agent doesn't create duplicates" },
          { step: "create_list", detail: "a new watchlist, optionally seeded with titles" },
          { step: "add_items_to_list", detail: "add titles to a list the user already owns" },
        ],
      },
      gallery: [
        { src: "/work/reelstack/dashboard.jpg", alt: "Reelstack dashboard with trending titles", caption: "The dashboard: films logged, lists curated, curator score, trending from TMDB." },
        { src: "/work/reelstack/list-detail.jpg", alt: "A Reelstack watchlist", caption: "A list: share it, make it private, add films." },
      ],
    },
  },
  {
    slug: "son-of-anton",
    n: "002",
    name: "Son of Anton",
    logo: "/work/son-of-anton/logo.svg",
    tags: ["Agent"],
    status: "Shipped",
    year: "2026",
    blurb: "A pull-request review agent. Tag @soa on a PR and a review lands inline: ranked findings, CWE-tagged security issues and one-line fixes.",
    stack: "TypeScript · GitHub App · Vercel · Gemini 2.5 Flash",
    card: {
      kind: "term",
      lines: [
        ["@soa security", "on soa-sandbox #1"],
        ["fetch_diff", "discount.py · 1 file"],
        ["gemini", "3 findings · schema-valid"],
        ["post", "review: risky · CWE-95"],
      ],
      foot: "son-of-anton",
    },
    caseStudy: {
      lede: "Tag @soa on a pull request and a review lands in the PR: ranked findings, inline comments on the changed lines, and suggestion blocks GitHub can apply in one click.",
      role: "Solo: design, build, deploy",
      timeline: "Nov 2026",
      stackLong: "TypeScript · GitHub App (Octokit) · Vercel function · Gemini 2.5 Flash with JSON response schemas",
      links: [],
      walkthrough: {
        label: "Son of Anton walkthrough, 29 seconds",
        chapters: [
          { t: 3, label: "A real review" },
          { t: 16, label: "Three modes" },
          { t: 21, label: "After the tag" },
        ],
      },
      story: [
        {
          eyebrow: "Problem",
          title: "Review is the bottleneck",
          body: "On a small team every PR waits for a second reader, and most review bots comment on lockfiles, approve by accident, or bury the one real issue under nits.",
        },
        {
          eyebrow: "Approach",
          title: "A webhook that answers at once",
          body: "A GitHub App on Vercel verifies the signature, returns 202, reacts 👀 to the tag, then budgets the diff and asks Gemini for JSON that has to match a strict schema.",
        },
        {
          eyebrow: "Outcome",
          title: "One review, never an approval",
          body: "Each tag produces one native review with inline comments and one-line suggestions. It never approves or requests changes, and it can hand the review to Claude Code or OpenBot.",
        },
      ],
      highlight: {
        eyebrow: "Security mode, a real run",
        title: "Every finding",
        serif: "has a CWE.",
        body: "This is the review SOA posted on soa-sandbox #1 after `@soa security`. Security mode drops style and nits, and every finding must carry a CWE id or OWASP category.",
        stats: [
          { value: "3", label: "Modes: review · security · explain" },
          { value: "43/43", label: "Tests passing" },
          { value: "8,192", label: "Token retry budget" },
          { value: "0", label: "Approvals, by design" },
        ],
        traceCaption: "SOA security review: risky · 3 findings inline",
        trace: [
          { step: "line 10", detail: "CWE-95 eval Injection: eval() on file content", result: "blocker" },
          { step: "line 3", detail: "CWE-798 Hard-coded Credentials: API key in source", result: "major" },
          { step: "line 7", detail: "CWE-20 Improper Input Validation: pct unchecked", result: "minor" },
        ],
      },
    },
  },
  {
    slug: "deep-work",
    n: "003",
    name: "Deep Work",
    logo: "/work/deep-work/logo.svg",
    tags: ["Mobile"],
    status: "In build",
    year: "2026",
    blurb: "An Android focus app: scheduled deep-work sessions, tiered app blocking, and a challenge you must solve to unlock a blocked app.",
    stack: "React Native · TypeScript · Kotlin native module",
    card: { kind: "phone" },
    caseStudy: null,
  },
  {
    slug: "litt",
    n: "004",
    name: "Litt",
    logo: "/work/litt/logo.svg",
    tags: ["Agent"],
    status: "Built",
    year: "2026",
    blurb: "Independent validation for the CBN's AML/CFT baseline standards: two independent agents audit one ledger, and the run is scored on accuracy, drift, consistency and citations.",
    stack: "Go · Eino agents · Next.js · Astro",
    card: {
      kind: "term",
      lines: [
        ["list_entries", "113 ledger rows accepted"],
        ["find_duplicates", "J-0047, J-0048"],
        ["regs_ctr", "₦8.4m single cash movement"],
        ["decide", "5 findings · 100% precision"],
      ],
      foot: "litt · period 1",
    },
    caseStudy: {
      lede: "A reference implementation of §5.5(b)(i) of the CBN's Baseline Standards for Automated AML Solutions: run one bank ledger through two independent agents, then score the detection logic on the four legs that requirement implies.",
      role: "Solo: spec, backend, agents, app, landing",
      timeline: "Aug – Sep 2026",
      stackLong: "Go · Eino (react.NewAgent + compose.Graph) · Next.js app · Astro landing (GSAP + Lenis) · Playwright E2E",
      links: [{ label: "Code", href: "https://github.com/Dubjay18/Litt" }],
      walkthrough: {
        label: "Litt walkthrough: a real recorded session, 36 seconds",
        chapters: [
          { t: 3, label: "Run the audit" },
          { t: 7, label: "Scorecard" },
          { t: 12, label: "Trace" },
          { t: 16, label: "Findings" },
          { t: 22, label: "Drift" },
          { t: 28.5, label: "Four legs" },
        ],
      },
      story: [
        {
          eyebrow: "Problem",
          title: "Banks must validate their AML models",
          body: "The CBN's March 2026 baseline standards require independent validation of automated AML detection. That needs evidence an examiner can re-check, not a vendor's word.",
        },
        {
          eyebrow: "Approach",
          title: "Two agents, one scorer",
          body: "A prebuilt Eino ReAct agent and a hand-rolled compose.Graph pass run the same tools over the ledger. A Go validator scores the run; the app only renders its trace and report artifacts.",
        },
        {
          eyebrow: "Outcome",
          title: "Scores that admit what they miss",
          body: "On the fixture: 5 findings, 100% precision and recall, both passes agree. The drift variant drops recall to 80% and the report explains why. Real uploads show 'no ground truth' instead of a number.",
        },
      ],
      highlight: {
        eyebrow: "Inside a run",
        title: "Six tool calls,",
        serif: "every one cited.",
        body: "The trace is the contract: every tool call is logged with what it saw, and every finding cites a CBN clause and resolves back to rows in the source ledger. Without an API key, Litt runs on a deterministic stub model that doubles as the test oracle.",
        stats: [
          { value: "100%", label: "Precision and recall, period 1" },
          { value: "0.111", label: "Drift spread across periods" },
          { value: "4", label: "Validation legs" },
          { value: "39", label: "Go tests" },
        ],
        traceCaption: "react.NewAgent · period 1 · step log",
        trace: [
          { step: "list_entries", detail: "the canonical ledger rows", result: "15.5 KB" },
          { step: "check_balances", detail: "unbalanced journal J-0031" },
          { step: "find_duplicates", detail: "J-0047 and J-0048, same transfer" },
          { step: "regs_ctr", detail: "₦8.4m cash movement on J-0021" },
          { step: "regs_vat", detail: "VAT on J-0040 differs from 7.5%" },
          { step: "decide", detail: "audit complete, findings cited" },
        ],
      },
      gallery: [
        { src: "/work/litt/scorecard.jpg", alt: "Litt Standard 5.5 scorecard", caption: "Period 1 scorecard: 5 findings, scored against truth.json." },
        { src: "/work/litt/drift.jpg", alt: "Litt drift report", caption: "Period 2: recall 80%, F1 88.9%, drift 0.111, explained." },
      ],
    },
  },
  {
    slug: "qraven",
    n: "005",
    name: "Qraven",
    logo: "/work/qraven/logo.png",
    tags: ["Backend", "Mobile"],
    status: "Shipped",
    year: "2024",
    blurb: "An event platform backend with a mobile app: role-based auth, event management, ticket issuance, and payments wired to the ticket lifecycle.",
    stack: "Go · Gin · PostgreSQL · Redis · Expo",
    card: { kind: "browser", url: "QRaven · mobile app + Go API" },
    caseStudy: {
      lede: "An event platform: organisers publish events, users buy tickets, and payment status drives the ticket's lifecycle. A Go API underneath, an Expo app on top.",
      role: "Solo: Go API, mobile app",
      timeline: "Aug 2024 – Apr 2026",
      stackLong: "Go · Gin · PostgreSQL · Redis · JWT with role middleware · Prometheus · Expo / React Native",
      links: [
        { label: "API code", href: "https://github.com/Dubjay18/QRaven" },
        { label: "Mobile code", href: "https://github.com/Dubjay18/QRaven-mobile" },
      ],
      walkthrough: {
        label: "Qraven walkthrough, 28 seconds",
        chapters: [
          { t: 3, label: "Mobile app" },
          { t: 14.5, label: "API" },
          { t: 21, label: "Operations" },
        ],
      },
      story: [
        {
          eyebrow: "Problem",
          title: "Three roles, one ticket",
          body: "Organisers, attendees and admins need different powers over the same events, and a ticket must never drift from the payment that bought it.",
        },
        {
          eyebrow: "Approach",
          title: "Roles on every route",
          body: "A Gin API with JWT auth and role middleware on every route. Issuing a ticket updates event capacity; updating a payment's status moves the ticket with it.",
        },
        {
          eyebrow: "Outcome",
          title: "An API and an app",
          body: "Eleven routes across auth, events, tickets and payments, Prometheus metrics and a scheduled token cleanup, plus an Expo app for browsing, favouriting and holding tickets.",
        },
      ],
      highlight: {
        eyebrow: "Inside the API",
        title: "Every route",
        serif: "checks a role.",
        body: "Routes live under /api/v1 and pass through Authorize middleware with the roles allowed to call them. Swagger UI serves the canonical docs, and /metrics exposes Prometheus counters.",
        stats: [
          { value: "11", label: "API routes" },
          { value: "3", label: "Roles: User · Organizer · Admin" },
          { value: "JWT", label: "Auth with role middleware" },
          { value: "Expo 52", label: "Mobile app" },
        ],
        traceCaption: "pkg/router · /api/v1",
        trace: [
          { step: "POST /auth/register", detail: "create an account" },
          { step: "POST /events", detail: "create an event", result: "Organizer" },
          { step: "GET /events/:id", detail: "read an event", result: "all roles" },
          { step: "POST /tickets/:eventId", detail: "issue a ticket, update capacity", result: "all roles" },
          { step: "POST /payments/initialize", detail: "start a payment", result: "all roles" },
          { step: "PATCH /payments/:id/status", detail: "status moves the ticket", result: "all roles" },
        ],
      },
      gallery: [
        { src: "/work/qraven/screenq1.jpg", alt: "Qraven onboarding screen", caption: "Onboarding", tall: true },
        { src: "/work/qraven/screenq10.jpg", alt: "Qraven favourites", caption: "Favourites", tall: true },
        { src: "/work/qraven/screenq11.jpg", alt: "Qraven tickets", caption: "Tickets", tall: true },
      ],
    },
  },
  {
    slug: "reverie",
    n: "006",
    name: "Reverie",
    logo: "/work/reverie/logo.svg",
    tags: ["Agent infra"],
    status: "In progress",
    year: "2026",
    blurb: "A memory engine for AI agents, in Go. Record cheaply while working, consolidate while idle (it dreams), and recall a short, cited memory pack next time.",
    stack: "Go · SQLite / Postgres · MCP · HTTP · Claude Code hooks",
    card: {
      kind: "term",
      lines: [
        ["reverie remember", "fact stored as user_stated"],
        ["reverie dream", "consolidated 3 episodes"],
        ["reverie recall", "181/1500 tokens, cited"],
        ["reverie journal", "every change, revertible"],
      ],
      foot: "reverie",
    },
    caseStudy: {
      lede: "A memory engine for AI agents. The agent writes down what happens while it works; Reverie turns that record into facts, skills and summaries while the agent is idle, and hands back a short, cited block of memory next time.",
      role: "Solo",
      timeline: "Oct 2026 – present",
      stackLong: "Go · single binary · embedded SQLite or Postgres · MCP on stdio · HTTP + OpenAPI 3.1 · Claude Code hooks · LLM proxy middleware",
      links: [{ label: "Code", href: "https://github.com/Dubjay18/reverie" }],
      walkthrough: {
        label: "Reverie walkthrough: a real CLI session, 32 seconds",
        chapters: [
          { t: 3, label: "A real session" },
          { t: 18, label: "Dreaming" },
          { t: 24, label: "Evals" },
        ],
      },
      story: [
        {
          eyebrow: "Problem",
          title: "Agents forget, or drown",
          body: "Agents start every session blank. Pasting the whole history back in is slow and costly, and on the eval set it answers fewer questions than searching the raw history.",
        },
        {
          eyebrow: "Approach",
          title: "Fast awake, thoughtful asleep",
          body: "Record is append-only with no model calls. Dreams run offline on a token budget through seven phases, and a safety gate checks every proposal before one transaction commits it.",
        },
        {
          eyebrow: "Outcome",
          title: "Memory with receipts",
          body: "Every recalled item carries a citation, Expand returns the raw events behind it, and any dream can be reverted. v1.1 is built and passes go test -race; it is still pre-release.",
        },
      ],
      highlight: {
        eyebrow: "Inside a recall",
        title: "Short, cited,",
        serif: "and revertible.",
        body: "A real session: three Claude Code sessions recorded through `reverie hook`, one dream, then a recall for a new task. The pack fits the token budget, and every line points back to a fact or an episode.",
        stats: [
          { value: "92.3%", label: "Eval accuracy (53.8% raw search)" },
          { value: "228 ms", label: "p50 recall at 10K episodes" },
          { value: "182", label: "Go tests" },
          { value: "7", label: "Dream phases" },
        ],
        traceCaption: "$ reverie recall -task \"the webhook retries are failing again\"",
        trace: [
          { step: "fact", detail: "\"Webhook retries use exponential backoff capped at 5 attempts\"", result: "user stated" },
          { step: "ep:sess-001", detail: "session in payments-api: fix the webhook retries", result: "9 events" },
          { step: "ep:sess-002", detail: "session in payments-api: fix the webhook retries", result: "9 events" },
          { step: "ep:sess-003", detail: "session in payments-api: fix the webhook retries", result: "9 events" },
          { step: "budget", detail: "181/1500 tokens, 0 dropped" },
        ],
      },
    },
  },
];

export const CASE_STUDIES = PROJECTS.filter((p) => p.caseStudy);
export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug && p.caseStudy);
