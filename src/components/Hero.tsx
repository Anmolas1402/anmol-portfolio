"use client";

import { motion } from "motion/react";
import { PinOrb } from "./PinOrb";
import { Avatar } from "./Avatar";
import { Marquee } from "./Marquee";
import { marqueeWords, person } from "@/lib/content";
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

/** Grace's floating pills, except each one is a number Anmol can defend. */
const pills = [
  { text: "500K STUDENTS", tint: "#f5ce78", x: "-3%", y: "22%", rot: -9 },
  { text: "1 → 14 EXAMS", tint: "#6dc7ba", x: "84%", y: "16%", rot: 8 },
  { text: "99.4% ACCURATE", tint: "#c3afff", x: "88%", y: "62%", rot: -6 },
  { text: "30+ TEAM", tint: "#f79c77", x: "-1%", y: "68%", rot: 7 },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-10 sm:pt-40">
      <div className="grid-ground pointer-events-none absolute inset-0 -z-10" />

      {/* Floating metric pills — desktop only, they'd crowd a phone. */}
      <div className="pointer-events-none absolute inset-0 -z-0 hidden lg:block">
        {pills.map((p, i) => (
          <motion.div
            key={p.text}
            initial={{ opacity: 0, scale: 0.8, rotate: p.rot * 2 }}
            animate={{ opacity: 1, scale: 1, rotate: p.rot }}
            transition={{ duration: 0.8, ease, delay: 0.6 + i * 0.12 }}
            className="absolute"
            style={{ left: p.x, top: p.y }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mono rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)]"
              style={{ background: p.tint }}
            >
              {p.text}
            </motion.div>
          </motion.div>
        ))}
      </div>

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

        {/* The headline. The O in PRODUCTS is a live map of 1,760 companies. */}
        <h1 className="display text-center text-[clamp(3rem,13vw,10.5rem)] text-paper">
          {["I MAKE", null, "MEASURABLE"].map((text, i) =>
            text ? (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  custom={i}
                  variants={line}
                  initial="hidden"
                  animate="shown"
                  className="block"
                >
                  {text}
                </motion.span>
              </span>
            ) : (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  custom={i}
                  variants={line}
                  initial="hidden"
                  animate="shown"
                  className="flex items-center justify-center gap-[0.02em]"
                >
                  <span>PR</span>
                  <PinOrb className="mx-[0.03em] w-[0.78em] shrink-0 translate-y-[0.03em]" />
                  <span className="text-accent">DUCTS</span>
                </motion.span>
              </span>
            ),
          )}
        </h1>

        {/* Caption for the orb — otherwise it's just a pretty circle. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mono mt-7 text-center text-[11px] tracking-[0.16em] text-muted"
        >
          <span className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-signal align-middle" />
          THAT O IS REAL DATA — {pins.total.toLocaleString()} NCR STARTUPS,{" "}
          {pins.verified.toLocaleString()} ADDRESS-VERIFIED
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-muted sm:text-lg"
        >
          Product ops at{" "}
          <span className="text-paper">MathonGo</span>. I built the data
          pipelines behind exam analysis for{" "}
          <span className="text-paper">500,000 students</span>, scaled the test
          series from one exam to fourteen, and shipped a College Predictor at{" "}
          <span className="text-paper">99.4% accuracy</span> before it went live.
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-20 border-y border-line py-4"
      >
        <Marquee duration={45}>
          {marqueeWords.map((w) => (
            <span key={w} className="flex items-center">
              <span className="mono px-6 text-sm tracking-[0.18em] text-muted">
                {w}
              </span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
