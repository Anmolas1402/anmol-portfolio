"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A band of metric pills that drop in under gravity, pile up, and can be
 * grabbed and thrown. Matter.js runs the simulation; the pills themselves stay
 * real DOM nodes positioned from their bodies each frame, so the text stays
 * selectable-crisp and accessible rather than being painted into a canvas.
 *
 * Matter is imported dynamically and only once the band scrolls into view — it
 * is the heaviest dependency on the site and the hero must not wait for it.
 */

type Pill = { text: string; tint: string; ink?: string };

const PILLS: Pill[] = [
  { text: "500K STUDENTS", tint: "#f5ce78" },
  { text: "1 → 14 EXAMS", tint: "#6dc7ba" },
  { text: "99.4% ACCURATE", tint: "#c3afff" },
  { text: "30+ TEAM", tint: "#f79c77" },
  { text: "100+ INTERNS HIRED", tint: "#f7c5d0" },
  { text: "2 L PAYING STUDENTS", tint: "#a8d5ff" },
  { text: "1,878 STARTUPS MAPPED", tint: "#ffb37a" },
  { text: "SOPs THAT STICK", tint: "#b9e8a1" },
  { text: "1,500+ LISTENERS/EP", tint: "#e5d3ff" },
];

export function PhysicsPills() {
  const bandRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  // "idle" until we know which we can do; "static" honours reduced motion.
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
          // No gravity, no drag — just lay the pills out and leave them alone.
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

          const bodies = PILLS.map((_, i) => {
            const el = pillRefs.current[i];
            if (!el) return null;
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            return M.Bodies.rectangle(
              // Spread the drop across the band and start above it, so they
              // fall in rather than appearing already stacked.
              width * (0.12 + 0.76 * ((i + 0.5) / PILLS.length)),
              -120 - i * 90,
              w,
              h,
              {
                chamfer: { radius: h / 2 },
                restitution: 0.45,
                friction: 0.35,
                frictionAir: 0.012,
                angle: (Math.random() - 0.5) * 0.6,
              },
            );
          });

          const walls = [
            M.Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
            M.Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
            M.Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
          ];

          const pillBodies = bodies.filter((b): b is NonNullable<typeof b> => !!b);
          M.Composite.add(engine.world, [...walls, ...pillBodies]);

          // Drag and throw. Matter's mouse wheel handler swallows page scroll,
          // so remove it — the band sits mid-page and must not trap the user.
          const mouse = M.Mouse.create(band);
          band.removeEventListener("wheel", (mouse as unknown as {
            mousewheel: (e: Event) => void;
          }).mousewheel);
          const drag = M.MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.18, render: { visible: false } },
          });
          M.Composite.add(engine.world, drag);

          let raf = 0;
          let last = performance.now();
          const frame = (now: number) => {
            // Clamped delta: a backgrounded tab would otherwise resume with a
            // huge step and fire every pill through the floor.
            const dt = Math.min(now - last, 32);
            last = now;
            M.Engine.update(engine, dt);
            for (let i = 0; i < pillBodies.length; i++) {
              const el = pillRefs.current[i];
              if (!el) continue;
              const { position: p, angle } = pillBodies[i];
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
            M.Body.setPosition(walls[2], { x: w + WALL / 2, y: height / 2 });
            M.Body.setPosition(walls[0], { x: w / 2, y: height + WALL / 2 });
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
      { rootMargin: "120px" },
    );

    io.observe(band);
    return () => {
      cancelled = true;
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <section
      aria-label="Career numbers, as a pile of draggable pills"
      className="relative border-y border-line bg-ink-2/30"
    >
      <div
        ref={bandRef}
        className={
          mode === "static"
            ? "flex flex-wrap items-center justify-center gap-3 px-5 py-12"
            : "relative h-[32svh] min-h-[240px] w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"
        }
      >
        {PILLS.map((p, i) => (
          <div
            key={p.text}
            ref={(el) => {
              pillRefs.current[i] = el;
            }}
            className={`mono flex items-center rounded-full px-5 py-3 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] ${
              mode === "static" ? "" : "absolute top-0 left-0"
            }`}
            style={{
              background: p.tint,
              color: p.ink ?? "#08080a",
              ...(mode === "static"
                ? { transform: `rotate(${(i % 2 ? 1 : -1) * 2}deg)` }
                : {
                    willChange: "transform",
                    // React owns opacity, the simulation owns transform. If
                    // React also set transform, the re-render that flips mode
                    // to "live" would reset every pill for one frame.
                    opacity: mode === "live" ? 1 : 0,
                  }),
            }}
          >
            {p.text}
          </div>
        ))}
      </div>

      {mode === "live" && (
        <p className="mono pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] tracking-[0.2em] text-muted/60">
          DRAG THEM AROUND
        </p>
      )}
    </section>
  );
}
