"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Logo } from "./Logo";
import { education, experience } from "@/lib/content";

/**
 * A horizontal timeline rather than a stacked list: roles run left to right and
 * each card's date sits above or below it alternately, joined to the card by a
 * stalk and a dot, so the eye zigzags along the row instead of scanning a column.
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
                  {/* Date pill, stalk, dot — the connector the reference uses
                      in place of a continuous rule. */}
                  <div
                    className={`flex flex-col items-center ${
                      dateOnTop ? "pb-1" : "flex-col-reverse pt-1"
                    }`}
                  >
                    <span className="mono rounded-full border border-line bg-ink-2 px-4 py-2 text-[11px] tracking-[0.12em] text-paper/80">
                      {role.period.toUpperCase()}
                    </span>
                    <span className="size-2 rounded-full bg-accent" />
                    <span className="h-8 w-px bg-line" />
                  </div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="ui-sans rounded-3xl border border-line bg-ink-2 p-7 transition-colors hover:border-white/16"
                  >
                    <div className="flex items-center gap-4">
                      <Logo src={role.logo} bg={role.logoBg} name={role.org} />
                      <div className="min-w-0">
                        <h3 className="truncate text-2xl font-semibold text-paper">
                          {role.org}
                        </h3>
                        <p className="mt-0.5 text-[15px] text-muted">
                          {role.title}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {role.points.map((pt, k) => (
                        <li
                          key={k}
                          className="flex gap-2.5 text-[14.5px] leading-relaxed text-muted"
                        >
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent/70" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {role.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-[12.5px] text-muted"
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
              <div className="flex flex-col items-center pb-1">
                <span className="mono rounded-full border border-line bg-ink-2 px-4 py-2 text-[11px] tracking-[0.12em] text-muted">
                  EDUCATION
                </span>
                <span className="size-2 rounded-full bg-white/30" />
                <span className="h-8 w-px bg-line" />
              </div>
              <div className="ui-sans rounded-3xl border border-line bg-ink-2/60 p-7">
                <div className="flex items-center gap-4">
                  <Logo
                    src="/logos/thapar.png"
                    bg="#ffffff"
                    name="Thapar Institute"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-paper">Education</h3>
                    <p className="mt-0.5 text-[15px] text-muted">
                      Thapar Institute
                    </p>
                  </div>
                </div>
                {education.map((e) => (
                  <div key={e.org} className="mt-5 border-t border-line pt-5">
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
