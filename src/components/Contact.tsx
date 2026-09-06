"use client";

import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";
import { person } from "@/lib/content";

const socials = [
  { label: "Email", href: `mailto:${person.email}`, text: person.email },
  { label: "LinkedIn", href: person.linkedin, text: "anmol-sethi" },
  { label: "GitHub", href: person.github, text: "Anmolas1402" },
  { label: "Live project", href: "https://ncrhiring.in", text: "ncrhiring.in" },
];

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line pt-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,90,31,0.13), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="eyebrow text-center">Open to product & ops roles</p>
          <h2 className="display mt-6 text-center text-[clamp(2.6rem,11vw,8rem)] text-paper">
            Let&rsquo;s build
            <br />
            <span className="text-accent">something real</span>
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-center leading-relaxed text-muted">
            If you&rsquo;re shipping something where the data has to be right,
            I&rsquo;d like to hear about it.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${person.email}`}
              className="rounded-full bg-accent px-7 py-3.5 font-semibold text-white transition hover:brightness-110"
            >
              {person.email}
            </a>
            <a
              href={person.resume}
              className="rounded-full border border-white/14 px-7 py-3.5 font-semibold text-paper transition hover:bg-white/6"
            >
              Resume
            </a>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group bg-ink p-5 transition-colors hover:bg-ink-2"
            >
              <div className="eyebrow">{s.label}</div>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-paper">
                {s.text}
                <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mono flex flex-col items-center justify-between gap-2 py-8 text-[11px] tracking-[0.12em] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} ANMOL SETHI</span>
          <span>DELHI NCR / BENGALURU · BUILT BY ME</span>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <Marquee duration={30}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center">
              <span className="display px-8 text-3xl text-paper sm:text-5xl">
                GET IN TOUCH
              </span>
              <span className="text-accent">●</span>
            </span>
          ))}
        </Marquee>
      </div>
    </footer>
  );
}
