# Jay / studio portfolio

Studio-style portfolio: home page, a Reelstack case study, and a writing index fed by Medium RSS.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Stack

- **Next.js 14 (App Router) + TypeScript**, server-rendered so content works without JavaScript
- **GSAP** (ScrollTrigger, SplitText, ScrambleText) for all motion
- **Lenis** as the only smooth-scroll engine, driven by the GSAP ticker
- Self-hosted fonts (OFL): **Hubot Sans** display (75–125% width axis), **Mona Sans** text, **Monaspace Neon** labels/traces, **Newsreader** italic accents

## Where things live

| Path | What |
| --- | --- |
| `src/data/site.ts` | Copy, links, timeline, services, index |
| `src/data/projects.ts` | Selected work and every case study (all facts from each project's repo) |
| `src/app/page.tsx` | Home page |
| `src/app/work/[slug]/page.tsx` | Case study template, one page per project with a case study |
| `src/app/blog/` | Writing index (Medium RSS) and local MDX posts from `content/` |
| `src/app/globals.css` | Tokens and all styles |
| `src/components/motion.tsx` | Lenis, GSAP motion, video loading, menu, clock |
| `public/work/<slug>/` | Project logos and real screenshots |
| `public/videos/` | Showreel, per-project walkthroughs, card loops and posters |

## Contact form

Set `NEXT_PUBLIC_FORM_ENDPOINT` (e.g. a Formspree form URL) to POST enquiries as JSON.
Without it, submitting opens the visitor's email app with the enquiry pre-filled.

## Showreel

The hero showreel (`public/videos/showreel-*`) is generated, not filmed: `showreel/index.html` puts the real products
(live sites of Grupp, WorkSage, Throughline and ShipPack, plus Reelstack, QRaven and Zush screens from their repos,
all in `showreel/img`) into browser and phone frames and animates them frame by frame. `showreel/music.py` synthesises
the soundtrack and `showreel/build.sh` renders and encodes everything. Made with the
[/brag](https://github.com/latent-spaces/brag) workflow; `showreel/plan.md` is the storyboard.

```bash
./showreel/build.sh
```

## Project demos

Each case study has a walkthrough (`<slug>-walkthrough.mp4`, with an original synthesized soundtrack) and its card
plays a 10-second muted loop (`<slug>-loop.mp4`). They are built from the real thing:

- **Reelstack:** the app's own screenshots from `docs/screenshots`, plus its MCP tools and Riley's real config
- **Son of Anton:** the real review thread SOA posted on `soa-sandbox` PR #1 (`@soa security`)
- **Litt:** a recorded session of the real app and Go backend running the demo fixture on the stub model
- **Qraven:** the mobile app's screenshots and the routes from `pkg/router`
- **Reverie:** a real CLI session (`remember`, three Claude Code sessions via `reverie hook`, `dream`, `recall`, `journal`)

Cards load video only on intent: on hover/focus with a mouse, or when scrolled into view on touch.

# License

MIT, see [LICENSE](./LICENSE).
