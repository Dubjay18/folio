import { Shell } from "@/components/chrome";
import { CASE_MENU, CASE_NAV } from "@/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reelstack case study",
  description:
    "Reelstack: a social film and TV watchlist with Riley, an AI agent. Designed and built end to end by Jay.",
};

const CHAPTERS = [
  { t: 0, stamp: "0:00", label: "The problem" },
  { t: 18, stamp: "0:18", label: "Social lists" },
  { t: 41, stamp: "0:41", label: "Asking Riley" },
  { t: 70, stamp: "1:10", label: "Under the hood" },
];

const STORY = [
  {
    eyebrow: "Problem",
    title: "Recommendations without context",
    body: "[WHAT WAS BROKEN, e.g. friends share picks in group chats where they get lost, and generic recommenders ignore taste.]",
  },
  {
    eyebrow: "Approach",
    title: "Social graph + an agent with tools",
    body: "A fast watchlist core with live shared lists, plus Riley: an agent that can read lists, search titles and write back through an MCP server instead of guessing.",
  },
  {
    eyebrow: "Outcome",
    title: "[HEADLINE RESULT]",
    body: "[WHAT CHANGED: users, lists created, retention, response time. One honest number beats three vague ones.]",
  },
];

const RESULTS = [
  ["[N]", "Active users"],
  ["[N]", "Lists created"],
  ["[N] s", "Riley p95 answer"],
  ["$[0.00X]", "Cost per chat"],
];

const RILEY_STEPS = [
  ["parse_intent", "tone: comedy · ref: Severance"],
  ["get_history", "your last [N] titles"],
  ["friends_lists", "[N] overlapping picks"],
  ["search_titles", "[N] candidates"],
  ["rank + reply", "5 titles, add in one tap"],
];

export default function ReelstackCase() {
  return (
    <Shell variant="case" nav={CASE_NAV} menu={CASE_MENU}>
      <section className="wrap case-hero hero" aria-labelledby="cs-title">
        <div className="tagrow" data-hero-fade>
          <a className="back u" href="/#work">
            ← All work
          </a>
          <span style={{ alignSelf: "center" }}>/ Case 001</span>
          <span className="accent" style={{ alignSelf: "center" }}>
            Web + Agent
          </span>
          <span className="end" style={{ alignSelf: "center" }}>
            Live
          </span>
        </div>
        <h1 id="cs-title" className="disp case-title">
          <span className="line">
            <span>Reelstack</span>
          </span>
        </h1>
        <p className="case-lede" data-hero-fade>
          Watchlists are lonely. Reelstack makes them social and adds <span className="serif">Riley,</span> an agent
          that knows what you&apos;ll want to watch next.
        </p>
        <dl className="case-meta" data-hero-fade>
          <div>
            <dt>Role</dt>
            <dd>Solo: product, design, frontend, backend, agent</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>[N weeks · YEAR]</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>Next.js 14 · PostgreSQL (Neon) · Redis (Upstash) · MCP server</dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd style={{ display: "flex", gap: 18 }}>
              <a className="u" href="#">
                Live site
              </a>
              <a className="u" href="https://github.com/Dubjay18">
                Code
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="wrap" aria-label="Product walkthrough video">
        <div className="player-card reel">
          <div className="vid grid-bg" data-walkthrough>
            <video controls playsInline preload="none" aria-label="Reelstack walkthrough, narrated, 90 seconds">
              <source data-src="/videos/reelstack-walkthrough.mp4" type="video/mp4" />
              <track kind="captions" srcLang="en" label="English" src="/videos/reelstack-walkthrough.vtt" default />
            </video>
            <div className="vid__ph">[ reelstack-walkthrough.mp4 · narrated · 1:30 · captions on ]</div>
          </div>
          <div className="chapters" role="group" aria-label="Chapters">
            <span className="label" style={{ fontSize: 11, marginRight: 6, flex: "none" }}>
              Chapters
            </span>
            {CHAPTERS.map((c, i) => (
              <button className="choice" type="button" aria-pressed={i === 0} data-chapter={c.t} key={c.t}>
                <span className="mono" style={{ fontSize: 11, marginRight: 6 }}>
                  {c.stamp}
                </span>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section story">
        {STORY.map((s) => (
          <article data-reveal key={s.eyebrow}>
            <span className="label accent" data-scramble>
              {s.eyebrow}
            </span>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </article>
        ))}
      </section>

      <section className="wrap" aria-labelledby="gal-title">
        <h2 id="gal-title" className="label" style={{ margin: "0 0 18px", fontWeight: 400 }}>
          On every screen
        </h2>
        <div className="gallery">
          <figure className="wide" data-reveal>
            <div className="vid" data-video data-autoplay data-clip>
              <video muted loop playsInline preload="none" aria-label="Shared list updating live on desktop">
                <source data-src="/videos/reelstack-desktop-lists.mp4" type="video/mp4" />
              </video>
              <div className="vid__ph">[ reelstack-desktop-lists.mp4 · 16:10 ]</div>
            </div>
            <figcaption>Shared lists update live for everyone in the group.</figcaption>
          </figure>
          <figure className="tall" data-reveal>
            <div className="phone" data-clip>
              <div className="vid" data-video data-autoplay>
                <video muted loop playsInline preload="none" aria-label="Asking Riley for a recommendation on mobile">
                  <source data-src="/videos/reelstack-mobile-riley.mp4" type="video/mp4" />
                </video>
                <div className="vid__ph">[ mobile-riley.mp4 ]</div>
              </div>
            </div>
            <figcaption style={{ alignSelf: "stretch" }}>Riley on mobile: ask in plain words, get a list back.</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap section split" aria-labelledby="riley-title">
        <div className="stack">
          <span className="label accent" data-scramble>
            Inside Riley
          </span>
          <h2 id="riley-title" className="disp h2 h2--sm" data-split>
            One question, <span className="serif muted">five tool calls.</span>
          </h2>
          <p className="muted" style={{ margin: 0, maxWidth: "42ch" }} data-reveal>
            Riley reads your history and your friends&apos; lists through an MCP server, then answers with titles you can
            add in one tap. Every run is traced, so slow or wrong answers get found and fixed.
          </p>
          <div className="results" data-reveal>
            {RESULTS.map(([v, l]) => (
              <div className="result" key={l}>
                <b>{v}</b>
                <span className="label" style={{ fontSize: 11 }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
        <figure className="trace" data-reveal>
          <figcaption>“something like Severance but funnier”</figcaption>
          <ol className="steps-trace" data-trace>
            {RILEY_STEPS.map(([tool, detail], i) => (
              <li key={tool}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <b>{tool}</b> {detail}
                </span>
                <span>[ms]</span>
              </li>
            ))}
          </ol>
        </figure>
      </section>

      <section style={{ borderTop: "1px solid #1f1f1c" }}>
        <a className="wrap next" href="/#work" data-cursor="Next">
          <span style={{ minWidth: 0 }}>
            <span className="label">Next case / 002</span>
            <span className="disp next__title">Son of Anton</span>
          </span>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </a>
      </section>
    </Shell>
  );
}
