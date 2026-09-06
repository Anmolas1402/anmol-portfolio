"use client";

import { Reveal, RevealGroup } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Marquee } from "./Marquee";
import { metrics, person, skills } from "@/lib/content";

const traits = [
  "OPS BRAIN",
  "DATA FIRST",
  "SHIPS IT",
  "WRITES THE SOP",
  "ASKS WHY",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="About me"
          title="Ops is a product problem"
          note="Most ops work is invisible until it breaks. I try to make it visible before that."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted sm:text-base">
              <p>{person.intro}</p>
              <p>
                The pattern in everything here is the same: I don&rsquo;t trust a
                number until I&rsquo;ve tried to break it. The College Predictor
                got stress-tested against boundary ranks and category-specific
                seats before release. The buildability research shipped with its
                own error bar. The NCR map draws a guessed pin differently from a
                verified one, because pretending otherwise is how you lose people.
              </p>
              <p>
                Alongside that: I managed a 30+ person team across three
                subsidiaries, hired and onboarded 100+ interns, and led a
                40-person exec team as President of my college&rsquo;s Alumni
                Relations Cell. Currently finishing a B.Tech in Electronics and
                Computer Engineering at Thapar.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="space-y-8">
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
        </div>
      </div>

      {/* Trait marquee — the one purely-for-fun element on the page. */}
      <div className="mt-20 border-y border-line py-5">
        <Marquee duration={38} reverse>
          {traits.map((t) => (
            <span key={t} className="flex items-center">
              <span className="display px-8 text-2xl text-white/12 sm:text-4xl">
                {t}
              </span>
              <span className="text-accent/60">◆</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* The numbers, laid out like a readout. */}
      <div className="mx-auto mt-20 max-w-6xl px-5">
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
          {metrics.map((m) => (
            <Reveal key={m.value + m.label}>
              <div className="h-full bg-ink p-6 transition-colors hover:bg-ink-2">
                <div className="display text-3xl text-paper sm:text-4xl">
                  {m.value}
                </div>
                <div className="mono mt-3 text-[10px] leading-relaxed tracking-[0.1em] text-muted">
                  {m.label.toUpperCase()}
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
