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
} as const;

const ITEMS: Item[] = [
  { kind: "pill", text: "500K STUDENTS", tint: "#f5ce78" },
  { kind: "ball", size: 54, tint: "#ff9a5c", icon: "chart" },
  { kind: "pill", text: "1 → 14 EXAMS", tint: "#6dc7ba" },
  { kind: "ball", size: 46, tint: "#c3afff", icon: "spark" },
  { kind: "pill", text: "99.4% ACCURATE", tint: "#c3afff" },
  { kind: "pill", text: "30+ TEAM", tint: "#f79c77" },
  { kind: "ball", size: 60, tint: "#6dc7ba", icon: "clock" },
  { kind: "pill", text: "100+ INTERNS HIRED", tint: "#f7c5d0" },
  { kind: "ball", size: 48, tint: "#f5ce78", icon: "arrow" },
  { kind: "pill", text: "2 L PAYING STUDENTS", tint: "#a8d5ff" },
  { kind: "ball", size: 44, tint: "#b9e8a1", icon: "coffee" },
  { kind: "pill", text: "1,878 STARTUPS MAPPED", tint: "#ffb37a" },
  { kind: "ball", size: 56, tint: "#a8d5ff", icon: "pin" },
  { kind: "pill", text: "SOPs THAT STICK", tint: "#b9e8a1" },
  { kind: "pill", text: "1,500+ LISTENERS/EP", tint: "#e5d3ff" },
  { kind: "ball", size: 50, tint: "#f7c5d0", icon: "check" },
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

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();

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

          const bodies = items.map((item, i) => {
            const el = itemRefs.current[i];
            if (!el) return null;
            // Spread the drop across the band, and start high enough that the
            // first bodies enter from the top of the viewport rather than
            // popping in just above the landing zone.
            const x = width * (0.08 + 0.84 * ((i + 0.5) / items.length));
            const y = -280 - i * 95;
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
      },
      { threshold: 0.35 },
    );

    io.observe(band);
    return () => {
      cancelled = true;
      io.disconnect();
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
                ? "mono flex items-center rounded-full px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap"
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
              <span className="mono px-6 text-sm tracking-[0.18em] text-muted">
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
