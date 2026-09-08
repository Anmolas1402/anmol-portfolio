import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <Reveal>
      <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          {/* Constrained and balanced: unbounded, a long title runs the full
              column and orphans its last word on a second line. */}
          <h2 className="display mt-3 max-w-[15ch] text-[clamp(2.2rem,6vw,4rem)] text-balance text-paper">
            {title}
          </h2>
        </div>
        {note && (
          <p className="max-w-sm text-sm leading-relaxed text-muted">{note}</p>
        )}
      </div>
    </Reveal>
  );
}
