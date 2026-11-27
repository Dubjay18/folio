import { Shell } from "@/components/chrome";
import { getBlogPosts } from "@/data/blog";
import { CASE_MENU, CASE_NAV, SITE } from "@/data/site";

export const metadata = {
  title: "Writing",
  description: "Notes on agents, LLM infrastructure, Go and shipping software end to end.",
};

// Re-fetch the Medium feed at most once an hour.
export const revalidate = 3600;

const fmt = (d: string) => {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default async function BlogPage() {
  const posts = (await getBlogPosts()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <Shell variant="page" nav={CASE_NAV} menu={CASE_MENU}>
      <section className="wrap case-hero hero" aria-labelledby="blog-title">
        <div className="tagrow" data-hero-fade>
          <a className="back u" href="/#writing">
            ← Home
          </a>
          <span className="end" style={{ alignSelf: "center" }}>
            {posts.length} posts
          </span>
        </div>
        <h1 id="blog-title" className="disp case-title">
          <span className="line">
            <span>Writing</span>
          </span>
        </h1>
        <p className="case-lede" data-hero-fade>
          Building in public: agent harnesses, LLM gateways, RAG from scratch and <span className="serif">build logs.</span>
        </p>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }} aria-label="All posts">
        {posts.length === 0 ? (
          <p className="muted">
            The feed is quiet right now.{" "}
            <a className="u accent" href={SITE.medium}>
              Read on Medium →
            </a>
          </p>
        ) : (
          <ol className="post-list">
            {posts.map((p) => (
              <li key={p.link} data-reveal>
                <a href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="Read">
                  <span className="label post-list__date">{fmt(p.publishedAt)}</span>
                  <span className="post-list__body">
                    <span className="post-list__t">{p.title}</span>
                    <span className="post-list__s">{p.summary}</span>
                  </span>
                  <span className="arrow post-list__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </Shell>
  );
}
