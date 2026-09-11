"use client";

import { useEffect, useState } from "react";
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
} as const;

const links = [
  { href: "#work", label: "Work", icon: "folder" as const },
  { href: "#about", label: "About", icon: "smiley" as const },
  // Too many pills overflow a 375px screen, so this one waits for room.
  { href: "#experience", label: "Experience", icon: "briefcase" as const, wide: true },
];

function Glyph({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      viewBox="0 0 21 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[16px] shrink-0 opacity-100"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-8 z-50 flex justify-center px-4"
    >
      <div
        className={`glass flex items-center gap-0.5 rounded-full p-3 pl-3.5 backdrop-saturate-[185%] transition-all duration-300 ${
          solid
            ? "glass-solid backdrop-blur-[30px] backdrop-saturate-[200%]"
            : "backdrop-blur-[22px]"
        }`}
      >
        <a
          href="#top"
          className="relative flex transition hover:brightness-110"
          aria-label="Back to top"
        >
          <Avatar className="size-10 text-[11px]" />
        </a>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`relative flex items-center gap-1 rounded-full font-display px-3 py-1.5 text-[17px] font-bold tracking-[-0.01em] text-white transition-colors hover:bg-white/10 ${
              l.wide ? "hidden sm:flex" : ""
            }`}
          >
            <Glyph name={l.icon} />
            {l.label}
          </a>
        ))}
        <a
          href={person.resume}
          className="font-display relative hidden items-center gap-1 rounded-full px-3 py-1.5 text-[17px] font-bold tracking-[-0.01em] text-white transition-colors hover:bg-white/10 sm:flex"
        >
          <Glyph name="doc" />
          Resume
        </a>
        <a
          href={composeUrl}
          target="_blank"
          rel="noreferrer"
          className="font-display relative ml-1 flex items-center gap-2 rounded-full bg-paper px-4 py-1.5 text-[17px] font-bold tracking-[-0.01em] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.10),0_2px_10px_rgba(0,0,0,0.35)] transition hover:bg-white"
        >
          <span className="hidden sm:inline">Get in Touch</span>
          <span className="sm:hidden">Contact</span>
        </a>
      </div>
    </motion.nav>
  );
}
