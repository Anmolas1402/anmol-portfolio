"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { education, experience } from "@/lib/content";

/**
 * A horizontal timeline rather than a stacked list: roles run left to right
 * along one rule, and each card's date sits above or below it alternately, so
 * the eye zigzags along the line instead of scanning a column.
 *
 * The track is a native overflow-x container with scroll snapping — it works
 * with a trackpad, a touch drag, arrow keys and Tab focus, none of which a
 * scroll-hijacked pinned section gives you for free.
 */
export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () =>
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="experience"
      className="scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Work experience"
          title="The journey so far"
          note="Two roles, both about making a lot of moving parts behave."
        />
      </div>

      <div className="relative mt-16">
        {/* The rule the cards hang from. */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-line" />

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory items-center gap-6 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-[max(1.25rem,calc((100vw-72rem)/2))] [&::-webkit-scrollbar]:hidden"
        >
          {experience.map((role, i) => {
            const dateOnTop = i % 2 === 0;
            return (
              <Reveal key={role.org + role.title}>
                <article
                  className={`flex w-[min(84vw,400px)] shrink-0 snap-start flex-col ${
                    dateOnTop ? "" : "flex-col-reverse"
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      dateOnTop ? "pb-5" : "pt-5"
                    }`}
                  >
                    <span className="mono text-[11px] tracking-[0.14em] text-accent">
                      {role.period.toUpperCase()}
                    </span>
                    <span className="h-px flex-1 bg-line" />
                    <span className="size-2 shrink-0 rounded-full bg-accent" />
                  </div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl border border-line bg-ink-2 p-6 transition-colors hover:border-white/16"
                  >
                    <h3 className="text-xl font-semibold text-paper">
                      {role.org}
                    </h3>
                    <p className="mono mt-1.5 text-[11px] tracking-[0.12em] text-accent">
                      {role.title.toUpperCase()}
                    </p>
                    {role.place && (
                      <p className="mono mt-1 text-[10px] tracking-[0.1em] text-muted">
                        {role.place.toUpperCase()}
                      </p>
                    )}

                    <ul className="mt-5 space-y-3">
                      {role.points.map((pt, k) => (
                        <li
                          key={k}
                          className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted"
                        >
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent/70" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {role.tags.map((t) => (
                        <span
                          key={t}
                          className="mono rounded-full border border-line px-2.5 py-1 text-[10px] tracking-[0.08em] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </article>
              </Reveal>
            );
          })}

          {/* Education rides the same rail rather than starting a new section. */}
          <Reveal>
            <article className="flex w-[min(84vw,400px)] shrink-0 snap-start flex-col">
              <div className="flex items-center gap-3 pb-5">
                <span className="mono text-[11px] tracking-[0.14em] text-muted">
                  EDUCATION
                </span>
                <span className="h-px flex-1 bg-line" />
                <span className="size-2 shrink-0 rounded-full bg-white/25" />
              </div>
              <div className="rounded-3xl border border-line bg-ink-2/60 p-6">
                {education.map((e, i) => (
                  <div
                    key={e.org}
                    className={i ? "mt-5 border-t border-line pt-5" : ""}
                  >
                    <div className="mono text-[10px] tracking-[0.12em] text-muted">
                      {e.period.toUpperCase()}
                    </div>
                    <div className="mt-2 font-semibold text-paper">{e.org}</div>
                    <div className="mt-1 text-sm text-muted">{e.title}</div>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        </div>

        {/* Only shown while there is somewhere left to scroll. */}
        <div
          className={`mono mt-2 px-5 text-right text-[10px] tracking-[0.18em] text-muted/60 transition-opacity duration-300 sm:px-[max(1.25rem,calc((100vw-72rem)/2))] ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
        >
          SCROLL →
        </div>
      </div>
    </section>
  );
}
