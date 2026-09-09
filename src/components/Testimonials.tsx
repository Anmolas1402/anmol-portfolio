"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { testimonials } from "@/lib/content";

/**
 * Quotes people actually wrote, credited to them. Nothing here is composed on
 * someone's behalf — an invented endorsement is worth less than none, because
 * the first person who checks it finds out.
 *
 * Renders as a scroll-snapped rail so it holds one quote or six without
 * changing shape; the arrows only appear once there is more than one.
 */
export function Testimonials() {
  const railRef = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const many = testimonials.length > 1;

  useEffect(() => {
    const el = railRef.current;
    if (!el || !many) return;
    const onScroll = () => {
      const w = el.clientWidth;
      setAt(Math.round(el.scrollLeft / Math.max(w, 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [many]);

  const go = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="What people say"
          title="In their words"
        />

        <Reveal>
          <div className="relative mt-10">
            <span
              aria-hidden
              className="display block text-6xl leading-none text-accent/40"
            >
              &ldquo;
            </span>

            <div
              ref={railRef}
              className="mt-4 flex snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {testimonials.map((t) => (
                <figure key={t.name} className="w-full shrink-0 snap-start">
                  {/* Attribution sits under the quote, where a credit belongs.
                      The quote is held to a 46ch measure so the space to its
                      right reads as margin rather than as a gap. */}
                  <blockquote className="max-w-[46ch] text-xl leading-relaxed text-muted sm:text-[26px] sm:leading-[1.45]">
                    &ldquo;
                    {(() => {
                      // Split on the emphasised clause so the closing line
                      // carries full brightness and the lead stays muted —
                      // the reference's treatment. Same words either way.
                      const at = t.emphasise ? t.quote.indexOf(t.emphasise) : -1;
                      if (at < 0) return t.quote;
                      return (
                        <>
                          {t.quote.slice(0, at)}
                          <span className="text-paper">
                            {t.quote.slice(at, at + t.emphasise!.length)}
                          </span>
                          {t.quote.slice(at + t.emphasise!.length)}
                        </>
                      );
                    })()}
                    &rdquo;
                  </blockquote>
                  <figcaption className="mt-8">
                    <div className="font-semibold text-paper">{t.name}</div>
                    <div className="mt-1 max-w-xl text-sm text-muted">
                      {t.role}
                    </div>
                    {(t.relationship || t.source) && (
                      <div className="mt-2 text-[13px] text-muted/70">
                        {[t.relationship, t.source].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>

            {many && (
              <div className="mt-10 flex items-center gap-3">
                {([-1, 1] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => go(d)}
                    disabled={d === -1 ? at === 0 : at >= testimonials.length - 1}
                    aria-label={d === -1 ? "Previous quote" : "Next quote"}
                    className="grid size-11 place-items-center rounded-full border border-line text-muted transition hover:border-white/25 hover:bg-white/6 hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d={d === -1 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </button>
                ))}
                <span className="mono ml-2 text-[11px] tracking-[0.14em] text-muted">
                  {at + 1} / {testimonials.length}
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
