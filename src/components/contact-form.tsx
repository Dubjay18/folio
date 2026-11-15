"use client";

import { NEEDS, SITE, TIMELINES } from "@/data/site";
import { useState, type FormEvent } from "react";
import { Arrow, Roll } from "./roll";

// Optional: point this at Formspree (or any endpoint that accepts JSON POSTs).
// Without it, the form opens a pre-filled email instead.
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Status = { kind: "idle" | "sending" | "ok" | "error"; msg: string };

export function ContactForm() {
  const [needs, setNeeds] = useState<string[]>([NEEDS[0]]);
  const [status, setStatus] = useState<Status>({ kind: "idle", msg: "" });

  const toggle = (n: string) => setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const fd = new FormData(form);
    const field = (k: string) => String(fd.get(k) ?? "");
    const payload = {
      name: field("name"),
      email: field("email"),
      message: field("message"),
      timeline: field("timeline"),
      needs: needs.join(", "),
    };

    if (!ENDPOINT) {
      const body = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `I need: ${payload.needs || "-"}`,
        `Timeline: ${payload.timeline}`,
        "",
        payload.message,
      ].join("\n");
      const subject = `Project enquiry from ${payload.name}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: "ok", msg: "Your email app should open with the enquiry filled in." });
      return;
    }

    setStatus({ kind: "sending", msg: "Sending…" });
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setNeeds([NEEDS[0]]);
      setStatus({ kind: "ok", msg: "Thanks, it's in. You'll hear back within one business day." });
    } catch {
      setStatus({ kind: "error", msg: `That didn't send. Email ${SITE.email} instead.` });
    }
  }

  return (
    <form className="form" aria-label="Project enquiry" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Ada Obi" required />
      </div>
      <div className="field">
        <label htmlFor="f-mail">Email</label>
        <input id="f-mail" name="email" type="email" autoComplete="email" placeholder="ada@company.com" required />
      </div>
      <fieldset className="field field--full" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ marginBottom: 6 }}>I need</legend>
        <div className="choices">
          {NEEDS.map((n) => (
            <button key={n} type="button" className="choice" aria-pressed={needs.includes(n)} onClick={() => toggle(n)}>
              {n}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="field field--full">
        <label htmlFor="f-what">What are you building?</label>
        <textarea
          id="f-what"
          name="message"
          rows={4}
          placeholder="A few lines is plenty. Skip anything under NDA."
          required
        />
      </div>
      <div className="field field--full">
        <label htmlFor="f-when">Timeline</label>
        <select id="f-when" name="timeline">
          {TIMELINES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn--volt" disabled={status.kind === "sending"}>
        <Roll>Send enquiry</Roll> <Arrow />
      </button>
      <p className="form__status" role="status" aria-live="polite">
        {status.msg}
      </p>
    </form>
  );
}
