"use client";

import { Reveal, RevealGroup } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { education, experience } from "@/lib/content";

export function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow="Experience & education"
        title="The journey so far"
      />

      <RevealGroup className="mt-14 space-y-4">
        {experience.map((role) => (
          <Reveal key={role.org + role.title}>
            <div className="grid gap-6 rounded-3xl border border-line bg-ink-2 p-6 transition-colors hover:border-white/16 sm:p-8 lg:grid-cols-[220px_1fr] lg:gap-12">
              <div>
                <div className="mono text-[11px] tracking-[0.14em] text-accent">
                  {role.period.toUpperCase()}
                </div>
                <div className="mt-3 text-lg font-semibold text-paper">
                  {role.org}
                </div>
                {role.place && (
                  <div className="mono mt-1 text-[11px] tracking-[0.1em] text-muted">
                    {role.place.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-paper sm:text-2xl">
                  {role.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {role.points.map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[14px] leading-relaxed text-muted"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.tags.map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-line px-3 py-1.5 text-[10px] tracking-[0.1em] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}

        {education.map((e) => (
          <Reveal key={e.org}>
            <div className="grid gap-4 rounded-3xl border border-line px-6 py-5 sm:grid-cols-[220px_1fr] sm:gap-12 sm:px-8">
              <div className="mono text-[11px] tracking-[0.14em] text-muted">
                {e.period.toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-paper">{e.org}</div>
                <div className="mt-1 text-sm text-muted">{e.title}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
