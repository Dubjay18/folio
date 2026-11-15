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
| `src/data/site.ts` | All copy, links, projects, timeline, services |
| `src/app/page.tsx` | Home page |
| `src/app/work/reelstack/page.tsx` | Case study (copy it for each project) |
| `src/app/blog/` | Writing index (Medium RSS) and local MDX posts from `content/` |
| `src/app/globals.css` | Tokens and all styles |
| `src/components/motion.tsx` | Lenis, GSAP motion, video loading, menu, clock |
| `src/components/contact-form.tsx` | Enquiry form |
| `public/videos/` | Project videos |

## Contact form

Set `NEXT_PUBLIC_FORM_ENDPOINT` (e.g. a Formspree form URL) to POST enquiries as JSON.
Without it, submitting opens the visitor's email app with the enquiry pre-filled.

## Videos

Each card loads its video only when needed: on hover/focus with a mouse, or when it scrolls into view on touch.
Files it looks for in `public/videos/`:

- `showreel-loop.mp4` (+ optional `.webm`), `showreel-full.mp4`
- `reelstack-loop.mp4`, `son-of-anton-loop.mp4`, `deepwork-loop.mp4`, `litt-loop.mp4`, `qraven-loop.mp4`
- `reelstack-walkthrough.mp4` + `reelstack-walkthrough.vtt`, `reelstack-desktop-lists.mp4`, `reelstack-mobile-riley.mp4`

Card loops: 6 to 12 s, muted, about 1280 px wide (720 px for phone clips), under 2 MB:

```bash
ffmpeg -i input.mov -an -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 28 -movflags +faststart reelstack-loop.mp4
```

If a file is missing, the labelled placeholder stays visible.

## Before launch

- Replace everything in `[BRACKETS]` in `src/data/site.ts` and the case study (metrics, dates, URLs, Qraven/Private TM details)
- Add `public/resume.pdf`
- Swap the Cal.com links in `src/data/site.ts` for your real event links
- Set `NEXT_PUBLIC_FORM_ENDPOINT` in Vercel

# License

MIT, see [LICENSE](./LICENSE).
