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
        <Reveal>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory items-center gap-6 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-[max(1.25rem,calc((100vw-72rem)/2))] [&::-webkit-scrollbar]:hidden"
          >
            {[...experience, ...education].map((role, i) => {
              const dateOnTop = i % 2 === 0;
              return (
                <article
                  key={role.org + role.title}
                  // The alternating date block alone only offsets the cards by
                  // ~46px; the reference staggers them far harder, so push each
                  // one off centre as well.
                  className={`flex w-[min(84vw,400px)] shrink-0 snap-start flex-col ${
                    dateOnTop
                      ? "sm:-translate-y-14"
                      : "flex-col-reverse sm:translate-y-14"
                  }`}
                >
                  {/* Date pill, stalk, dot — the connector the reference uses
                      in place of a continuous rule. */}
                  <div
                    className={`flex flex-col items-center ${
                      dateOnTop ? "pb-1" : "flex-col-reverse pt-1"
                    }`}
                  >
                    <span className="rounded-full border border-line bg-ink-2 px-4 py-2 text-[13px] text-paper/75">
                      {role.period}
                    </span>
                    <span className="size-2 rounded-full bg-accent" />
                    <span className="h-8 w-px bg-line" />
                  </div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl border border-line bg-ink-2 p-7 transition-colors hover:border-white/16"
                  >
                    <div className="flex items-center gap-4">
                      <Logo
                        src={"logo" in role ? role.logo : undefined}
                        bg={"logoBg" in role ? role.logoBg : undefined}
                        name={role.org}
                      />
                      <div className="min-w-0">
                        <h3 className="truncate text-2xl font-semibold text-paper">
                          {role.org}
                        </h3>
                        <p className="mt-0.5 text-[15px] text-muted">
                          {role.title}
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 text-[15px] leading-relaxed text-muted">
                      {role.summary}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {("tags" in role ? role.tags : []).map((t) => (
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
              );
            })}
          </div>
        </Reveal>

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
