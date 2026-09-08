import Image from "next/image";

/**
 * A square logo tile. Falls back to a monogram when no mark is available, so a
 * missing file degrades to something deliberate rather than a broken image.
 */
export function Logo({
  src,
  bg,
  name,
  className = "size-14",
}: {
  src?: string;
  bg?: string;
  name: string;
  className?: string;
}) {
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!src) {
    return (
      <span
        className={`mono grid shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/6 text-sm font-semibold text-paper ${className}`}
        aria-hidden
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-2xl border border-white/10 ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="56px"
        className={bg ? "object-contain p-2" : "object-cover"}
      />
    </span>
  );
}
