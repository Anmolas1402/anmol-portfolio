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
/**
 * Four anchors under the claim. All four read as metrics now — the first tile
 * used to be a company name beside three numbers, which made the row look like
 * a label followed by data rather than one set of figures.
 */
const PROOF = [
  { value: "2+ YEARS", label: "Product Ops @ MathonGo" },
  { value: "500K+", label: "Students impacted" },
  { value: "0 → 1", label: "Features shipped end-to-end" },
  { value: "30+", label: "People managed" },
] as const;

/**
 * Any line may hand a letter to the orb: give it `before`/`after` instead of
 * `text` and the map is drawn where that letter would be.
 */
type HeadLine = { accent?: boolean; scale?: number } & (
  | { text: string }
  | { before: string; after: string }
);

/**
 * The ring around the map in INTO. Same soft yellow the falling pills use, so
 * it stays inside the palette. It reads clearly because the map it encircles
 * is almost black, and it is far enough from the orange of COMPLEXITY above
 * not to be mistaken for it.
 */
const O_TINT = "#f5ce78";

/**
 * The accent line is filled with a gradient rather than the flat accent: a
 * single saturated orange across ten heavy letterforms reads as neon. Warmer
 * at the top, deeper at the foot, both still inside the accent's own family.
 */
const ACCENT_FILL = "linear-gradient(180deg, #ff7a45 0%, #ff5a1f 55%, #e0491a 100%)";

/**
 * `scale` is relative to the h1, so the three lines are not one size stepped
 * evenly — COMPLEXITY carries the punch, I TURN steps back out of its way, and
 * the closing line holds the base size. The orb is sized in em, so it tracks
 * whatever its own line is set to.
 */
const HEADLINE: HeadLine[] = [
  { text: "I TURN", scale: 0.94 },
  { text: "COMPLEXITY", accent: true, scale: 1.04 },
  // The orb takes the O of INTO. The leading space is non-breaking: this line
  // is a flex row, so an ordinary space would collapse and the words would run
  // together as "INT●CLARITY".
  { before: "INT", after: "\u00A0CLARITY", scale: 0.97 },
];

export function Hero() {

  return (
    <section id="top" // pb on a phone is clearance, not decoration: the falling band sits directly
  // below and its settled pile grows upward, so without this the pile buries
  // the subtitle.
  className="relative pt-28 pb-32 sm:pt-56 sm:pb-4">
      <div className="grid-ground pointer-events-none absolute inset-0 -z-10" />


      <div className="mx-auto max-w-6xl px-5">
        {/* Hey, I'm Anmol */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-6 flex items-center justify-center gap-3 sm:mb-14"
        >
          <span className="text-lg text-muted sm:text-2xl">Hey, I&rsquo;m</span>
          <Avatar className="size-10 text-xs sm:size-12 sm:text-sm" />
          <span className="text-lg text-paper sm:text-2xl">{person.name}</span>
        </motion.div>

        {/* The headline. The orb is a live map of every mapped company standing
            in for a letter, so HEADLINE controls exactly which one it replaces. */}
        <h1 className="display mx-auto text-center text-[clamp(2.6rem,8.2vw,7.8rem)] leading-[0.86] tracking-[-0.05em] text-paper">
          {HEADLINE.map((l, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                custom={i}
                variants={line}
                initial="hidden"
                animate="shown"
                style={{
                  ...(l.scale ? { fontSize: `${l.scale}em` } : {}),
                  ...(l.accent
                    ? {
                        backgroundImage: ACCENT_FILL,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }
                    : {}),
                }}
                className={`${
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
                      // overflow-hidden clips the map's own outer glow. Left
                      // unclipped it haloed past the ring and the letter read
                      // as an object dropped between INT and CLARITY rather
                      // than a letter inside the word.
                      className="relative mx-[0.015em] inline-block aspect-square w-[0.7em] shrink-0 translate-y-[0.035em] overflow-hidden rounded-full align-middle"
                      style={{
                        backgroundColor: O_TINT,
                        boxShadow: "inset 0 0 0.08em rgba(255,90,31,0.35)",
                      }}
                      aria-hidden
                    >
                      <span className="absolute inset-[11%] block">
                        {/* Bigger dots and a tighter crop than the defaults:
                            at this size the dot radius bottoms out at its
                            floor, so the map read as a few faint specks. The
                            approximate pins are thinned harder than usual —
                            in a letter they are clutter, not density. */}
                        <PinOrb
                          className="w-full"
                          dotScale={1.7}
                          fill={1.18}
                          approxThin={1.6}
                        />
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
          className="mx-auto mt-8 max-w-[34rem] text-center text-[1.25rem] leading-[1.4] tracking-[-0.01em] text-muted sm:mt-12 sm:text-[1.5rem]"
        >
          Currently figuring out how things work,{" "}
          {/* Forced only where the line is wide enough to need it. On a phone
              the first half wraps on its own, and the break on top of that
              left a three-line stub. */}
          <br className="hidden sm:inline" />
          {/* The half that is actually the point carries the brighter tone;
              the setup line stays quiet. */}
          <span className="text-paper">and how they could work better.</span>
        </motion.p>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.85 }}
          className="mx-auto mt-14 hidden max-w-[46rem] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid sm:grid-cols-4"
        >
          {PROOF.map((p) => (
            <div key={p.label} className="bg-ink px-4 py-7 text-center">
              <dd className="text-xl font-semibold text-paper sm:text-2xl">
                {p.value}
              </dd>
              <dt className="mt-2 text-[13.5px] leading-snug text-balance text-paper/65">
                {p.label}
              </dt>
            </div>
          ))}
        </motion.dl>

      </div>

    </section>
  );
}
