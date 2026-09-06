"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { person } from "@/lib/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  // Too many pills overflow a 375px screen, so this one waits for room.
  { href: "#experience", label: "Experience", wide: true },
];

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
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div
        className={`flex items-center gap-1 rounded-full border p-1.5 pl-2 backdrop-blur-xl transition-colors duration-300 ${
          solid
            ? "border-white/12 bg-black/70"
            : "border-white/8 bg-white/[0.03]"
        }`}
      >
        <a
          href="#top"
          className="mono flex size-9 items-center justify-center rounded-full bg-white/8 text-[11px] font-semibold tracking-tight text-paper transition hover:bg-white/14"
          aria-label="Back to top"
        >
          AS
        </a>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/6 hover:text-paper sm:px-4 ${
              l.wide ? "hidden sm:block" : ""
            }`}
          >
            {l.label}
          </a>
        ))}
        <a
          href={person.resume}
          className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/6 hover:text-paper sm:block"
        >
          Resume
        </a>
        <a
          href={`mailto:${person.email}`}
          className="ml-1 flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white"
        >
          <span className="hidden sm:inline">Get in touch</span>
          <span className="sm:hidden">Contact</span>
        </a>
      </div>
    </motion.nav>
  );
}
