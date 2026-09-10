"use client";

import { motion } from "motion/react";
import { PinOrb } from "./PinOrb";
import { Avatar } from "./Avatar";
import { person } from "@/lib/content";

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
/** Four anchors under the claim — where, how long, how big, how far it scaled. */
const PROOF = [
  { value: "MathonGo", label: "Product ops, 2 yrs" },
  { value: "500K", label: "Students covered" },
  { value: "1 → 14", label: "Exams scaled" },
  { value: "30+", label: "Team managed" },
] as const;

/**
 * Any line may hand a letter to the orb: give it `before`/`after` instead of
 * `text` and the map is drawn where that letter would be.
 */
type HeadLine =
  | { text: string; accent?: boolean }
  | { before: string; after: string; accent?: boolean };

/**
 * The ring around the map in INTO. Same soft yellow the falling pills use, so
 * it stays inside the palette. It reads clearly because the map it encircles
 * is almost black, and it is far enough from the orange of COMPLEXITY above
 * not to be mistaken for it.
 */
const O_TINT = "#f5ce78";

const HEADLINE: HeadLine[] = [
  { text: "I TURN" },
  { text: "COMPLEXITY", accent: true },
  // The orb takes the O of INTO. The leading space is non-breaking: this line
  // is a flex row, so an ordinary space would collapse and the words would run
  // together as "INT●CLARITY".
  { before: "INT", after: "\u00A0CLARITY" },
];

export function Hero() {

  return (
    <section id="top" className="relative pt-32 pb-4 sm:pt-40">
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
          <span className="text-lg text-paper sm:text-2xl">{person.name}</span>
        </motion.div>

        {/* The headline. The orb is a live map of every mapped company standing
            in for a letter, so HEADLINE controls exactly which one it replaces. */}
        <h1 className="display text-center text-[clamp(2.6rem,8.8vw,8.5rem)] text-paper">
          {HEADLINE.map((l, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                custom={i}
                variants={line}
                initial="hidden"
                animate="shown"
                className={`${l.accent ? "text-accent " : ""}${
                  "before" in l
                    ? "flex items-center justify-center gap-[0.02em]"
                    : "block"
                }`}
              >
                {"before" in l ? (
                  <>
                    <span>{l.before}</span>
                    {/* The letter O: a solid white disc with the live map
                        inset inside it, so the white reads as the stroke of
                        the letter and the map fills its counter. The map keeps
                        its own positioning, so it is wrapped rather than being
                        positioned directly. */}
                    <span
                      className="relative mx-[0.03em] inline-block aspect-square w-[0.78em] shrink-0 translate-y-[0.04em] rounded-full align-middle"
                      style={{ backgroundColor: O_TINT }}
                      aria-hidden
                    >
                      <span className="absolute inset-[13%] block">
                        {/* Bigger dots and a tighter crop than the defaults.
                            At this size the dot radius bottoms out at its
                            floor, so the map read as a few faint specks. */}
                        <PinOrb className="w-full" dotScale={2.2} fill={1.12} />
                      </span>
                    </span>
                    <span>{l.after}</span>
                  </>
                ) : (
                  l.text
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* The claim carries the weight; the numbers underneath are a readout,
            not a sentence, so the whole block is scannable rather than read. */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="mx-auto mt-9 max-w-xl text-center text-xl leading-snug text-paper sm:text-2xl"
        >
          Make the output trustworthy when the volume goes up.
        </motion.p>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.85 }}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
        >
          {PROOF.map((p) => (
            <div key={p.label} className="bg-ink px-4 py-5 text-center">
              <dd className="text-lg font-semibold text-paper sm:text-xl">
                {p.value}
              </dd>
              <dt className="mt-1.5 text-[13px] leading-snug text-balance text-muted">
                {p.label}
              </dt>
            </div>
          ))}
        </motion.dl>

      </div>

    </section>
  );
}
