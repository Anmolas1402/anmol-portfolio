"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A taped print, tilted slightly off square. The tape is two translucent
 * strips rather than an image, so it stays crisp at any size.
 *
 * Falls back to a labelled empty frame when the photo is missing, so a missing
 * file looks deliberate instead of broken.
 */
export function Polaroid({
  src,
  name,
  className = "",
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;

  return (
    <div className={`relative ${className}`}>
      {/* Tape, one strip over each top corner, angled inwards. */}
      {[
        { left: "6%", rotate: "-38deg" },
        { right: "6%", rotate: "38deg" },
      ].map((t, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute -top-4 z-10 h-11 w-24 bg-white/12 backdrop-blur-[1px]"
          style={{
            ...t,
            transform: `rotate(${t.rotate})`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.35)",
          }}
        />
      ))}

      <div className="rotate-[1.6deg] bg-[#f6f5f1] p-3.5 pb-4 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e7e4dc]">
          {show ? (
            <Image
              src={src}
              alt={name}
              fill
              sizes="(max-width: 1024px) 80vw, 420px"
              className="object-cover"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-[13px] text-neutral-500">
              Drop a portrait at
              <br />
              <span className="mono">public/anmol-portrait.jpg</span>
            </div>
          )}
        </div>
        <div className="pt-3 pb-1 text-center text-[13px] text-neutral-500">
          {name}
        </div>
      </div>
    </div>
  );
}
