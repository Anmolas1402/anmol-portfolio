"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import snapshot from "@/lib/ncr-pins.json";

/** [lat, lng, verified, hiring] */
export type Pt = [number, number, 0 | 1, 0 | 1];
/** [name, area, sector, openJobs] — verified rows only. */
export type Label = [string, string, string, number];

export type Pins = {
  generated: string;
  total: number;
  verified: number;
  hiring: number;
  openJobs: number;
  pts: Pt[];
  labels: Record<string, Label>;
  /** True once the live endpoint has answered. Gates the "live" wording. */
  live: boolean;
};

const SNAPSHOT: Pins = {
  generated: snapshot.generated,
  total: snapshot.total,
  verified: snapshot.verified,
  hiring: snapshot.hiring,
  openJobs: snapshot.openJobs,
  pts: snapshot.pts as Pt[],
  labels: snapshot.labels as unknown as Record<string, Label>,
  live: false,
};

const Ctx = createContext<Pins>(SNAPSHOT);

export const usePins = () => useContext(Ctx);

// Overridable so a staging map, or a local one, can be pointed at during dev.
const ENDPOINT =
  process.env.NEXT_PUBLIC_NCR_STATS ?? "https://ncrhiring.in/api/stats";

/**
 * Serves the committed snapshot immediately, then swaps in live numbers from
 * ncrhiring.in once they arrive.
 *
 * The snapshot is what renders on the server and on first paint, so the map is
 * never empty and the page needs no rebuild to stay correct. The live fetch is
 * best-effort: if it fails, is slow, or returns something malformed, the
 * snapshot simply stays, and `live` stays false so nothing on the page claims
 * to be live when it isn't.
 */
export function PinsProvider({ children }: { children: ReactNode }) {
  const [pins, setPins] = useState<Pins>(SNAPSHOT);

  useEffect(() => {
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 8000);

    fetch(ENDPOINT, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Partial<Pins>) => {
        // Trust nothing: a half-written payload should leave the snapshot alone.
        if (!Array.isArray(d.pts) || d.pts.length < 100) return;
        if (typeof d.total !== "number" || typeof d.verified !== "number") return;
        setPins({
          generated: d.generated ?? SNAPSHOT.generated,
          total: d.total,
          verified: d.verified,
          hiring: d.hiring ?? SNAPSHOT.hiring,
          openJobs: d.openJobs ?? SNAPSHOT.openJobs,
          pts: d.pts as Pt[],
          labels: (d.labels ?? {}) as Record<string, Label>,
          live: true,
        });
      })
      .catch(() => {
        /* Offline, blocked, or the endpoint is down — the snapshot stands. */
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      ac.abort();
    };
  }, []);

  return <Ctx.Provider value={pins}>{children}</Ctx.Provider>;
}
