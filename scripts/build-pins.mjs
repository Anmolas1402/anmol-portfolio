// Rebuilds src/lib/ncr-pins.json from the ncrhiring.in dataset.
//
//   node scripts/build-pins.mjs
//
// The map repo is the source of truth and lives outside this project, so the
// generated file is committed — the portfolio must build without it present.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE =
  process.env.NCR_DATA ??
  resolve(HERE, "../../delhi-ncr-startup-map/data/companies.json");
const OUT = resolve(HERE, "../src/lib/ncr-pins.json");

let raw;
try {
  raw = JSON.parse(readFileSync(SOURCE, "utf8"));
} catch (err) {
  console.error(
    `Could not read the dataset at ${SOURCE}\n` +
      `Set NCR_DATA to companies.json if the map repo lives elsewhere.\n`,
  );
  throw err;
}

// Same scope as ncrhiring.in/api/stats and the Map tab's default view:
// startup-tier companies with coordinates, excluding the tier that sits behind
// the "+ Non-startups" toggle. The snapshot is the fallback for that endpoint,
// so the two must not disagree about what they are counting.
const rows = raw.filter(
  (c) =>
    c.tier !== "company" &&
    typeof c.lat === "number" &&
    typeof c.lng === "number",
);

// Compact tuples: the render loop walks this every frame.
const pts = rows.map((c) => [
  +c.lat.toFixed(4),
  +c.lng.toFixed(4),
  c.approx ? 0 : 1,
  c.hiring ? 1 : 0,
]);

// Only verified pins get a label. An approximate pin sits at a deterministic
// offset from its city centre, so naming the company under the cursor would
// claim a precision the data does not have.
const labels = {};
rows.forEach((c, i) => {
  if (c.approx) return;
  labels[i] = [c.name, c.area ?? "", c.sector ?? "", c.openJobs ?? 0];
});

const areaCounts = {};
for (const c of rows) areaCounts[c.area ?? "Unknown"] = (areaCounts[c.area ?? "Unknown"] ?? 0) + 1;
const areas = Object.entries(areaCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([name, count]) => ({ name, count }));

const out = {
  generated: new Date().toISOString().slice(0, 10),
  total: rows.length,
  verified: rows.filter((c) => !c.approx).length,
  hiring: rows.filter((c) => c.hiring).length,
  openJobs: rows.reduce((sum, c) => sum + (c.openJobs || 0), 0),
  areas,
  labels,
  pts,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out));

console.log(
  `${out.total} companies · ${out.verified} verified · ${out.hiring} hiring · ` +
    `${out.openJobs} open roles · ${(JSON.stringify(out).length / 1024) | 0} KB`,
);
