"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Marquee } from "./Marquee";
import { SectionHeading } from "./SectionHeading";

/**
 * The reference site runs a strip of product mockups here, because its author
 * is a designer and the surface *is* the work. Ops work has no mockups, so this
 * strip runs evidence instead: screenshots of things that are actually live,
 * and — for the MathonGo work that cannot be screenshotted — the artefacts the
 * job really produces. A QA matrix and an SOP are not decoration; they are what
 * a product ops person hands over.
 *
 * Every caption names the real role. Nothing here claims design credit.
 */

type Card = {
  /** Shown under the frame. */
  label: string;
  /** Small mono line: what the role actually was. */
  role: string;
  live?: boolean;
} & (
  | { kind: "shot"; src: string; alt: string; href?: string }
  | { kind: "artifact"; body: ReactNode }
);

const EdgeCases = (
  <div className="flex h-full flex-col p-5">
    <div className="mb-3 text-[12px] text-muted">
      College Predictor — pre-release QA
    </div>
    <table className="mono w-full text-left text-[10px]">
      <thead className="text-muted">
        <tr className="[&>th]:pb-2 [&>th]:font-normal">
          <th>Rank</th>
          <th>Category</th>
          <th>Seat</th>
          <th className="text-right">Result</th>
        </tr>
      </thead>
      <tbody className="text-paper/80">
        {[
          ["6821", "OBC-NCL", "Open", "pass"],
          ["6822", "OBC-NCL", "Open", "pass"],
          ["12440", "EWS", "Female", "pass"],
          ["12441", "EWS", "Female", "fixed"],
          ["1", "GEN", "Open", "pass"],
          ["—", "SC", "PwD", "fixed"],
        ].map(([r, c, s, res]) => (
          <tr key={r + c + s} className="border-t border-line/60 [&>td]:py-1.5">
            <td>{r}</td>
            <td>{c}</td>
            <td>{s}</td>
            <td
              className={`text-right ${
                res === "pass" ? "text-signal" : "text-accent"
              }`}
            >
              {res === "pass" ? "✓ pass" : "△ fixed"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mono mt-auto pt-3 text-[10px] text-muted">
      Boundary ranks and category-specific seats, run with Product and
      Engineering before every release.
    </div>
  </div>
);

const Sop = (
  <div className="flex h-full flex-col p-5">
    <div className="mb-3 text-[12px] text-muted">
      SOP — intern intake
    </div>
    <ol className="space-y-2.5 text-[11px] text-paper/85">
      {[
        ["01", "Brief assigned, owner named the same day"],
        ["02", "Shadow an existing pipeline end to end"],
        ["03", "First task ships behind a QA gate"],
        ["04", "Sign-off, then own a surface outright"],
      ].map(([n, t]) => (
        <li key={n} className="flex gap-3">
          <span className="mono text-accent">{n}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
    <div className="mono mt-auto pt-3 text-[10px] text-muted">
      Written so a new joiner is useful in days, not weeks. 100+ interns
      onboarded across two years.
    </div>
  </div>
);

const Pipeline = (
  <div className="flex h-full flex-col justify-center gap-3 p-5">
    <div className="mb-1 text-[12px] text-muted">
      ncrhiring.in — data pipeline
    </div>
    {[
      ["scrape", "live job postings", "1"],
      ["geocode", "address → lat/lng", "2"],
      ["verify", "checked on Google Maps", "3"],
      ["tier", "startup vs other", "4"],
      ["publish", "static build, no database", "5"],
    ].map(([step, what, n], i, arr) => (
      <div key={step} className="flex items-center gap-3">
        <span className="mono grid size-6 shrink-0 place-items-center rounded-full border border-accent/40 text-[9px] text-accent">
          {n}
        </span>
        <span className="mono text-[11px] text-paper">{step}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="mono text-[10px] text-muted">{what}</span>
        {i < arr.length - 1 && null}
      </div>
    ))}
  </div>
);

const CARDS: Card[] = [
  {
    kind: "shot",
    src: "/showcase/ncr-map.jpg",
    alt: "The ncrhiring.in map, showing clustered startup pins across Delhi NCR",
    label: "ncrhiring.in — the map",
    role: "Built solo · data, product and code",
    href: "https://ncrhiring.in",
    live: true,
  },
  {
    kind: "artifact",
    body: EdgeCases,
    label: "The QA matrix behind 99.4%",
    role: "MathonGo · I ran this before every release",
  },
  {
    kind: "shot",
    src: "/showcase/ncr-jobs.jpg",
    alt: "The ncrhiring.in jobs board listing thousands of NCR roles",
    label: "Every NCR role, one page",
    role: "Built solo · scraped and rebuilt daily",
    href: "https://ncrhiring.in",
    live: true,
  },
  {
    kind: "shot",
    src: "/showcase/buildability.jpg",
    alt: "The App Buildability Research report, showing auth-model findings",
    label: "100 apps, assessed",
    role: "Research design · 92.5% verified accuracy",
    href: "https://anmolas1402.github.io/composio-app-buildability/",
  },
  {
    kind: "artifact",
    body: Sop,
    label: "The onboarding SOP",
    role: "MathonGo · 100+ interns hired and onboarded",
  },
  {
    kind: "shot",
    src: "/showcase/intro-stamp.png",
    alt: "A frame from a 15-second title film reading ANMOL, stamped PROOF OF WORK",
    label: "A 15-second title film",
    role: "Written in code · Remotion, no editor",
  },
  {
    kind: "artifact",
    body: Pipeline,
    label: "How the map gets built",
    role: "Reproducible · no hand-typed spreadsheet",
  },
  {
    kind: "shot",
    src: "/showcase/ncr-company.png",
    alt: "A company detail page on ncrhiring.in showing a verified address",
    label: "Verified, or labelled a guess",
    role: "A guessed pin is never shown as a verified one",
    href: "https://ncrhiring.in",
  },
];

function Frame({ card }: { card: Card }) {
  const inner =
    card.kind === "shot" ? (
      <Image
        src={card.src}
        alt={card.alt}
        fill
        sizes="(max-width: 640px) 82vw, 420px"
        className="object-cover object-top"
      />
    ) : (
      card.body
    );

  const body = (
    <>
      {/* The device frame. Screenshots crop from the top so the header of each
          real page stays readable at this size. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/12 bg-ink">
        {inner}
        {card.live && (
          <span className="mono absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-black/70 px-2 py-1 text-[9px] tracking-[0.14em] text-signal backdrop-blur-sm">
            <span className="size-1 rounded-full bg-signal" />
            LIVE
          </span>
        )}
      </div>
      <div className="mt-4 px-1">
        <div className="text-[13px] font-semibold text-paper">{card.label}</div>
        <div className="mt-1 text-[12.5px] leading-snug text-muted">
          {card.role}
        </div>
      </div>
    </>
  );

  const shell =
    "group w-[min(82vw,420px)] shrink-0 rounded-2xl border border-line bg-ink-2 p-2.5 transition-transform duration-500 [transform:rotateY(-9deg)] hover:[transform:rotateY(0deg)_translateY(-6px)]";

  return card.kind === "shot" && card.href ? (
    <a href={card.href} target="_blank" rel="noreferrer" className={shell}>
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  );
}

export function ShowcaseStrip() {
  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <div className="mx-auto mb-12 max-w-6xl px-5">
        <SectionHeading
          eyebrow="Proof of work"
          title="What the job looks like"
          note="Screenshots where the thing is live. Where it isn't, the artefact the work actually produced."
        />
      </div>

      {/* Perspective lives on the track so every card shares one vanishing
          point, which is what stops the tilt reading as a random skew. */}
      <div style={{ perspective: "1400px" }}>
        <Marquee duration={70}>
          {CARDS.map((c) => (
            <div key={c.label} className="px-3">
              <Frame card={c} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
