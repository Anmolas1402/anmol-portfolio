import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Home-screen icon on iOS. Same monogram as the favicon, at 180px. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          fontFamily: "Bricolage",
          fontSize: 92,
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
