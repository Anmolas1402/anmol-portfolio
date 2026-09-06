"use client";

import { motion } from "motion/react";
import { PinOrb } from "./PinOrb";
import { Reveal } from "./Reveal";
import pins from "@/lib/ncr-pins.json";

const readout = [
  { k: "Companies mapped", v: pins.total.toLocaleString() },
  { k: "Address-verified", v: pins.verified.toLocaleString() },
  { k: "Hiring right now", v: pins.hiring.toLocaleString() },
  { k: "Open roles", v: pins.openJobs.toLocaleString() },
];

export function LiveProof() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2/40 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <div>
            <p className="mono inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/8 px-3 py-1.5 text-[10px] tracking-[0.18em] text-signal">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
              </span>
              LIVE DATASET
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
          <PinOrb fill={0.96} dotScale={0.55} parallax={16} />
          <div className="mono absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-line bg-ink px-4 py-2 text-[10px] tracking-[0.16em] text-muted">
            DELHI NCR · UPDATED {pins.generated}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
