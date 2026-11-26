import { Arrow, Roll, Shell } from "@/components/chrome";
import { ContactForm } from "@/components/contact-form";
import { getBlogPosts } from "@/data/blog";
import {
  CLIENTS,
  HOME_MENU,
  HOME_NAV,
  INDEX_ROWS,
  PROJECTS,
  SERVICES,
  SITE,
  SKILLS,
  STATS,
  STEPS,
  TIMELINE,
  TRACE_ROWS,
  type Project,
} from "@/data/site";

// Re-fetch the Medium feed at most once an hour.
export const revalidate = 3600;

const PlayIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
  </svg>
);

function TagRow({ n, tags, status }: { n: string; tags: string[]; status: string }) {
  return (
    <div className="tagrow">
      <span>{n}</span>
      <span>/</span>
      {tags.map((t, i) => (
        <span key={t} style={{ display: "contents" }}>
          {i > 0 && <span>+</span>}
          <span className="accent">{t}</span>
        </span>
      ))}
      <span className="end">{status}</span>
    </div>
  );
}

function ProjectMedia({ p }: { p: Project }) {
  const m = p.media;
  if (m.kind === "term") {
    return (
      <div className="term media-inner">
        {m.lines.map(([cmd, rest]) => (
          <p key={cmd}>
            <span className="caret">›</span> <b>{cmd}</b> {rest}
          </p>
        ))}
        <p className="term__foot">
          [ {m.video.split("/").pop()} ]<span className="caret cursor-block">_</span>
        </p>
        <div className="vid" data-video>
          <video muted loop playsInline preload="none" aria-label={p.videoLabel}>
            <source data-src={m.video} type="video/mp4" />
          </video>
          <div className="vid__ph" />
        </div>
      </div>
    );
  }
  const vid = (
    <div className="vid" data-video>
      <video muted loop playsInline preload="none" aria-label={p.videoLabel}>
        <source data-src={m.video} type="video/mp4" />
      </video>
      <div className="vid__ph">{m.placeholder}</div>
    </div>
  );
  if (m.kind === "phone") return <div className="phone media-inner">{vid}</div>;
  return (
    <div className="browser media-inner">
      <div className="browser__bar">
        <i />
        <i />
        <i />
        <span>{m.url}</span>
      </div>
      {vid}
    </div>
  );
}

function formatPostDate(d: string) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default async function Page() {
  const posts = (await getBlogPosts()).slice(0, 3);

  return (
    <Shell variant="home" nav={HOME_NAV} menu={HOME_MENU}>
      {/* HERO */}
      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="hero__meta label" data-hero-fade>
          <span>{SITE.name} / Software &amp; Applied AI Engineer</span>
          <span className="hide-sm">Index N°01 / {new Date().getFullYear()}</span>
          <span>
            {SITE.location} / <time data-clock>WAT</time>
          </span>
        </div>
        <h1 id="hero-title" className="disp hero__title">
          <span className="line">
            <span>I build web apps,</span>
          </span>
          <span className="line">
            <span>
              mobile apps <span className="serif hero__amp">&amp;</span>
            </span>
          </span>
          <span className="line">
            <span className="accent">AI agents.</span>
          </span>
        </h1>
        <div className="hero__grid">
          <p className="hero__lede" data-hero-fade>
            An independent engineer working like a one-person studio. I design, build and run the whole stack:
            interfaces, backends and the agents in between, for teams that need it{" "}
            <span className="serif">in production,</span> not in a demo.
          </p>
          <div className="hero__ctas" data-hero-fade>
            <div>
              <a className="btn btn--volt" href="#contact" data-magnetic>
                <Roll>Start a project</Roll> <Arrow />
              </a>
              <a className="btn btn--line" href="#hiring" data-magnetic>
                <Roll>Hiring full-time?</Roll>{" "}
                <span className="mono" style={{ fontSize: 12, color: "var(--ash)" }}>
                  Résumé ↓
                </span>
              </a>
            </div>
            <p className="label" style={{ margin: 0 }}>
              Contracts · Full-time roles · Replies within one business day
            </p>
          </div>
        </div>

        <figure className="reel" aria-label="Showreel">
          <svg className="badge" viewBox="0 0 132 132" aria-hidden="true">
            <defs>
              <path id="circ" d="M66 66 m-50 0 a50 50 0 1 1 100 0 a50 50 0 1 1 -100 0" />
            </defs>
            <text fontFamily="Monaspace Neon, ui-monospace, monospace" fontSize="10" letterSpacing="2.2" fill="#9B978E">
              <textPath href="#circ">OPEN FOR CONTRACTS · OPEN TO ROLES · </textPath>
            </text>
            <circle cx="66" cy="66" r="6" fill="#D2F53C" />
          </svg>
          <div className="reel__frame grid-bg" data-reel-scale data-cursor="Play">
            <div className="vid" data-video data-autoplay style={{ position: "absolute", inset: 0, background: "transparent" }}>
              <video muted loop playsInline preload="none" aria-label="Showreel loop: Reelstack, Deep Work and Son of Anton in use">
                <source data-src="/videos/showreel-loop.mp4" type="video/mp4" />
                <source data-src="/videos/showreel-loop.webm" type="video/webm" />
              </video>
              <div className="vid__ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/videos/showreel-poster.jpg"
                  alt=""
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="reel__chips">
              <span className="chip chip--on">Showreel {new Date().getFullYear()}</span>
              <span className="chip chip--extra">Muted loop 0:12 · full cut 0:21 on click</span>
            </div>
            <button className="reel__play" type="button" aria-label="Play the full showreel" data-open-player="/videos/showreel-full.mp4">
              <PlayIcon size={26} />
            </button>
            <div className="reel__foot label">
              <span>01 Web</span>
              <span>02 Mobile</span>
              <span>03 Agents</span>
              <span>04 Systems</span>
            </div>
          </div>
        </figure>
      </section>

      {/* PROOF */}
      <section className="stats" aria-label="At a glance">
        <div className="wrap stats__grid">
          {STATS.map((s) => (
            <div className="stat" data-reveal key={s.label}>
              <div className="disp stat__v">
                {"value" in s ? (
                  <>
                    <span data-count={s.value}>{s.value}</span>
                    {"suffix" in s ? s.suffix : null}
                  </>
                ) : (
                  s.text
                )}
              </div>
              <span className="label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="marquee">
          <p className="sr-only">Shipped with {CLIENTS.slice(0, -1).join(", ")} and {CLIENTS[CLIENTS.length - 1]}.</p>
          <div className="marquee__track" aria-hidden="true" data-marquee>
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span className="marquee__item" key={`${c}-${i}`}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="wrap statement" aria-label="How I work">
        <span className="label eyebrow" data-scramble>
          (Approach)
        </span>
        <p data-statement>
          I treat every build like a product I&apos;d ship under my own name: designed with care, engineered to hold
          up, and <span className="serif">instrumented</span> so you can see it working.
        </p>
      </section>

      {/* WORK */}
      <section id="work" className="wrap section" aria-labelledby="work-title">
        <div className="section__head">
          <h2 id="work-title" className="disp h2" data-split>
            Selected work <sup>({String(PROJECTS.length + 1).padStart(2, "0")})</sup>
          </h2>
          <p className="section__lede" data-reveal>
            Every project ships with a silent loop on the card and a narrated walkthrough inside. Hover a card to play; on
            a phone it plays as you scroll.
          </p>
        </div>

        <a className="card featured" href="/work/reelstack" data-reveal data-hover-video data-cursor="View">
          <div className="featured__media" data-clip>
            <div className="browser media-inner">
              <div className="browser__bar">
                <i />
                <i />
                <i />
                <span>[reelstack URL]</span>
              </div>
              <div className="vid" data-video>
                <video muted loop playsInline preload="none" aria-label="Reelstack: building a shared watchlist with Riley">
                  <source data-src="/videos/reelstack-loop.webm" type="video/webm" />
                  <source data-src="/videos/reelstack-loop.mp4" type="video/mp4" />
                </video>
                <div className="vid__ph">[ reelstack-loop.mp4 · 16:10 ]</div>
              </div>
            </div>
            <span className="play-dot" aria-hidden="true">
              <PlayIcon />
            </span>
          </div>
          <div className="featured__body">
            <TagRow n="001" tags={["Web", "Agent"]} status="Live" />
            <div>
              <h3 className="disp featured__title">Reelstack</h3>
              <p className="featured__blurb">
                A social film &amp; TV watchlist with <span className="serif">Riley,</span> an AI agent that recommends,
                explains and builds lists with you.
              </p>
            </div>
            <dl className="dl">
              <div>
                <dt>Role</dt>
                <dd>Design, frontend, backend, agent</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>Next.js · Postgres · Redis · MCP</dd>
              </div>
            </dl>
            <span style={{ fontWeight: 600 }}>
              Read the case study <Arrow />
            </span>
          </div>
        </a>

        <div className="work-grid">
          {PROJECTS.map((p) => (
            <article className="card proj" data-reveal data-hover-video data-cursor="Play" key={p.name}>
              <div className="proj__media" data-clip>
                <ProjectMedia p={p} />
              </div>
              <div className="proj__body">
                <TagRow n={p.n} tags={p.tags} status={p.status} />
                <h3 className="disp proj__title">{p.name}</h3>
                <p className="proj__blurb">{p.blurb}</p>
                <p className="proj__stack">{p.stack}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="index" data-reveal>
          <h3 className="label" style={{ margin: "0 0 10px", fontWeight: 400 }} data-scramble>
            Full index: open source &amp; experiments
          </h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Type</th>
                <th scope="col">Built with</th>
                <th scope="col">Year</th>
              </tr>
            </thead>
            <tbody>
              {INDEX_ROWS.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TRACE */}
      <section className="wrap section" aria-labelledby="trace-title" style={{ paddingTop: 0 }}>
        <div className="split">
          <div className="stack">
            <span className="label accent" data-scramble>
              How I ship agents
            </span>
            <h2 id="trace-title" className="disp h2 h2--sm" data-split>
              Not a demo. <span className="serif muted">A trace you can read.</span>
            </h2>
            <p className="muted" style={{ margin: 0, maxWidth: "44ch" }} data-reveal>
              Every agent I build is instrumented from day one: each step, tool call, token and failure is logged, and
              behaviour is checked against an eval set before it ships. This is a run of Son of Anton reviewing a pull
              request.
            </p>
            <ul className="checks" data-reveal>
              <li>
                <span className="mono">01</span>Evals built from real ground truth, not vibes
              </li>
              <li>
                <span className="mono">02</span>Cost and latency budgets per run
              </li>
              <li>
                <span className="mono">03</span>Guardrails and graceful failure paths
              </li>
            </ul>
          </div>
          <figure className="trace" data-reveal>
            <figcaption>
              <span>
                <span style={{ color: "var(--paper)" }}>son-of-anton</span> · run [RUN ID]
              </span>
              <span>review PR [#NUMBER]</span>
            </figcaption>
            <table>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">Detail</th>
                  <th scope="col">ms</th>
                  <th scope="col">tokens</th>
                </tr>
              </thead>
              <tbody data-trace>
                {TRACE_ROWS.map(([step, detail, ms, tok]) => (
                  <tr key={step}>
                    <td>
                      <span className="accent">›</span> {step}
                    </td>
                    <td>{detail}</td>
                    <td>{ms}</td>
                    <td>{tok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="trace__foot">
              <span>
                Eval agreement <span className="accent">[X]%</span>
              </span>
              <span>Total [N] ms</span>
              <span>Cost $[0.00X]</span>
            </div>
          </figure>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="paper" aria-labelledby="svc-title">
        <div className="wrap section">
          <div className="section__head">
            <h2 id="svc-title" className="disp h2" data-split>
              Ways to <span className="serif">work together</span>
            </h2>
            <p className="section__lede" data-reveal>
              Fixed scope, a written plan and weekly progress you can watch. Every quote follows a 20-minute call.
            </p>
          </div>
          <div className="services">
            {SERVICES.map((s, i) => (
              <article className="service" data-reveal key={s.title}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="disp">{s.title}</h3>
                <p>{s.body}</p>
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="wrap section" aria-labelledby="proc-title">
        <h2 id="proc-title" className="disp h2" data-split>
          How a project{" "}
          <span className="serif" style={{ color: "var(--ash)" }}>
            runs
          </span>
        </h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" data-reveal key={s.title}>
              <span className="disp step__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="label">{s.when}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* HIRING */}
      <section id="hiring" className="hiring" aria-labelledby="hire-title">
        <div className="wrap section split" style={{ gap: "48px clamp(32px,5vw,72px)" }}>
          <div className="stack">
            <span className="label accent" data-scramble>
              For hiring teams
            </span>
            <h2 id="hire-title" className="disp h2 h2--sm" data-split>
              Applied AI engineer, <span className="serif muted">fullstack by habit.</span>
            </h2>
            <p className="muted" style={{ margin: 0, maxWidth: "42ch" }} data-reveal>
              Open to full-time Applied AI, Forward-Deployed and Product Engineering roles, remote or relocating. Four
              years shipping production systems in fintech and AI tooling, from regulated ledgers to multi-agent
              dashboards.
            </p>
            <div className="pills" data-reveal>
              {SKILLS.map((s) => (
                <span className="pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="btn-row" data-reveal>
              <a className="btn btn--volt" href={SITE.resume} data-magnetic>
                <Roll>Download résumé</Roll>{" "}
                <span className="mono" style={{ fontSize: 12 }}>
                  PDF
                </span>
              </a>
              <a className="btn btn--line" href={SITE.cal} data-magnetic>
                <Roll>Book an intro call</Roll> <Arrow />
              </a>
            </div>
            <p className="label" style={{ margin: 0 }}>
              B.Sc. Computer Science with Mathematics, Obafemi Awolowo University, 2027
            </p>
          </div>
          <ol className="timeline" data-reveal>
            {TIMELINE.map((t) => (
              <li key={t.co}>
                <span className="co">{t.co}</span>
                <span className="r date">{t.date}</span>
                <span className="role">{t.role}</span>
                <span className="r tag">{t.tag}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WRITING */}
      <section id="writing" className="wrap" aria-labelledby="wr-title" style={{ paddingBottom: "clamp(72px,9vw,120px)" }}>
        <div className="section__head" style={{ borderTop: "1px solid #2a2a27", paddingTop: 22 }}>
          <h2 id="wr-title" className="disp" style={{ margin: 0, fontSize: "clamp(34px,4vw,48px)" }}>
            Writing &amp; building in public
          </h2>
          <a className="label u" href="/blog" style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}>
            All posts →
          </a>
        </div>
        <div className="posts">
          {posts.length > 0 ? (
            posts.map((p) => (
              <a className="card post" href={p.link} data-reveal data-cursor="Read" key={p.link} target="_blank" rel="noopener noreferrer">
                <span className="label" style={{ fontSize: 11 }}>
                  Medium · {formatPostDate(p.publishedAt)}
                </span>
                <span className="post__t">{p.title}</span>
                <span className="mono">
                  Read <span className="arrow">→</span>
                </span>
              </a>
            ))
          ) : (
            <a className="card post" href={SITE.medium} data-reveal data-cursor="Read">
              <span className="label" style={{ fontSize: 11 }}>
                Medium
              </span>
              <span className="post__t">Agent harnesses, RAG from scratch and build logs, on Medium.</span>
              <span className="mono">
                Read <span className="arrow">→</span>
              </span>
            </a>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact" aria-labelledby="ct-title">
        <div className="wrap section split" style={{ gap: "48px clamp(32px,5vw,72px)" }}>
          <div className="stack" style={{ gap: 22 }}>
            <h2 id="ct-title" className="disp contact__title" data-split>
              Let&apos;s build <span className="serif">the thing.</span>
            </h2>
            <p data-reveal>
              Tell me what you&apos;re making. You&apos;ll get a reply within one business day, usually with questions and
              sometimes with a rough plan.
            </p>
            <div className="contact__links" data-reveal>
              <a href={SITE.cal} style={{ fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4 }}>
                Book a free project call →
              </a>
              <button type="button" className="copy" data-copy={SITE.email}>
                or email {SITE.email}&#160;<span data-copy-label>(click to copy)</span>
              </button>
            </div>
          </div>
          <div data-reveal style={{ minWidth: 0 }}>
            <ContactForm />
          </div>
        </div>
      </section>
    </Shell>
  );
}
