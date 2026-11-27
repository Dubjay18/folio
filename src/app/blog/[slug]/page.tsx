import { Shell } from "@/components/chrome";
import { CASE_MENU, CASE_NAV, SITE } from "@/data/site";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/data/blog";

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let post = await getPost(params.slug);
  if (!post) return;

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? `${SITE.url}${image}` : `${SITE.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${SITE.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Shell variant="page" nav={CASE_NAV} menu={CASE_MENU}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${SITE.url}${post.metadata.image}`
              : `${SITE.url}/og?title=${post.metadata.title}`,
            url: `${SITE.url}/blog/${post.slug}`,
            author: { "@type": "Person", name: SITE.name },
          }),
        }}
      />
      <section className="wrap case-hero hero" aria-labelledby="post-title">
        <div className="tagrow" data-hero-fade>
          <a className="back u" href="/blog">
            ← Writing
          </a>
          <span className="end" style={{ alignSelf: "center" }}>
            {formatDate(post.metadata.publishedAt)}
          </span>
        </div>
        <h1 id="post-title" className="disp h2" style={{ marginTop: 20 }}>
          {post.metadata.title}
        </h1>
      </section>
      <section className="wrap" style={{ paddingBottom: "clamp(72px,9vw,128px)" }}>
        <article className="prose" dangerouslySetInnerHTML={{ __html: post.source }} />
      </section>
    </Shell>
  );
}
