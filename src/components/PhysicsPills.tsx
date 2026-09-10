"use client";

import { useEffect, useRef, useState } from "react";
import { Marquee } from "./Marquee";
import { marqueeWords } from "@/lib/content";

/**
 * A band of metric pills and loose balls that drop in under gravity, land on
 * the marquee strip below them, pile up, and can be grabbed and thrown.
 *
 * Matter.js runs the simulation; every body is a real DOM node positioned from
 * its body each frame, so pill text stays selectable and screen-readable rather
 * than being painted into a canvas. Matter is imported dynamically and only
 * once the band scrolls into view — it is the heaviest dependency here and the
 * hero must not wait on it.
 *
 * The marquee is rendered by this component rather than by the hero precisely
 * so the band's floor and the top of the line are the same edge.
 */

type IconName = keyof typeof ICONS;

type Item =
  | { kind: "pill"; text: string; tint: string }
  | { kind: "ball"; size: number; tint: string; icon: IconName };

/** ~24° — the most tilt that still reads cleanly. */
const TILT = 0.42;

/**
 * Stroked line icons, drawn at a 24 viewBox so one set of paths scales to every
 * ball. Chosen for what Anmol actually does — shipping, measuring, mapping —
 * rather than for decoration.
 */
const ICONS = {
  spark: <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3z" />,
  arrow: (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  chart: (
    <>
      <path d="M5 20V11" />
      <path d="M12 20V4" />
      <path d="M19 20v-6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  bolt: <path d="M13.2 3L5.6 13.4h5L10.2 21l7.8-10.6h-5L13.2 3z" />,
  coffee: (
    <>
      <path d="M4 9h12v5.5A4.5 4.5 0 0 1 11.5 19h-3A4.5 4.5 0 0 1 4 14.5V9z" />
      <path d="M16 10.2h1.6a2.4 2.4 0 0 1 0 4.8H16" />
      <path d="M7.5 3v2.6M11.5 3v2.6" />
    </>
  ),
  soda: (
    <>
      <path d="M8 6.5h8v12a2.5 2.5 0 0 1-2.5 2.5h-3A2.5 2.5 0 0 1 8 18.5v-12z" />
      <path d="M8 6.5c0-1.1 1.8-2 4-2s4 .9 4 2" />
      <path d="M10.4 10h3.2M10.4 13h3.2" />
    </>
  ),
  heart: (
    <path d="M12 20.3s-7-4.4-7-9.1A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 7 3C19 15.9 12 20.3 12 20.3z" />
  ),
  smiley: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.7 14.1a4.2 4.2 0 0 0 6.6 0" />
      <path d="M9.4 9.5v.01M14.6 9.5v.01" />
    </>
  ),
  fire: (
    <>
      <path d="M12 21c3.2 0 5.4-2.3 5.4-5.3 0-3.6-3.3-5.2-3.3-8.5C14.1 5.2 12.8 3.7 11.6 3c.3 2-1 3.4-2.2 4.8C8 9.3 6.6 11.1 6.6 13.9 6.6 17.6 8.9 21 12 21z" />
      <path d="M12 21c1.6 0 2.7-1.1 2.7-2.6 0-1.8-1.7-2.5-1.7-4.1-1 1-2.2 1.9-2.2 3.6 0 1.6.7 3.1 1.2 3.1z" />
    </>
  ),
  headphones: (
    <>
      <path d="M5 15.2v-2.4a7 7 0 0 1 14 0v2.4" />
      <path d="M5 14h2.1a1 1 0 0 1 1 1v3.3a1 1 0 0 1-1 1H6.2A1.2 1.2 0 0 1 5 19.1V14z" />
      <path d="M19 14h-2.1a1 1 0 0 0-1 1v3.3a1 1 0 0 0 1 1h.9a1.2 1.2 0 0 0 1.2-1.2V14z" />
    </>
  ),
  star: (
    <path d="M12 3.6l2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.8l5.8-.9L12 3.6z" />
  ),
  eye: (
    <>
      <path d="M2.6 12S6.1 6.6 12 6.6 21.4 12 21.4 12 17.9 17.4 12 17.4 2.6 12 2.6 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
} as const;

const ITEMS: Item[] = [
  { kind: "pill", text: "STRUCTURING CHAOS", tint: "#f5ce78" },
  { kind: "ball", size: 54, tint: "#ff9a5c", icon: "chart" },
  { kind: "ball", size: 46, tint: "#f7c5d0", icon: "heart" },
  { kind: "pill", text: "PROBLEM SOLVING", tint: "#6dc7ba" },
  { kind: "ball", size: 58, tint: "#e5d3ff", icon: "soda" },
  { kind: "pill", text: "DATA → DECISIONS", tint: "#c3afff" },
  { kind: "ball", size: 44, tint: "#c3afff", icon: "spark" },
  { kind: "pill", text: "REFRAMING PROBLEMS", tint: "#f79c77" },
  { kind: "ball", size: 52, tint: "#b9e8a1", icon: "smiley" },
  { kind: "pill", text: "BUILDING SYSTEMS", tint: "#a8d5ff" },
  { kind: "ball", size: 60, tint: "#6dc7ba", icon: "headphones" },
  { kind: "pill", text: "ROOT CAUSE ANALYSIS", tint: "#f7c5d0" },
  { kind: "ball", size: 48, tint: "#ffb37a", icon: "fire" },
  { kind: "pill", text: "USER RESEARCH", tint: "#b9e8a1" },
  { kind: "ball", size: 50, tint: "#f5ce78", icon: "star" },
  { kind: "pill", text: "BUSINESS ANALYSIS", tint: "#ffb37a" },
  { kind: "ball", size: 46, tint: "#a8d5ff", icon: "eye" },
  { kind: "pill", text: "MARKET RESEARCH", tint: "#a8d5ff" },
  { kind: "ball", size: 56, tint: "#c3afff", icon: "coffee" },
  { kind: "pill", text: "PROCESS DESIGN", tint: "#b9e8a1" },
  { kind: "ball", size: 44, tint: "#6dc7ba", icon: "clock" },
  { kind: "pill", text: "EXPERIMENTATION", tint: "#f7c5d0" },
  { kind: "ball", size: 52, tint: "#f79c77", icon: "pin" },
];

/** Lit from above, seated below — what makes the shapes read as objects. */
const GLOSS =
  "inset 0 3px 6px rgba(255,255,255,0.55), inset 0 -5px 10px rgba(0,0,0,0.14), 0 12px 30px -10px rgba(0,0,0,0.9)";

export function PhysicsPills() {
  const bandRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  // "idle" until we know what we can do; "static" honours reduced motion.
  const [mode, setMode] = useState<"idle" | "static" | "live">("idle");
  // Sixteen bodies overflow the top of the band on a phone — the widest pill
  // alone is 61% of a 390px screen. Narrow viewports get a subset instead.
  const [limit, setLimit] = useState(ITEMS.length);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    let stop = () => {};
    let cancelled = false;

    // Runs the moment the component mounts rather than waiting for the band to
    // scroll into view, so the drop has already started by the time the reader
    // gets here. Matter is still imported dynamically, so nothing blocks paint.
    const start = () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          // No gravity, no drag — just lay everything out and leave it alone.
          setMode("static");
          return;
        }

        void (async () => {
          const M = await import("matter-js");
          if (cancelled || !bandRef.current) return;

          const count =
            band.clientWidth < 560 ? 6 : band.clientWidth < 900 ? 10 : ITEMS.length;
          setLimit(count);
          // Let React drop the extra bodies before measuring pill widths.
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          if (cancelled || !bandRef.current) return;

          const items = ITEMS.slice(0, count);
          const width = band.clientWidth;
          const height = band.clientHeight;
          const WALL = 200; // thick walls so fast throws cannot tunnel out

          const engine = M.Engine.create();
          engine.gravity.y = 1.1;

          // Fisher-Yates, so which body lands where changes on every load.
          const slots = items.map((_, k) => k);
          for (let k = slots.length - 1; k > 0; k--) {
            const j = Math.floor(Math.random() * (k + 1));
            [slots[k], slots[j]] = [slots[j], slots[k]];
          }

          const bodies = items.map((item, i) => {
            const el = itemRefs.current[i];
            if (!el) return null;
            // Scattered, not single file. Each body takes a shuffled slot
            // across the width plus a little jitter — that keeps them spread
            // out (pure random clusters) while looking unplanned — and a
            // random height, so they arrive in no particular order.
            const jitter = (Math.random() - 0.5) * width * 0.07;
            const x = Math.max(
              44,
              Math.min(
                width - 44,
                width * (0.08 + 0.84 * ((slots[i] + 0.5) / items.length)) + jitter,
              ),
            );
            const y = -120 - Math.random() * 1100;
            const opts = {
              restitution: 0.45,
              friction: 0.35,
              frictionAir: 0.012,
            };
            if (item.kind === "ball") {
              return M.Bodies.circle(x, y, item.size / 2, opts);
            }
            return M.Bodies.rectangle(x, y, el.offsetWidth, el.offsetHeight, {
              ...opts,
              chamfer: { radius: el.offsetHeight / 2 },
              angle: (Math.random() - 0.5) * 0.5,
            });
          });

          const walls = [
            M.Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
            M.Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
            M.Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
          ];

          const live = bodies.filter((b): b is NonNullable<typeof b> => !!b);
          M.Composite.add(engine.world, [...walls, ...live]);

          // Drag and throw. Matter's own wheel handler swallows page scroll, so
          // remove it — the band sits mid-page and must not trap the user.
          const mouse = M.Mouse.create(band);
          band.removeEventListener(
            "wheel",
            (mouse as unknown as { mousewheel: (e: Event) => void }).mousewheel,
          );
          const drag = M.MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.18, render: { visible: false } },
          });
          M.Composite.add(engine.world, drag);

          let raf = 0;
          let last = performance.now();
          const frame = (now: number) => {
            // Clamped delta: a backgrounded tab would otherwise resume with a
            // huge step and fire every body through the floor.
            const dt = Math.min(now - last, 32);
            last = now;
            M.Engine.update(engine, dt);

            for (let i = 0; i < live.length; i++) {
              const el = itemRefs.current[i];
              if (!el) continue;
              const body = live[i];
              // Unrestricted tumbling settles pills upside down and the text
              // reads backwards, so cap the tilt and kill the spin at the
              // limit. Balls carry no text, so they spin freely.
              if (
                items[i].kind === "pill" &&
                (body.angle > TILT || body.angle < -TILT)
              ) {
                M.Body.setAngle(body, Math.max(-TILT, Math.min(TILT, body.angle)));
                M.Body.setAngularVelocity(body, 0);
              }
              const { position: p, angle } = body;
              el.style.transform = `translate(${p.x - el.offsetWidth / 2}px, ${
                p.y - el.offsetHeight / 2
              }px) rotate(${angle}rad)`;
            }
            raf = requestAnimationFrame(frame);
          };
          raf = requestAnimationFrame(frame);
          setMode("live");

          const onResize = () => {
            const w = band.clientWidth;
            M.Body.setPosition(walls[0], { x: w / 2, y: height + WALL / 2 });
            M.Body.setPosition(walls[2], { x: w + WALL / 2, y: height / 2 });
          };
          window.addEventListener("resize", onResize);

          stop = () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            M.Composite.clear(engine.world, false);
            M.Engine.clear(engine);
          };
        })();
    };

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  const isStatic = mode === "static";

  return (
    <section
      aria-label="Career numbers, as a pile of draggable pills"
      className="relative z-20"
    >
      <div
        ref={bandRef}
        className={
          isStatic
            ? "flex flex-wrap items-center justify-center gap-3 px-5 py-12"
            : "relative h-[26svh] max-h-[280px] min-h-[200px] w-full cursor-grab overflow-visible select-none active:cursor-grabbing"
        }
      >
        {ITEMS.slice(0, limit).map((item, i) => (
          <div
            key={item.kind === "pill" ? item.text : `${item.icon}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            aria-hidden={item.kind === "ball"}
            className={`${
              item.kind === "pill"
                ? "flex items-center rounded-full px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.05em] whitespace-nowrap"
                : "grid place-items-center rounded-full"
            } ${isStatic ? "" : "pointer-events-none absolute top-0 left-0"}`}
            style={{
              background: item.tint,
              color: "#08080a",
              boxShadow: GLOSS,
              ...(item.kind === "ball"
                ? { width: item.size, height: item.size }
                : null),
              ...(isStatic
                ? { transform: `rotate(${(i % 2 ? 1 : -1) * 2}deg)` }
                : {
                    willChange: "transform",
                    // React owns opacity, the simulation owns transform. If
                    // React also set transform, the re-render that flips mode
                    // to "live" would reset every body for one frame.
                    opacity: mode === "live" ? 1 : 0,
                  }),
            }}
          >
            {item.kind === "pill" ? (
              item.text
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: item.size * 0.46, height: item.size * 0.46 }}
              >
                {ICONS[item.icon]}
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* The floor the pills land on. */}
      <div className="border-y border-line py-4">
        <Marquee duration={45}>
          {marqueeWords.map((w) => (
            <span key={w} className="flex items-center">
              {/* Body sans, not mono. Uppercase needs a little tracking to
                  stay legible, but the 0.18em mono it used to carry is the
                  spaced-out machine look. */}
              <span className="px-6 text-sm font-medium tracking-[0.04em] text-muted">
                {w}
              </span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
