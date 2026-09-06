"use client";

import { useEffect, useRef, useState } from "react";
import pins from "@/lib/ncr-pins.json";

type Pt = [lat: number, lng: number, verified: 0 | 1, hiring: 0 | 1];
const PTS = pins.pts as Pt[];

// Bounds taken from the dataset itself, so the dots fill the frame instead of
// collapsing into the middle of an oversized box.
const LAT = [28.355, 28.72] as const;
const LNG = [76.9, 77.5] as const;
const LAT_MID = (LAT[0] + LAT[1]) / 2;
// Longitude degrees are shorter than latitude ones at 28°N. Correcting for it is
// the difference between NCR's real shape and a stretched blob.
const KX = Math.cos((LAT_MID * Math.PI) / 180);

const SPAN_X = (LNG[1] - LNG[0]) * KX;
const SPAN_Y = LAT[1] - LAT[0];
const SPAN = Math.max(SPAN_X, SPAN_Y);

/**
 * Every dot is one real company from ncrhiring.in — solid orange if its address
 * is verified against Google Maps, faint white if it's a city-level guess from a
 * job posting. Canvas, because 1,760 DOM nodes is not a plan.
 */
export function PinOrb({
  className = "",
  fill = 0.98,
  dotScale = 1,
  parallax = 9,
}: {
  className?: string;
  /** How much of the diameter the data spans. >1 crops the edges. */
  fill?: number;
  dotScale?: number;
  parallax?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let size = 0;
    const start = performance.now();
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = wrap.clientWidth || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      target.x = ((e.clientX - (r.left + r.width / 2)) / r.width) * 2;
      target.y = ((e.clientY - (r.top + r.height / 2)) / r.height) * 2;
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const intro = reduced ? 1 : Math.min(t / 1.5, 1);
      eased.x += (target.x - eased.x) * 0.06;
      eased.y += (target.y - eased.y) * 0.06;

      ctx.clearRect(0, 0, size, size);
      const r = size / 2;
      // One shared scale for both axes keeps NCR's real proportions.
      const scale = (size * fill) / SPAN;
      // Dots scale with the orb: legible at 86px in the headline, still crisp big.
      const rBase = Math.max(0.75, (size / 86) * 1.05) * dotScale;

      for (let i = 0; i < PTS.length; i++) {
        const [lat, lng, verified, hiring] = PTS[i];
        const depth = verified ? 1 : 0.5;
        const x =
          r + ((lng - LNG[0]) * KX - SPAN_X / 2) * scale + eased.x * parallax * depth;
        const y =
          r - (lat - LAT_MID) * scale + eased.y * parallax * depth;

        const dx = x - r;
        const dy = y - r;
        const dist = Math.hypot(dx, dy);
        if (dist > r - 1.5) continue; // clip to the circle so it reads as an "O"

        // Reveal outward from the centre.
        const a = Math.max(
          0,
          Math.min(1, (intro - (dist / r) * 0.5) / 0.45),
        );
        if (a <= 0) continue;

        if (verified) {
          const pulse = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 1.2 + i * 0.9);
          ctx.beginPath();
          ctx.arc(x, y, rBase * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 122, 60, ${a * pulse})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, rBase * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 232, 240, ${a * (hiring ? 0.55 : 0.3)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    setReady(true);
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [fill, dotScale, parallax]);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square overflow-hidden rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(255,90,31,0.14), rgba(255,90,31,0.02) 55%, transparent 72%), #08080a",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 0 50px rgba(255,90,31,0.10), 0 0 70px rgba(255,90,31,0.14)",
      }}
      aria-label={`${pins.total} startups across Delhi NCR, plotted from live data`}
      role="img"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
