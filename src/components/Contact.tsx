"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";
import { person } from "@/lib/content";

/** The verb cycles; the rest of the sentence holds still. */
const VERBS = ["BUILD", "SHIP", "FIX", "MEASURE"] as const;

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
    label: "NCR Hiring",
    href: "https://ncrhiring.in",
    icon: (
      <>
        <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" />
        <circle cx="12" cy="10.5" r="2.3" />
      </>
    ),
  },
];

/** Text set around a circle, rotating slowly. */
function StampBadge() {
  const reduced = useReducedMotion();
  return (
    <a
      href={`mailto:${person.email}`}
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
        >
          <path d="M7 17L17 7M8 7h9v9" />
        </svg>
      </span>
    </a>
  );
}

function CyclingVerb() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % VERBS.length), 2200);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    // Fixed height with the stack translated inside it, so the line never
    // reflows as the word changes — the widest verb sets the box.
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom">
      {/* Reserves the width of the longest verb so the sentence stays put. */}
      <span className="invisible px-[0.22em]" aria-hidden>
        {VERBS.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <motion.span
        className="absolute inset-0 flex flex-col items-center"
        animate={{ y: `-${i * 100}%` }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {VERBS.map((v) => (
          <span
            key={v}
            className="flex h-full w-full shrink-0 items-center justify-center rounded-[0.18em] bg-accent px-[0.22em] text-white"
          >
            {v}
          </span>
        ))}
      </motion.span>
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

        <div className="mono mt-20 flex flex-col items-center justify-between gap-2 border-t border-line pt-8 text-[11px] tracking-[0.12em] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} ANMOL SETHI</span>
          <span>DELHI NCR / BENGALURU · BUILT BY ME</span>
        </div>
      </div>
    </footer>
  );
}
