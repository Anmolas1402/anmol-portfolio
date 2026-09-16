"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum on the wheel: the page eases to a stop instead of jumping by the
 * notch. Lenis still drives the real window scroll position, so sticky
 * sections, `useScroll` and IntersectionObserver keep working unchanged.
 *
 * Touch is left native — phones already have momentum, and re-simulating it
 * feels laggy under a finger. Reduced motion skips it entirely.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Wheel smoothing only means anything with a mouse or trackpad. On a
    // phone Lenis leaves touch native anyway, so all it would add is a
    // requestAnimationFrame loop running for the whole visit.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // In-page links (#work, #about…) glide instead of cutting. No offset of
      // its own: Lenis already honours each section's scroll-mt-24, and adding
      // one here counted the nav's clearance twice.
      anchors: true,
    });

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
