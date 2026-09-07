"use client";

import { motion } from "motion/react";
import { PinOrb } from "./PinOrb";
import { Avatar } from "./Avatar";
import { person } from "@/lib/content";
import pins from "@/lib/ncr-pins.json";

const ease = [0.22, 1, 0.36, 1] as const;

const line = {
  hidden: { opacity: 0, y: "38%" },
  shown: (i: number) => ({
    opacity: 1,
    y: "0%",
    transition: { duration: 0.9, ease, delay: 0.15 + i * 0.09 },
  }),
};

/**
 * The hero claim. The orb replaces one letter, so the split lives here: swap to
 * { before: "AT V", after: "LUME" } and it becomes a real O instead of an A.
 */
const HEADLINE = {
  lines: [
    { text: "I MAKE THINGS", accent: false },
    { text: "RELIABLE", accent: true },
  ],
  orbLine: { before: "AT SC", after: "LE" },
} as const;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      <div className="grid-ground pointer-events-none absolute inset-0 -z-10" />


      <div className="mx-auto max-w-6xl px-5">
        {/* Hey, I'm Anmol */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-6 flex items-center justify-center gap-3 sm:mb-8"
        >
          <span className="text-lg text-muted sm:text-2xl">Hey, I&rsquo;m</span>
          <Avatar className="size-10 text-xs sm:size-12 sm:text-sm" />
          <span className="text-lg text-paper sm:text-2xl">Anmol</span>
        </motion.div>

        {/* The headline. The orb is a live map of 1,760 companies standing in
            for a letter, so HEADLINE controls exactly which one it replaces. */}
        <h1 className="display text-center text-[clamp(2.6rem,8.8vw,8.5rem)] text-paper">
          {HEADLINE.lines.map((l, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                custom={i}
                variants={line}
                initial="hidden"
                animate="shown"
                className={l.accent ? "block text-accent" : "block"}
              >
                {l.text}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span
              custom={HEADLINE.lines.length}
              variants={line}
              initial="hidden"
              animate="shown"
              className="flex items-center justify-center gap-[0.02em]"
            >
              <span>{HEADLINE.orbLine.before}</span>
              <PinOrb className="mx-[0.03em] w-[0.78em] shrink-0 translate-y-[0.03em]" />
              <span>{HEADLINE.orbLine.after}</span>
            </motion.span>
          </span>
        </h1>

        {/* Caption for the orb — otherwise it's just a pretty circle. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mono mt-7 text-center text-[11px] tracking-[0.16em] text-muted"
        >
          <span className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-signal align-middle" />
          THAT ORB IS LIVE DATA — {pins.total.toLocaleString()} NCR STARTUPS,{" "}
          {pins.verified.toLocaleString()} ADDRESS-VERIFIED
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-muted sm:text-lg"
        >
          Pipelines for{" "}
          <span className="text-paper">500,000 students</span>. A test series
          scaled from{" "}
          <span className="text-paper">one exam to fourteen</span>. A{" "}
          <span className="text-paper">30-person team</span> and{" "}
          <span className="text-paper">100+ interns</span> onboarded. Two years
          of product ops at MathonGo, and the same problem every time — make the
          output trustworthy when the volume goes up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.85 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#work"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            See the work
          </a>
          <a
            href={person.resume}
            className="rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-white/6"
          >
            Download resume
          </a>
        </motion.div>
      </div>

    </section>
  );
}
