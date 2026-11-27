"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

declare global {
  interface Window {
    __motion?: boolean;
  }
}

// Strong ease-out for entrances, ease-in-out for on-screen moves.
const EASE_OUT = "expo.out";
const EASE_IN_OUT = "expo.inOut";

const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

/**
 * Wires up every behaviour on the page: smooth scroll, menu, video slots,
 * player, clock, copy button, header hide, and all GSAP motion.
 * Content is server-rendered and works without this component.
 */
export function Motion() {
  useEffect(() => {
    window.__motion = true;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ac = new AbortController();
    const signal = ac.signal;
    const cleanups: Array<() => void> = [() => ac.abort()];

    /* Smooth scroll: Lenis is the only scroll engine, driven by GSAP. */
    let lenis: Lenis | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(raf);
        lenis?.destroy();
        lenis = null;
      });
    }

    const scrollToHash = (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      history.replaceState(null, "", hash);
    };

    /* Mobile menu */
    const menu = $("[data-menu]");
    const menuBtn = $<HTMLButtonElement>("[data-menu-btn]");
    const header = $("[data-header]");
    let menuOpen = false;

    const setMenu = (open: boolean, { focus = true } = {}) => {
      if (!menu || !menuBtn) return;
      menuOpen = open;
      menu.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      const label = $("[data-menu-label]", menuBtn);
      if (label) label.textContent = open ? "Close" : "Menu";
      $$("main, footer").forEach((el) => {
        el.inert = open;
      });
      header?.classList.remove("is-hidden");
      if (open) {
        lenis?.stop();
        if (focus) $<HTMLElement>("a", menu)?.focus({ preventScroll: true });
      } else {
        lenis?.start();
        if (focus) menuBtn.focus({ preventScroll: true });
      }
    };
    if (menu && menuBtn) {
      menuBtn.addEventListener("click", () => setMenu(!menuOpen), { signal });
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape" && menuOpen) setMenu(false);
        },
        { signal },
      );
      $$<HTMLAnchorElement>("a", menu).forEach((a) =>
        a.addEventListener(
          "click",
          (e) => {
            const samePage = a.pathname === location.pathname && a.hash;
            setMenu(false, { focus: false });
            if (samePage) {
              e.preventDefault();
              setTimeout(() => scrollToHash(a.hash), 60);
            }
          },
          { signal },
        ),
      );
      const mq = matchMedia("(min-width: 901px)");
      mq.addEventListener(
        "change",
        () => {
          if (mq.matches && menuOpen) setMenu(false, { focus: false });
        },
        { signal },
      );
      cleanups.push(() => {
        if (menuOpen) setMenu(false, { focus: false });
      });
    }

    /* Video slots: load only on intent, never block content. */
    const loadVideo = (slot: HTMLElement): HTMLVideoElement | null => {
      const video = $<HTMLVideoElement>("video", slot);
      if (!video) return null;
      if (!video.dataset.loaded) {
        video.dataset.loaded = "1";
        $$<HTMLSourceElement>("source[data-src]", video).forEach((s) => {
          s.src = s.dataset.src!;
        });
        const ready = () => slot.classList.add("is-playing");
        video.addEventListener("playing", ready);
        video.addEventListener("loadeddata", ready);
        video.load();
      }
      return video;
    };
    const play = (slot: HTMLElement) => {
      loadVideo(slot)
        ?.play()
        .catch(() => {
          /* missing file: placeholder stays */
        });
    };
    const pause = (slot: HTMLElement) => {
      $<HTMLVideoElement>("video", slot)?.pause();
    };

    $$("[data-hover-video]").forEach((card) => {
      const slot = $("[data-video]", card);
      if (!slot || reduced) return;
      if (finePointer) {
        card.addEventListener("pointerenter", () => play(slot), { signal });
        card.addEventListener("pointerleave", () => pause(slot), { signal });
        card.addEventListener("focusin", () => play(slot), { signal });
        card.addEventListener("focusout", () => pause(slot), { signal });
      } else {
        slot.dataset.autoplay = "";
      }
    });

    const autoSlots = $$("[data-video][data-autoplay]");
    if (autoSlots.length && !reduced) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) =>
            e.isIntersecting ? play(e.target as HTMLElement) : pause(e.target as HTMLElement),
          );
        },
        { rootMargin: "200px 0px" },
      );
      autoSlots.forEach((s) => io.observe(s));
      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.hidden) autoSlots.forEach(pause);
        },
        { signal },
      );
      cleanups.push(() => io.disconnect());
    }

    const walk = $("[data-walkthrough]");
    if (walk) {
      const v = loadVideo(walk);
      $$<HTMLButtonElement>("[data-chapter]").forEach((btn) => {
        btn.addEventListener(
          "click",
          () => {
            $$("[data-chapter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
            if (v) {
              v.currentTime = Number(btn.dataset.chapter);
              v.play().catch(() => {});
            }
          },
          { signal },
        );
      });
    }

    const dialog = $<HTMLDialogElement>("[data-player]");
    if (dialog) {
      const v = $<HTMLVideoElement>("video", dialog)!;
      const slot = v.parentElement!;
      v.addEventListener("loadeddata", () => slot.classList.add("is-playing"), { signal });
      $$<HTMLButtonElement>("[data-open-player]").forEach((btn) => {
        btn.addEventListener(
          "click",
          () => {
            slot.classList.remove("is-playing");
            v.src = btn.dataset.openPlayer!;
            dialog.showModal();
            lenis?.stop();
            v.play().catch(() => {});
          },
          { signal },
        );
      });
      $("[data-close-player]", dialog)?.addEventListener("click", () => dialog.close(), { signal });
      dialog.addEventListener(
        "click",
        (e) => {
          if (e.target === dialog) dialog.close();
        },
        { signal },
      );
      dialog.addEventListener(
        "close",
        () => {
          v.pause();
          v.removeAttribute("src");
          v.load();
          lenis?.start();
        },
        { signal },
      );
    }

    /* Small UI behaviour that works with or without motion. */
    const clock = $("[data-clock]");
    if (clock) {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
      });
      const tick = () => {
        clock.textContent = `${fmt.format(new Date())} WAT`;
      };
      tick();
      const id = window.setInterval(tick, 30_000);
      cleanups.push(() => clearInterval(id));
    }

    $$<HTMLButtonElement>("[data-copy]").forEach((b) =>
      b.addEventListener(
        "click",
        async () => {
          try {
            await navigator.clipboard.writeText(b.dataset.copy!);
            const l = $("[data-copy-label]", b);
            if (l) {
              l.textContent = "(copied)";
              setTimeout(() => {
                l.textContent = "(click to copy)";
              }, 1800);
            }
          } catch {
            /* clipboard blocked: the address is visible anyway */
          }
        },
        { signal },
      ),
    );

    if (header) {
      let last = 0;
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY;
          const hide = y > 240 && y > last && !menuOpen && !header.contains(document.activeElement);
          header.classList.toggle("is-hidden", hide);
          last = y;
        },
        { passive: true, signal },
      );
    }

    /* Motion. Everything below is skipped under reduced motion. */
    let cancelled = false;
    const initMotion = async () => {
      root.classList.add("has-motion");
      await document.fonts.ready.catch(() => undefined);
      if (cancelled) return;
      const mm = gsap.matchMedia();
      cleanups.push(() => mm.revert());

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splits: SplitText[] = [];

        /* 1. Hero intro: lines rise, copy follows, showreel wipes up. */
        const intro = gsap.timeline({ defaults: { ease: EASE_OUT, duration: 1.2 } });
        intro.from(".site-header", { yPercent: -100, duration: 1 }, 0);
        if ($(".hero .line > span"))
          intro.to(".hero .line > span", { y: 0, rotate: 0, stagger: 0.1, duration: 1.3 }, 0.1);
        if ($(".hero [data-hero-fade]"))
          intro.to(".hero [data-hero-fade]", { opacity: 1, y: 0, stagger: 0.07 }, 0.4);
        if ($(".hero .reel")) {
          intro.to(
            ".hero .reel",
            {
              clipPath: "inset(0% 0 0 0 round 22px)",
              duration: 1.5,
              ease: EASE_IN_OUT,
              onComplete: () => {
                gsap.set(".hero .reel", { clipPath: "none" });
              },
            },
            0.45,
          );
        }
        if ($(".badge")) intro.from(".badge", { scale: 0.6, opacity: 0, duration: 1 }, 1.2);

        /* 2. Section headings: word-by-word mask reveal (accessible name kept). */
        $$("[data-split]").forEach((el) => {
          const s = SplitText.create(el, { type: "words", mask: "words", aria: "auto" });
          splits.push(s);
          gsap.from(s.words, {
            yPercent: 115,
            rotate: 4,
            duration: 1.1,
            ease: EASE_OUT,
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        /* 3. Mono eyebrow labels decode in (short text only). */
        $$("[data-scramble]").forEach((el) => {
          const text = el.textContent ?? "";
          el.setAttribute("aria-label", text.trim());
          gsap.to(el, {
            duration: Math.min(1.4, 0.5 + text.length * 0.025),
            scrambleText: { text, chars: "01<>/_#*", speed: 0.6, revealDelay: 0.15 },
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onComplete: () => el.removeAttribute("aria-label"),
          });
        });

        /* 4. Generic reveals, batched. */
        if ($("[data-reveal]")) {
          gsap.set("[data-reveal]", { opacity: 0, y: 36 });
          ScrollTrigger.batch("[data-reveal]", {
            start: "top 90%",
            once: true,
            onEnter: (els) =>
              gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: EASE_OUT, stagger: 0.08, overwrite: true }),
          });
        }

        /* 5. Media wipes up from the bottom while the inner media settles. */
        $$("[data-clip]").forEach((el) => {
          const inner = $(".media-inner", el) ?? el.firstElementChild;
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
          tl.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE_IN_OUT, clearProps: "clipPath" },
          );
          if (inner)
            tl.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: EASE_OUT, clearProps: "transform" }, 0);
        });

        /* 6. Statement: words brighten as you read down the page. */
        const statement = $("[data-statement]");
        if (statement) {
          const s = SplitText.create(statement, { type: "words", wordsClass: "word", aria: "auto" });
          splits.push(s);
          gsap.fromTo(
            s.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: statement, start: "top 85%", end: "bottom 45%", scrub: true },
            },
          );
        }

        /* 7. Stat count-up. */
        $$("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });

        /* 8. Showreel grows into place as it scrolls up. */
        const reel = $("[data-reel-scale]");
        if (reel) {
          gsap.fromTo(
            reel,
            { scale: 0.94 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: reel, start: "top bottom", end: "top 25%", scrub: true } },
          );
        }

        /* 9. Agent trace rows run in sequence, like a live log. */
        $$("[data-trace]").forEach((tb) => {
          gsap.from(tb.children, {
            opacity: 0,
            x: -14,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.11,
            scrollTrigger: { trigger: tb, start: "top 82%", once: true },
          });
        });

        /* 10. Marquee: constant drift that speeds up with scroll velocity. */
        const track = $("[data-marquee]");
        if (track) {
          const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
          let dir = 1;
          ScrollTrigger.create({
            trigger: track.parentElement!,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
            onUpdate: (self) => {
              dir = self.direction;
              const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
              gsap.to(loop, { timeScale: boost * dir, duration: 0.2, overwrite: true });
              gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out", overwrite: false });
            },
          });
          if (finePointer) {
            track.parentElement!.addEventListener(
              "pointerenter",
              () => gsap.to(loop, { timeScale: 0, duration: 0.6, overwrite: true }),
              { signal },
            );
            track.parentElement!.addEventListener(
              "pointerleave",
              () => gsap.to(loop, { timeScale: dir, duration: 0.6, overwrite: true }),
              { signal },
            );
          }
        }

        /* 11. Footer wordmark stretches from 75% to 125% width as you arrive. */
        const word = $("[data-footer-word]");
        if (word) {
          const axis = { w: 75 };
          gsap.to(axis, {
            w: 125,
            ease: "none",
            onUpdate: () => {
              word.style.fontStretch = `${axis.w}%`;
            },
            scrollTrigger: { trigger: word, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          });
        }

        /* 12. Reading progress. */
        gsap.to(".progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        /* 13. Pointer-only extras: magnetic buttons and a labelled cursor. */
        if (finePointer) {
          $$("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: EASE_OUT });
            const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: EASE_OUT });
            el.addEventListener(
              "pointermove",
              (e) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
              },
              { signal },
            );
            el.addEventListener(
              "pointerleave",
              () => {
                xTo(0);
                yTo(0);
              },
              { signal },
            );
          });

          const cursor = $(".cursor");
          if (cursor) {
            const label = $("span", cursor)!;
            const cx = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
            const cy = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });
            const leaveWin = () => cursor.classList.remove("is-visible");
            window.addEventListener(
              "pointermove",
              (e) => {
                cx(e.clientX);
                cy(e.clientY);
                cursor.classList.add("is-visible");
              },
              { signal },
            );
            document.addEventListener("pointerleave", leaveWin, { signal });
            window.addEventListener("blur", leaveWin, { signal });
            $$("[data-cursor]").forEach((t) => {
              t.addEventListener(
                "pointerenter",
                () => {
                  label.textContent = t.dataset.cursor ?? "";
                  cursor.classList.add("is-label");
                },
                { signal },
              );
              t.addEventListener("pointerleave", () => cursor.classList.remove("is-label"), { signal });
            });
            // Hide the dot over form fields and buttons so it never covers text.
            $$("input, textarea, select, button:not([data-cursor] *), .btn, .nav__links a, .menu a").forEach((t) => {
              t.addEventListener("pointerenter", () => cursor.classList.add("is-hidden"), { signal });
              t.addEventListener("pointerleave", () => cursor.classList.remove("is-hidden"), { signal });
            });
          }
        }

        return () => {
          splits.forEach((s) => s.revert());
        };
      });

      // Fonts and media can shift layout after load; re-measure once.
      if (document.readyState === "complete") ScrollTrigger.refresh();
      else window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true, signal });
    };

    if (reduced) root.classList.remove("js");
    else void initMotion();

    return () => {
      cancelled = true;
      cleanups.reverse().forEach((fn) => fn());
      root.classList.remove("has-motion");
    };
  }, []);

  return null;
}
