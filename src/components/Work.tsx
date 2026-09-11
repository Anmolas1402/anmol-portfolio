"use client";

import { motion } from "motion/react";
import { RevealGroup, revealChild } from "./Reveal";
import { projects, type Project } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";

function Card({
  project,
  i,
  wide = false,
}: {
  project: Project;
  i: number;
  wide?: boolean;
}) {
  return (
    // Driven by the grid's variants rather than its own viewport check, so
    // siblings step in one after another instead of the row popping at once.
    <motion.div variants={revealChild} className={wide ? "lg:col-span-2" : undefined}>
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
            <span className="text-[13px] font-medium tabular-nums text-accent">
              {project.index}
            </span>
            <span className="h-px flex-1 bg-line" />
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
                    className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted"
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
    </motion.div>
  );
}

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Selected work"
        title="Things I shipped"
      />
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2" stagger={0.09}>
        {/* An odd number of projects leaves the last card alone beside an
            empty half-row, so it takes the full width instead. */}
        {projects.map((p, i) => (
          <Card
            key={p.id}
            project={p}
            i={i}
            wide={projects.length % 2 === 1 && i === projects.length - 1}
          />
        ))}
      </RevealGroup>
    </section>
  );
}
