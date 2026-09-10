"use client";

import { Reveal, RevealGroup } from "./Reveal";
import { Polaroid } from "./Polaroid";
import { coreStack, metrics, person, skills } from "@/lib/content";

/** Two-tone pills: a light lead word, the trait itself in bold. */
const TRAITS = [
  { lead: "Problem", bold: "solver", tint: "#c9bcff" },
  { lead: "Data", bold: "obsessed", tint: "#c8e79a" },
  { lead: "Systems", bold: "thinker", tint: "#a8d5ff" },
  { lead: "Ships", bold: "things", tint: "#f7b3ac" },
] as const;

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">About me</p>
              <h2 className="display-soft mt-4 max-w-[19ch] text-[clamp(1.8rem,3.1vw,2.8rem)] text-paper">
                Product ops with{" "}
                <span className="accent-serif">two years</span> at the
                intersection of data, product and people.
              </h2>
            </Reveal>

            <Reveal>
              <div className="mt-8 flex flex-wrap gap-3">
                {TRAITS.map((t, i) => (
                  // Alternating tilt, so hovering along the row rocks them one
                  // way then the other instead of nudging all four the same way.
                  <span
                    key={t.lead}
                    className={`cursor-default rounded-full px-4 py-2 text-[13px] text-ink shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(0,0,0,0.12),0_8px_20px_-8px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      i % 2 === 0
                        ? "hover:-rotate-3 motion-reduce:hover:rotate-0"
                        : "hover:rotate-3 motion-reduce:hover:rotate-0"
                    } hover:-translate-y-0.5 hover:scale-[1.03] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100`}
                    style={{ background: t.tint }}
                  >
                    {t.lead} <span className="font-bold">{t.bold}</span>
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-9 space-y-5 text-[15px] leading-relaxed text-muted sm:text-base">
                <p>{person.intro}</p>
                <p>
                  The pattern in everything here is the same: I don&rsquo;t
                  trust a number until I&rsquo;ve tried to break it. The College
                  Predictor got stress-tested against boundary ranks and
                  category-specific seats before release. The buildability
                  research shipped with its own error bar. The NCR map draws a
                  guessed pin differently from a verified one, because
                  pretending otherwise is how you lose people.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mx-auto w-full max-w-[380px] lg:mt-6">
            <Polaroid src={person.portrait} name={person.name} />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <RevealGroup className="space-y-6">
            {Object.entries(skills).map(([group, items]) => (
              <Reveal key={group}>
                <div>
                  <p className="eyebrow">{group}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-xs text-muted transition hover:border-white/20 hover:text-paper"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          {/* Fills the column that used to sit empty. Sticky on wide screens so
              it stays level with the groups rather than stranding itself at the
              top of a taller neighbour. */}
          <Reveal>
            <div className="rounded-3xl border border-line bg-ink-2 p-6 lg:sticky lg:top-28">
              <p className="eyebrow">Core stack</p>
              <ul className="mt-5">
                {coreStack.map((c, i) => (
                  <li
                    key={c.area}
                    className="flex gap-4 border-t border-line py-4 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <span className="pt-0.5 text-[13px] font-medium tabular-nums text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-paper">
                        {c.area}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                        {c.output}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* The numbers, laid out like a readout. */}
      <div className="mx-auto mt-14 max-w-6xl px-5">
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
          {metrics.map((m) => (
            <Reveal key={m.value + m.label}>
              <div className="flex h-full flex-col bg-ink p-6 transition-colors hover:bg-ink-2">
                <div className="display text-3xl text-paper sm:text-4xl">
                  {m.value}
                </div>
                <div className="mt-3 text-[13px] leading-snug text-muted">
                  {m.label}
                </div>
                {/* A bar is drawn only where a real denominator exists. Most of
                    these numbers have no ceiling to plot against, and inventing
                    one to make every tile look alike would be a lie. */}
                {"segments" in m && (
                  <div
                    className="mt-4 flex items-center gap-[3px]"
                    role="img"
                    aria-label={`Grew from ${m.segments.from} to ${m.segments.to}`}
                  >
                    {Array.from({ length: m.segments.to }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < m.segments.from ? "bg-white/25" : "bg-accent"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {"ratio" in m && typeof m.ratio === "number" && (
                  <div
                    className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/8"
                    role="img"
                    aria-label={`${Math.round(m.ratio * 100)} percent`}
                  >
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${m.ratio * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
