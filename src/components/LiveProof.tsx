"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PinOrb, type Hit } from "./PinOrb";
import { Reveal } from "./Reveal";
import { usePins } from "./PinsProvider";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

export function LiveProof() {
  const [hit, setHit] = useState<Hit | null>(null);
  const pins = usePins();

  const readout = [
    { k: "Companies mapped", v: pins.total.toLocaleString() },
    { k: "Address-verified", v: pins.verified.toLocaleString() },
    { k: "Hiring right now", v: pins.hiring.toLocaleString() },
    { k: "Open roles", v: pins.openJobs.toLocaleString() },
  ];

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2/40 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="mono inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/8 px-3 py-1.5 text-[10px] tracking-[0.18em] text-signal">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
              </span>
              {pins.live ? "LIVE FROM NCRHIRING.IN" : `SNAPSHOT · ${fmtDate(pins.generated).toUpperCase()}`}
            </p>

            <h2 className="display mt-6 text-[clamp(2.2rem,6vw,4.2rem)] text-paper">
              This isn&rsquo;t
              <br />
              a graphic
            </h2>

            <p className="mt-6 max-w-md leading-relaxed text-muted">
              Every dot is one company from{" "}
              <a
                href="https://ncrhiring.in"
                target="_blank"
                rel="noreferrer"
                className="text-paper underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
              >
                ncrhiring.in
              </a>
              , a startup map of Delhi NCR I built and still run. The shape you
              see is the actual geography — Gurugram bottom-left, Noida right,
              Delhi through the middle.
            </p>

            <div className="mt-7 space-y-3 text-sm text-muted">
              <div className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 rounded-full bg-[#ff7a3c]" />
                <span>
                  <span className="text-paper">Verified</span> — street address
                  checked against Google Maps.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 rounded-full bg-white/40" />
                <span>
                  <span className="text-paper">Approximate</span> — known to be
                  hiring in the city, address unconfirmed. Never shown as verified.
                </span>
              </div>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {readout.map((r) => (
                <div key={r.k} className="bg-ink p-5">
                  <div className="display text-2xl text-paper sm:text-3xl">
                    {r.v}
                  </div>
                  <div className="mono mt-2 text-[10px] tracking-[0.12em] text-muted">
                    {r.k.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://ncrhiring.in"
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Open the live map
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <PinOrb
            fill={0.96}
            dotScale={0.55}
            parallax={16}
            inspect
            onHit={setHit}
          />

          {/* Tooltip is positioned in orb-local pixels, which is exactly the
              coordinate space the canvas reports the hit in. */}
          <AnimatePresence>
            {hit && (
              <motion.div
                key={hit.label[0]}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.16 }}
                className="pointer-events-none absolute z-10 w-max max-w-[15rem] -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl border border-white/14 bg-black/85 px-3.5 py-2.5 backdrop-blur-md"
                style={{ left: hit.x, top: hit.y }}
              >
                <div className="text-sm font-semibold text-paper">
                  {hit.label[0]}
                </div>
                <div className="mono mt-1 text-[10px] tracking-[0.12em] text-muted">
                  {[hit.label[1], hit.label[2]].filter(Boolean).join(" · ").toUpperCase()}
                </div>
                {hit.label[3] > 0 && (
                  <div className="mono mt-1.5 text-[10px] tracking-[0.12em] text-signal">
                    {hit.label[3]} OPEN {hit.label[3] === 1 ? "ROLE" : "ROLES"}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mono absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-ink px-4 py-2 text-[10px] tracking-[0.16em] text-muted">
            {hit
              ? "VERIFIED PIN"
              : `HOVER A BRIGHT PIN · UPDATED ${fmtDate(pins.generated).toUpperCase()}`}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
