"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { disciplines, disciplineStatement } from "@/lib/content";

/**
 * Two halves that do different jobs. On the left the disciplines sit in a
 * loose pile — tilted, overlapping, obviously dropped rather than arranged —
 * because a tidy grid of six skill boxes reads as a form, not a person. On the
 * right one sentence brightens word by word as the section passes, which is
 * what makes the reader slow down enough to actually read it.
 *
 * Measured from the reference: 18px radius, no shadow, caption ~9px against a
 * 21px label, and rotations between -15° and +22°.
 */

/**
 * Where each card sits in the pile, as a share of the box, plus its tilt.
 *
 * The rule the positions follow: cards may overlap at the corners, never over
 * each other's text. So consecutive cards alternate left- and right-heavy and
 * step down by less than a card height — the pile stays tight, but every label
 * stays readable. The reference gets away with harder tilts because its labels
 * are one word; ours are longer, so the swing is kept under ~12°.
 */
const SLOTS = [
  { left: "16%", top: "0%", rotate: -4 },
  { left: "52%", top: "8%", rotate: -2 },
  { left: "0%", top: "18%", rotate: -7 },
  { left: "38%", top: "27%", rotate: 6 },
  { left: "10%", top: "39%", rotate: 12 },
  { left: "45%", top: "51%", rotate: -9 },
] as const;

// Flattened once so a word's reveal position is its position in the whole
// statement, not in its own line — the brightening runs straight through the
// break instead of restarting on the second line.
const LINES = disciplineStatement.map((l) => l.split(" "));
const TOTAL_WORDS = LINES.reduce((n, l) => n + l.length, 0);
const LINE_OFFSETS = LINES.reduce<number[]>(
  (acc, l, i) => [...acc, (acc[i] ?? 0) + l.length],
  [0],
);

/**
 * One word of the statement. Each takes a short slice of the section's scroll
 * range, offset by its position, so the brightening travels along the line.
 * The slices overlap — a hard hand-off word to word flickers.
 */
function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = (index / total) * 0.82;
  const opacity = useTransform(progress, [start, start + 0.18], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="text-paper">
      {word}{" "}
    </motion.span>
  );
}

export function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Finishes well before the section leaves, so the last word is readable for
  // a moment rather than lighting up on the way out.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "center 0.35"],
  });

  return (
    <section
      id="what-i-do"
      ref={sectionRef}
      className="scroll-mt-24 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">What I do</p>

        <div className="mt-10 grid items-center gap-14 lg:mt-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          {/* The pile. Absolute only from lg up; below that the cards flow and
              wrap, keeping their tilt but not their overlap. */}
          <div className="relative mx-auto flex w-full max-w-[520px] flex-wrap justify-center gap-3 lg:block lg:h-[300px] lg:gap-0">
            {disciplines.map((d, i) => {
              const slot = SLOTS[i % SLOTS.length];
              return (
                <motion.div
                  key={d.label}
                  initial={reduced ? false : { opacity: 0, y: -18, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: slot.rotate }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                  style={{
                    left: slot.left,
                    top: slot.top,
                    rotate: slot.rotate,
                    zIndex: i + 1,
                    backgroundColor: d.tint,
                  }}
                  className="rounded-[18px] px-[22px] py-[15px] lg:absolute"
                >
                  <span className="block text-[9.5px] leading-none text-neutral-500">
                    {d.caption}
                  </span>
                  <span className="mt-1.5 block text-[21px] leading-tight font-medium whitespace-nowrap text-[#0a0a0b]">
                    {d.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="display-soft space-y-5 text-[clamp(1.5rem,3vw,2.45rem)] leading-[1.3] text-muted">
            {LINES.map((words, li) => (
              <p key={li}>
                {reduced
                  ? disciplineStatement[li]
                  : words.map((w, i) => (
                      <Word
                        key={`${li}-${w}-${i}`}
                        word={w}
                        index={LINE_OFFSETS[li] + i}
                        total={TOTAL_WORDS}
                        progress={scrollYProgress}
                      />
                    ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
