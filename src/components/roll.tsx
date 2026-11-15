import type { ReactNode } from "react";

export function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      →
    </span>
  );
}

/** Label that rolls up on hover; used inside buttons and nav links. */
export function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
    </span>
  );
}
