import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Replaces the Create Next App favicon, which had been the tab icon since the
 * first commit. A monogram on the site's ground, in its display face, with the
 * accent carried by the second letter.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const display = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff",
    ),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080a",
          borderRadius: 16,
          fontFamily: "Bricolage",
          fontSize: 34,
          letterSpacing: "-0.06em",
          color: "#f4f5f7",
        }}
      >
        A<span style={{ color: "#ff5a1f" }}>S</span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bricolage", data: display, style: "normal", weight: 800 }],
    },
  );
}
