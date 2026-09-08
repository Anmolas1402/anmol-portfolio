import Image from "next/image";
import { person } from "@/lib/content";

/**
 * Falls back to a monogram until a photo exists at the path in content.ts.
 * Drop a square headshot at public/anmol.jpg and set `photo` to use it.
 */
export function Avatar({ className = "" }: { className?: string }) {
  if (!person.photo) {
    return (
      <span
        className={`mono grid place-items-center rounded-full border border-white/12 bg-white/6 font-semibold ${className}`}
      >
        AS
      </span>
    );
  }
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full border border-white/12 ${className}`}
    >
      <Image
        src={person.photo}
        alt={person.name}
        fill
        sizes="64px"
        className="object-cover"
        priority
      />
    </span>
  );
}
