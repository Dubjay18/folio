// Renders resume/resume.md to public/resume.pdf (A4, selectable text).
// Needs Playwright with Chromium:  npx -y -p playwright node scripts/build-resume.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = resolve(import.meta.dirname, "..");
const md = readFileSync(resolve(root, "resume/resume.md"), "utf8");
const body = String(await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(md));

// Inline fonts as data URIs: a page set from a string can't load file:// fonts.
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(resolve(root, "node_modules", pkg, "files", file)).toString("base64")}`;
// Group each entry (h3 + meta line + bullets) so it never splits across pages.
const grouped = body.replace(/<h3>[\s\S]*?(?=<h3>|<h2>|$)/g, (m) => `<section class="entry">${m}</section>`);
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Oluwayanfunmi Jeje - Résumé</title><style>
@font-face { font-family: Mona; src: url(${font("@fontsource-variable/mona-sans", "mona-sans-latin-wdth-normal.woff2")}) format("woff2"); font-weight: 200 900; font-stretch: 75% 125%; }
@font-face { font-family: Hubot; src: url(${font("@fontsource-variable/hubot-sans", "hubot-sans-latin-wdth-normal.woff2")}) format("woff2"); font-weight: 200 900; font-stretch: 75% 125%; }
@page { size: A4; margin: 14mm 15mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Mona, Arial, sans-serif; font-size: 9.6pt; line-height: 1.42; color: #1a1a18; }
a { color: inherit; text-decoration: none; }
h1 { font-family: Hubot, Arial, sans-serif; font-stretch: 75%; font-weight: 800; text-transform: uppercase; font-size: 30pt; line-height: 0.9; margin: 0 0 6pt; letter-spacing: -0.01em; }
h1 + p, h1 + p + p { margin: 0; color: #4a4843; font-size: 9pt; }
h2 { font-family: Hubot, Arial, sans-serif; font-stretch: 100%; font-weight: 750; text-transform: uppercase; font-size: 10pt; letter-spacing: 0.06em; margin: 13pt 0 6pt; padding-bottom: 3pt; border-bottom: 1.2pt solid #1a1a18; }
h2::before { content: ""; display: inline-block; width: 6pt; height: 6pt; background: #b9d82a; margin-right: 6pt; vertical-align: 1pt; }
h3 { font-size: 10.4pt; font-weight: 700; margin: 8pt 0 1pt; break-after: avoid; }
h3 + p { margin: 0 0 3pt; color: #4a4843; font-size: 9pt; }
h3 + p strong { color: #1a1a18; font-weight: 600; }
p { margin: 0 0 4pt; }
ul { margin: 0; padding-left: 12pt; }
li { margin: 0 0 2pt; }
li::marker { color: #8f8b83; }
h2 + ul li { margin-bottom: 1.5pt; }
.entry { break-inside: avoid; }
h2 { break-after: avoid; }
</style></head><body>${grouped}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: resolve(root, "public/resume.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("wrote public/resume.pdf");
