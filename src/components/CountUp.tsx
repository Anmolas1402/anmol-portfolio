"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const NUMBER = /\d[\d,]*(?:\.\d+)?/g;

/**
 * Counts the figure in a label up from zero the first time it scrolls into
 * view — "500K+", "99.4%", "1,409", "~10 L", "0 → 500K" all work. The last
 * number in the string is the one that moves; everything around it (prefix,
 * unit, arrow) stays put, and the original decimals and thousands separators
 * are kept throughout, so the width barely shifts.
 *
 * The count writes straight to the DOM rather than through state: forty
 * re-renders a second per figure would be pure waste. Screen readers get the
 * final value from a visually hidden copy and never hear the ticking.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const matches = [...value.matchAll(NUMBER)];
    const match = matches[matches.length - 1];
    if (!match || match.index === undefined) return;

    const raw = match[0];
    const target = parseFloat(raw.replace(/,/g, ""));
    if (!target) return;
    // "1 → 14" climbs from its own left-hand number, not from zero — otherwise
    // it reads "1 → 0" before it starts, which is a claim nobody made.
    const from =
      value.includes("→") && matches.length > 1
        ? parseFloat(matches[0][0].replace(/,/g, ""))
        : 0;

    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const grouped = raw.includes(",");
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + raw.length);
    const format = (n: number) =>
      before +
      (grouped
        ? n.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : n.toFixed(decimals)) +
      after;

    if (!inView) {
      // Off screen: park at zero so the count is there to be seen.
      el.textContent = format(from);
      return;
    }

    const controls = animate(from, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
