"use client";

import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { projects, type Project } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";

function Card({ project, i }: { project: Project; i: number }) {
  return (
    <Reveal>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-6 sm:p-8"
      >
        {/* Accent wash on hover — cheap, but it makes the card feel alive. */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
             style={{ background: "radial-gradient(600px circle at 50% 0%, rgba(255,90,31,0.09), transparent 60%)" }} />

        <div className="relative">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="mono text-xs tracking-[0.2em] text-accent">
              {project.index}
            </span>
            <span className="h-px flex-1 bg-line" />
            {project.live && (
              <span className="mono inline-flex items-center gap-1.5 rounded-full border border-signal/25 bg-signal/8 px-2.5 py-1 text-[10px] tracking-[0.16em] text-signal">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
                </span>
                LIVE
              </span>
            )}
            <span className="text-[13px] text-muted">
              {project.kicker}
            </span>
          </div>

          <div className="flex flex-col gap-7">
            <div>
              <h3 className="display text-[clamp(1.7rem,4vw,2.4rem)] text-paper">
                {project.title}
              </h3>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
                {project.blurb}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="mono rounded-full border border-line px-3 py-1.5 text-[10px] tracking-[0.1em] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="display text-[clamp(2rem,5vw,3rem)] text-paper">
                  {project.stat.value}
                </div>
                <div className="mt-2 max-w-[14rem] text-[13px] leading-snug text-muted">
                  {project.stat.label}
                </div>
              </div>

              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex w-fit items-center gap-2 rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-paper transition hover:border-accent hover:bg-accent hover:text-white"
                >
                  {project.hrefLabel ?? "Visit"}
                  <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
        <span className="pointer-events-none absolute -right-6 -bottom-10 select-none text-[10rem] font-black leading-none text-white/[0.02]">
          {i + 1}
        </span>
      </motion.article>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Selected work"
        title="Things I shipped"
        note="Four projects, each with a number attached. Two are live right now."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => (
          <Card key={p.id} project={p} i={i} />
        ))}
      </div>
    </section>
  );
}
