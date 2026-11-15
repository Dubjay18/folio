import { SITE } from "@/data/site";
import "@fontsource-variable/hubot-sans/wdth.css";
import "@fontsource-variable/mona-sans/wdth.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource/monaspace-neon/400.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon/favicon-32x32.png", sizes: "32x32" }],
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before paint: hides motion start states only when motion will run,
// and falls back to static content if the motion layer never boots.
const bootScript = `(function(){var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js');setTimeout(function(){if(!window.__motion)d.classList.remove('js');},3000);}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="progress" aria-hidden="true" />
        <div className="cursor" aria-hidden="true">
          <span />
        </div>
        {children}
      </body>
    </html>
  );
}
