"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";
import { person } from "@/lib/content";

/**
 * The verb cycles and each one carries its own ring colour, as the reference
 * does — measured there as teal, periwinkle, orange and pink across four words.
 *
 * No green: the signal green on this site means live data, and a decorative
 * ring in it would undercut that. These are the physics-pill tints, saturated
 * enough to hold as an outline on the dark ground.
 */
const VERBS = [
  { word: "BUILD", ring: "#ff5a1f" },
  { word: "SHIP", ring: "#8b7cf6" },
  { word: "FIX", ring: "#ff5c8a" },
  { word: "MEASURE", ring: "#f0c24a" },
] as const;

/**
 * A thick outline faked with text-shadows arranged around a circle — the same
 * trick the reference uses, since -webkit-text-stroke draws inside the glyph
 * and thins the letterforms. 24 steps is enough that the ring reads as solid.
 */
const ring = (color: string, radius = 9) =>
  Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return `${(Math.cos(a) * radius).toFixed(2)}px ${(Math.sin(a) * radius).toFixed(2)}px 0 ${color}`;
  }).join(", ");

const socials = [
  {
    label: "LinkedIn",
    href: person.linkedin,
    icon: (
      <>
        <path d="M5.6 8.2v9.4M5.6 5.2v.1" />
        <path d="M10.2 17.6V8.2M10.2 12.2c0-2.1 1.3-3.4 3.1-3.4s3.1 1.2 3.1 3.4v5.4" />
      </>
    ),
  },
  {
    label: "GitHub",
    href: person.github,
    icon: (
      <path d="M9 18.3c-3.4 1-3.4-1.7-4.8-2.1m9.6 4.1v-2.8c0-.8.1-1.1-.4-1.6 2.3-.3 4.4-1.1 4.4-4.9a3.8 3.8 0 0 0-1-2.6 3.5 3.5 0 0 0-.1-2.6s-.9-.3-2.9 1.1a9.9 9.9 0 0 0-5 0C6.8 5.5 5.9 5.8 5.9 5.8a3.5 3.5 0 0 0-.1 2.6 3.8 3.8 0 0 0-1 2.7c0 3.7 2.1 4.5 4.4 4.8-.5.5-.5 1-.4 1.6v2.8" />
    ),
  },
  {
    label: `WhatsApp ${person.phone}`,
    href: `https://wa.me/${person.phone.replace(/\D/g, "")}`,
    icon: (
      <>
        <path d="M3.8 20.2l1.2-4.2a7.6 7.6 0 1 1 3 3l-4.2 1.2z" />
        <path d="M9.1 8.6c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3-.1.5a5.4 5.4 0 0 0 2.6 2.3c.2.1.4 0 .5-.1l.5-.6c.2-.2.3-.2.5-.1l1.5.8c.2.1.3.2.3.4a1.7 1.7 0 0 1-1.2 1.4c-.4.1-1 .1-3-.8a8.6 8.6 0 0 1-3.4-3.4c-.7-1.2-.6-2-.5-2.4a1.9 1.9 0 0 1 .4-.8z" />
      </>
    ),
  },
];

/** Text set around a circle, rotating slowly. */
function StampBadge() {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // mailto: does nothing on a machine with no mail client configured, which is
  // most desktops now — so the address goes to the clipboard either way.
  const copy = () => {
    navigator.clipboard?.writeText(person.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  };

  return (
    <a
      href={`mailto:${person.email}`}
      onClick={copy}
      className="group relative grid size-[168px] shrink-0 place-items-center"
      aria-label={`Email ${person.email}`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 size-full ${reduced ? "" : "animate-[spin_18s_linear_infinite]"}`}
        aria-hidden
      >
        <defs>
          <path
            id="stamp-ring"
            d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
            fill="none"
          />
        </defs>
        <text
          className="mono fill-muted"
          style={{ fontSize: "9.4px", letterSpacing: "0.26em" }}
        >
          <textPath href="#stamp-ring" startOffset="0">
            GET IN TOUCH · GET IN TOUCH ·
          </textPath>
        </text>
      </svg>
      <span className="grid size-[72px] place-items-center rounded-full bg-paper text-ink transition group-hover:scale-105 group-hover:bg-white">
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M7 17L17 7M8 7h9v9" />
        </svg>
      </span>

      <span
        aria-live="polite"
        className={`mono pointer-events-none absolute -bottom-7 text-[10px] tracking-[0.14em] text-signal transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? "ADDRESS COPIED" : ""}
      </span>
    </a>
  );
}

function CyclingVerb() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % VERBS.length), 1800);
    return () => clearInterval(id);
  }, [reduced]);

  const { word, ring: ringColor } = VERBS[i];

  return (
    // An invisible copy of the longest verb holds the width, so swapping the
    // word never reflows the line.
    <span className="relative inline-block align-bottom">
      <span className="invisible" aria-hidden>
        {VERBS.reduce((a, b) => (b.word.length > a.word.length ? b : a)).word}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="absolute inset-0 flex items-center justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Near-instant, linear: a cut rather than a fade, so it blinks.
          transition={{ duration: 0.08, ease: "linear" }}
        >
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-start text-transparent"
            style={{ textShadow: ring(ringColor) }}
          >
            {word}
          </span>
          <span className="relative text-ink">{word}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Contact() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-line pt-24 pb-10"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,90,31,0.13), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="display text-[clamp(2.4rem,9vw,7rem)] text-paper">
            <span className="block">
              Let&rsquo;s <CyclingVerb />
            </span>
            <span className="block">something real</span>
          </h2>
        </Reveal>

        <Reveal>
          <div className="mt-20 grid items-center gap-12 md:grid-cols-3">
            <div>
              <a
                href={`mailto:${person.email}`}
                className="mono text-sm text-paper underline decoration-accent decoration-2 underline-offset-[6px] transition hover:text-accent"
              >
                {person.email}
              </a>
              <a
                href={`tel:${person.phone.replace(/\s/g, "")}`}
                className="mono mt-2 block text-sm text-muted transition hover:text-paper"
              >
                {person.phone}
              </a>
              <div className="mt-6 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-line text-muted transition hover:border-white/25 hover:bg-white/6 hover:text-paper"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <StampBadge />
            </div>

            <p className="text-2xl leading-snug text-paper md:text-right">
              Hiring for product or ops?
              <br />
              I&rsquo;d <em className="text-muted">like</em> to{" "}
              <em className="text-muted">hear</em> about it.
            </p>
          </div>
        </Reveal>

        {/* No rule above it and no spaced-out mono — the reference just sets
            two quiet lines, which is why its footer does not read as a
            separate strip bolted to the bottom. */}
        <div className="mt-16 flex flex-col items-center justify-between gap-1 text-sm text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Anmol Sethi.</span>
          <span>
            Handcrafted by me with <span className="text-accent">love</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
