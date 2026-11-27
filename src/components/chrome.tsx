import { SITE, SOCIALS, type NavLink } from "@/data/site";
import type { ReactNode } from "react";
import { Motion } from "./motion";
import { Arrow, Roll } from "./roll";

export { Arrow, Roll };

function Brand({ studio }: { studio?: boolean }) {
  return (
    <a className="brand" href="/" aria-label={`${SITE.name}, home`}>
      <svg width="34" height="34" viewBox="0 0 100 100" aria-hidden="true">
        <rect width="100" height="100" rx="26" fill="#EEEBE4" />
        <path d="M24 33 L41 50 L24 67" fill="none" stroke="#0C0C0B" strokeWidth="10" strokeLinecap="square" />
        <path d="M72 24 V60 A12 12 0 0 1 48 60" fill="none" stroke="#0C0C0B" strokeWidth="10" strokeLinecap="square" />
        <rect className="cursor-block" x="66" y="74" width="12" height="6" fill="#D2F53C" />
      </svg>
      <span className="brand__name">{SITE.name}</span>
      {studio && (
        <span className="label" style={{ fontSize: 11 }}>
          Studio
        </span>
      )}
    </a>
  );
}

function SiteHeader({ nav, menu, ctaHref, studio }: { nav: NavLink[]; menu: NavLink[]; ctaHref: string; studio?: boolean }) {
  return (
    <>
      <header className="site-header" data-header>
        <nav className="wrap nav" aria-label="Primary">
          <Brand studio={studio} />
          <ul className="nav__links">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href}>
                  <Roll>{l.label}</Roll>
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__end">
            <a className="btn btn--volt" href={ctaHref} data-magnetic>
              <Roll>Start a project</Roll> <Arrow />
            </a>
            <button className="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn>
              <span data-menu-label>Menu</span>
              <i aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <div className="menu" id="menu" data-menu>
        <ul className="menu__links">
          {menu.map((l, i) => (
            <li key={l.href}>
              <a href={l.href}>
                {l.label} <span className="label">{String(i + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a className="btn btn--volt" href={ctaHref} style={{ alignSelf: "flex-start" }}>
            Start a project <Arrow />
          </a>
          <div className="menu__social">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
          <span className="label">{SITE.location} · Replies within one business day</span>
        </div>
      </div>
    </>
  );
}

function SiteFooter({ resume }: { resume?: boolean }) {
  const host = new URL(SITE.url).host;
  return (
    <footer className="wrap footer">
      <div className="footer__row">
        <div className="footer__links">
          {SOCIALS.map((s) => (
            <a key={s.label} className="u" href={s.href}>
              {s.label}
            </a>
          ))}
          {resume && (
            <a className="u" href={SITE.resume}>
              Résumé
            </a>
          )}
        </div>
        <span className="label">Built with way too much attention to easing curves.</span>
      </div>
      <div className="footer__word" aria-hidden="true" data-footer-word>
        {SITE.name}
        <span>.</span>
      </div>
      <div className="footer__base label">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span>Lagos · Ile-Ife · Remote</span>
        <span>{host}</span>
      </div>
    </footer>
  );
}

function PlayerDialog() {
  return (
    <dialog className="player" data-player aria-label="Video player">
      <div className="player__bar">
        <span className="label">Now playing</span>
        <button className="player__close" type="button" data-close-player>
          Close
        </button>
      </div>
      <div className="vid">
        <video controls playsInline />
        <div className="vid__ph">[ add the full video file to public/videos/ ]</div>
      </div>
    </dialog>
  );
}

type ShellProps = {
  variant: "home" | "case" | "page";
  nav: NavLink[];
  menu: NavLink[];
  children: ReactNode;
};

/** Page frame: header, full-screen menu, main, footer, player and motion. */
export function Shell({ variant, nav, menu, children }: ShellProps) {
  const home = variant === "home";
  return (
    <>
      <SiteHeader nav={nav} menu={menu} ctaHref={home ? "#contact" : "/#contact"} studio={home} />
      <main id="main">{children}</main>
      <SiteFooter resume={home} />
      {home && <PlayerDialog />}
      <Motion />
    </>
  );
}
