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

type Item =
  | { kind: "pill"; text: string; tint: string }
  | { kind: "ball"; size: number; tint: string };

/** ~24° — the most tilt that still reads cleanly. */
const TILT = 0.42;

const ITEMS: Item[] = [
  { kind: "pill", text: "500K STUDENTS", tint: "#f5ce78" },
  { kind: "ball", size: 26, tint: "#ff7a3c" },
  { kind: "pill", text: "1 → 14 EXAMS", tint: "#6dc7ba" },
  { kind: "ball", size: 16, tint: "#c3afff" },
  { kind: "pill", text: "99.4% ACCURATE", tint: "#c3afff" },
  { kind: "pill", text: "30+ TEAM", tint: "#f79c77" },
  { kind: "ball", size: 32, tint: "#6dc7ba" },
  { kind: "pill", text: "100+ INTERNS HIRED", tint: "#f7c5d0" },
  { kind: "ball", size: 20, tint: "#f5ce78" },
  { kind: "pill", text: "2 L PAYING STUDENTS", tint: "#a8d5ff" },
  { kind: "ball", size: 14, tint: "#b9e8a1" },
  { kind: "pill", text: "1,878 STARTUPS MAPPED", tint: "#ffb37a" },
  { kind: "ball", size: 24, tint: "#a8d5ff" },
  { kind: "pill", text: "SOPs THAT STICK", tint: "#b9e8a1" },
  { kind: "pill", text: "1,500+ LISTENERS/EP", tint: "#e5d3ff" },
  { kind: "ball", size: 18, tint: "#f7c5d0" },
];

export function PhysicsPills() {
  const bandRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  // "idle" until we know what we can do; "static" honours reduced motion.
  const [mode, setMode] = useState<"idle" | "static" | "live">("idle");

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

          const width = band.clientWidth;
          const height = band.clientHeight;
          const WALL = 200; // thick walls so fast throws cannot tunnel out

          const engine = M.Engine.create();
          engine.gravity.y = 1.1;

          const bodies = ITEMS.map((item, i) => {
            const el = itemRefs.current[i];
            if (!el) return null;
            // Spread the drop across the band, and start high enough that the
            // first bodies enter from the top of the viewport rather than
            // popping in just above the landing zone.
            const x = width * (0.08 + 0.84 * ((i + 0.5) / ITEMS.length));
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
                ITEMS[i].kind === "pill" &&
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
        {ITEMS.map((item, i) => (
          <div
            key={item.kind === "pill" ? item.text : `ball-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            aria-hidden={item.kind === "ball"}
            className={`${
              item.kind === "pill"
                ? "mono flex items-center rounded-full px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap"
                : "rounded-full"
            } shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] ${
              isStatic ? "" : "pointer-events-none absolute top-0 left-0"
            }`}
            style={{
              background: item.tint,
              color: "#08080a",
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
            {item.kind === "pill" ? item.text : null}
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
