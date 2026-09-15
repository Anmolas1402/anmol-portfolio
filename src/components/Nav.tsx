"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Avatar } from "./Avatar";
import { composeUrl, person } from "@/lib/content";

/** 18px stroked glyphs, one viewBox, so they sit on the text baseline evenly. */
const ICONS = {
  folder: <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h3.2l1.6 2h7.2A1.5 1.5 0 0 1 18 9.5v7A1.5 1.5 0 0 1 16.5 18h-12A1.5 1.5 0 0 1 3 16.5v-9z" />,
  smiley: (
    <>
      <circle cx="10.5" cy="12" r="7.2" />
      <path d="M7.9 13.6a3.4 3.4 0 0 0 5.2 0" />
      <path d="M8.6 9.7h.01M12.4 9.7h.01" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.3" y="8" width="14.4" height="10" rx="1.6" />
      <path d="M8 8V6.6A1.6 1.6 0 0 1 9.6 5h1.8A1.6 1.6 0 0 1 13 6.6V8" />
    </>
  ),
  doc: (
    <>
      <path d="M6 4.5h5.5L15 8v11.5H6z" />
      <path d="M11.3 4.6V8H15" />
    </>
  ),
  mail: (
    <>
      <rect x="2.8" y="6" width="15.4" height="12" rx="2" />
      <path d="M3.4 7.2l7.1 5.3 7.1-5.3" />
    </>
  ),
} as const;

const links = [
  { href: "#work", label: "Work", icon: "folder" as const },
  { href: "#about", label: "About", icon: "smiley" as const },
  { href: "#experience", label: "Experience", icon: "briefcase" as const },
];

/** How far the page must move in one direction before the nav reacts. */
const THRESHOLD = 8;
/** Near the top there is room for the full nav, so it never compacts here. */
const TOP_ZONE = 120;

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function Glyph({ name, show }: { name: keyof typeof ICONS; show: boolean }) {
  return (
    <svg
      viewBox="0 0 21 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      // On a phone the expanded nav is names only — there is no room for both
      // — so icons only appear there once it compacts.
      className={`size-[16px] shrink-0 ${show ? "block" : "hidden sm:block"}`}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

/**
 * Collapses to zero width by animating the grid track rather than `width`,
 * which cannot transition to or from `auto`. The text stays in the DOM, so it
 * never reflows while it slides away.
 */
function Label({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <span
      className={`grid transition-[grid-template-columns,opacity] duration-[750ms] ${ease} motion-reduce:transition-none ${
        open ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
      }`}
    >
      <span className="overflow-hidden whitespace-nowrap">{children}</span>
    </span>
  );
}

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  // Pointing at or tabbing into a compact nav opens it back up, so nobody has
  // to scroll up just to read a label.
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      setSolid(y > 40);

      if (y < TOP_ZONE) {
        setScrolledDown(false);
        lastY = y;
        return;
      }
      // Only a deliberate move flips the state. lastY is only advanced once
      // the threshold is crossed, so a slow scroll still accumulates — and a
      // trackpad's small back-and-forth jitter never makes the nav flicker.
      if (Math.abs(dy) >= THRESHOLD) {
        setScrolledDown(dy > 0);
        lastY = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const compact = scrolledDown && !engaged;
  const open = !compact;

  const item = `font-display relative flex items-center rounded-full py-1.5 font-bold tracking-[-0.01em] text-white transition-[padding,gap,background-color] duration-[750ms] ${ease} hover:bg-white/10 ${
    compact
      ? "gap-0 px-2 sm:px-2.5"
      : "gap-1 px-1.5 text-[13.5px] sm:px-3 sm:text-[17px]"
  }`;

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`fixed inset-x-0 z-50 flex justify-center px-4 transition-[top] duration-[750ms] ${ease} ${
        compact ? "top-4" : "top-8"
      }`}
    >
      <div
        onMouseEnter={() => setEngaged(true)}
        onMouseLeave={() => setEngaged(false)}
        onFocus={() => setEngaged(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setEngaged(false);
        }}
        className={`glass flex items-center rounded-full backdrop-saturate-[185%] transition-[padding,gap,background-color] duration-[750ms] ${ease} ${
          compact ? "gap-0.5 p-1.5" : "gap-0 p-2 pl-2 sm:gap-0.5 sm:p-3 sm:pl-3.5"
        } ${
          solid
            ? "glass-solid backdrop-blur-[30px] backdrop-saturate-[200%]"
            : "backdrop-blur-[22px]"
        }`}
      >
        <a
          href="#top"
          className="relative hidden transition hover:brightness-110 sm:flex"
          aria-label="Back to top"
        >
          <Avatar
            className={`text-[11px] transition-[width,height] duration-[750ms] ${ease} ${
              compact ? "size-8" : "size-10"
            }`}
          />
        </a>
        {links.map((l) => (
          <a key={l.href} href={l.href} aria-label={l.label} className={item}>
            <Glyph name={l.icon} show={compact} />
            <Label open={open}>{l.label}</Label>
          </a>
        ))}
        <a href={person.resume} aria-label="Resume" className={item}>
          <Glyph name="doc" show={compact} />
          <Label open={open}>Resume</Label>
        </a>
        <a
          href={composeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Get in Touch"
          className={`font-display relative ml-0.5 flex items-center rounded-full bg-paper py-1.5 font-bold tracking-[-0.01em] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.10),0_2px_10px_rgba(0,0,0,0.35)] transition-[padding,background-color] duration-[750ms] ${ease} hover:bg-white sm:ml-1 ${
            compact
              ? "px-2.5"
              : "px-2.5 text-[13.5px] sm:px-4 sm:text-[17px]"
          }`}
        >
          {/* Compact, the CTA keeps its white pill but becomes an envelope, so
              it still reads as the one primary action in the bar. */}
          <svg
            viewBox="0 0 21 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`size-[16px] shrink-0 ${compact ? "block" : "hidden"}`}
            aria-hidden
          >
            {ICONS.mail}
          </svg>
          <Label open={open}>
            <span className="hidden sm:inline">Get in Touch</span>
            <span className="sm:hidden">Contact</span>
          </Label>
        </a>
      </div>
    </motion.nav>
  );
}
