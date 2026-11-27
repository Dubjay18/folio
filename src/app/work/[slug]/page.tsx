import { Arrow, Shell } from "@/components/chrome";
import { CASE_STUDIES, projectBySlug, videoFor } from "@/data/projects";
import { CASE_MENU, CASE_NAV } from "@/data/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return CASE_STUDIES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const p = projectBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} case study`,
    description: p.blurb,
    openGraph: { images: [videoFor(p.slug).poster] },
  };
}

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export default function CaseStudyPage({ params }: Params) {
  const p = projectBySlug(params.slug);
  if (!p || !p.caseStudy) notFound();
  const c = p.caseStudy;
  const v = videoFor(p.slug);
  const i = CASE_STUDIES.findIndex((x) => x.slug === p.slug);
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];

  return (
    <Shell variant="case" nav={CASE_NAV} menu={CASE_MENU}>
      <section className="wrap case-hero hero" aria-labelledby="cs-title">
        <div className="tagrow" data-hero-fade>
          <a className="back u" href="/#work">
            ← All work
          </a>
          <span style={{ alignSelf: "center" }}>/ Case {p.n}</span>
          <span className="accent" style={{ alignSelf: "center" }}>
            {p.tags.join(" + ")}
          </span>
          <span className="end" style={{ alignSelf: "center" }}>
            {p.status} · {p.year}
          </span>
        </div>
        <h1 id="cs-title" className="disp case-title">
          <span className="line">
            <span className="case-title__row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="case-logo" src={p.logo} alt={`${p.name} logo`} />
              {p.name}
            </span>
          </span>
        </h1>
        <p className="case-lede" data-hero-fade>
          {c.lede}
        </p>
        <dl className="case-meta" data-hero-fade>
          <div>
            <dt>Role</dt>
            <dd>{c.role}</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>{c.timeline}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{c.stackLong}</dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd style={{ display: "flex", flexWrap: "wrap", gap: "0 18px" }}>
              {c.links.length ? (
                c.links.map((l) => (
                  <a key={l.href} className="u" href={l.href}>
                    {l.label}
                  </a>
                ))
              ) : (
                <span className="muted">Private repository</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="wrap" aria-label="Product walkthrough video">
        <div className="player-card reel">
          <div className="vid grid-bg is-playing" data-walkthrough>
            <video controls playsInline preload="none" poster={v.poster} aria-label={c.walkthrough.label}>
              <source data-src={v.walkthrough} type="video/mp4" />
            </video>
          </div>
          <div className="chapters" role="group" aria-label="Chapters">
            <span className="label" style={{ fontSize: 11, marginRight: 6, flex: "none" }}>
              Chapters
            </span>
            {[{ t: 0, label: "Intro" }, ...c.walkthrough.chapters].map((ch, k) => (
              <button className="choice" type="button" aria-pressed={k === 0} data-chapter={ch.t} key={ch.t}>
                <span className="mono" style={{ fontSize: 11, marginRight: 6 }}>
                  {fmt(ch.t)}
                </span>
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section story">
        {c.story.map((s) => (
          <article data-reveal key={s.eyebrow}>
            <span className="label accent" data-scramble>
              {s.eyebrow}
            </span>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </article>
        ))}
      </section>

      {c.gallery && (
        <section className="wrap" aria-labelledby="gal-title">
          <h2 id="gal-title" className="label" style={{ margin: "0 0 18px", fontWeight: 400 }}>
            The real screens
          </h2>
          <div className={`shots ${c.gallery.some((g) => g.tall) ? "shots--tall" : ""}`}>
            {c.gallery.map((g) => (
              <figure key={g.src} data-reveal>
                <div className="shots__frame" data-clip>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.alt} loading="lazy" />
                </div>
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section split" aria-labelledby="hl-title">
        <div className="stack">
          <span className="label accent" data-scramble>
            {c.highlight.eyebrow}
          </span>
          <h2 id="hl-title" className="disp h2 h2--sm" data-split>
            {c.highlight.title} <span className="serif muted">{c.highlight.serif}</span>
          </h2>
          <p className="muted" style={{ margin: 0, maxWidth: "46ch" }} data-reveal>
            {c.highlight.body.split("`").map((part, k) => (k % 2 ? <code key={k} className="mono">{part}</code> : part))}
          </p>
          <div className="results" data-reveal>
            {c.highlight.stats.map((s) => (
              <div className="result" key={s.label}>
                <b>{s.value}</b>
                <span className="label" style={{ fontSize: 11 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <figure className="trace" data-reveal>
          <figcaption>{c.highlight.traceCaption}</figcaption>
          <ol className="steps-trace" data-trace>
            {c.highlight.trace.map((r, k) => (
              <li key={r.step + k}>
                <span>{String(k + 1).padStart(2, "0")}</span>
                <span>
                  <b>{r.step}</b> {r.detail}
                </span>
                <span>{r.result ?? ""}</span>
              </li>
            ))}
          </ol>
        </figure>
      </section>

      <section style={{ borderTop: "1px solid #1f1f1c" }}>
        <a className="wrap next" href={`/work/${next.slug}`} data-cursor="Next">
          <span style={{ minWidth: 0 }}>
            <span className="label">Next case / {next.n}</span>
            <span className="disp next__title">{next.name}</span>
          </span>
          <Arrow />
        </a>
      </section>
    </Shell>
  );
}
