"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Logo } from "./Logo";
import { education, experience } from "@/lib/content";

/**
 * A horizontal timeline rather than a stacked list: roles run left to right and
 * each card's date sits above or below it alternately, joined to the card by a
 * stalk and a dot, so the eye zigzags along the row instead of scanning a column.
 *
 * On a wide screen the section pins and the track slides sideways as the page
 * scrolls down, which is what the reference does. Below that, and whenever
 * reduced motion is asked for, it falls back to a plain horizontal scroller —
 * pinning is where touch devices and keyboard users get stranded, and a native
 * overflow container keeps drag, arrow keys and Tab focus working for free.
 */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [overflow, setOverflow] = useState(0);
  const [pinned, setPinned] = useState(false);

  // How far the track has to travel, and whether pinning is appropriate here.
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const canPin = window.innerWidth >= 900 && !reduced;
      setPinned(canPin);
      setOverflow(canPin ? Math.max(0, el.scrollWidth - window.innerWidth + 80) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  // Progress through the section's extra height drives the sideways travel.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="scroll-mt-24"
      // The extra height is the runway the pinned track slides across.
      style={pinned ? { height: `calc(100svh + ${overflow}px)` } : undefined}
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden"
            : "overflow-hidden py-16 sm:py-20"
        }
      >
        <div className="mx-auto w-full max-w-6xl px-5">
          <SectionHeading
            eyebrow="Work experience"
            title="The journey so far"
            note="Two roles, both about making a lot of moving parts behave."
          />
        </div>

        <div className="relative mt-14">
          <Reveal>
            <motion.div
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className={`flex items-center gap-6 px-5 py-16 sm:px-[max(1.25rem,calc((100vw-72rem)/2))] ${
                pinned
                  ? "w-max"
                  : "snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              }`}
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
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
