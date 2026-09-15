import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { person } from "@/lib/content";

/**
 * The card that appears when the link is pasted into LinkedIn, WhatsApp, Slack
 * or X. Without one those previews render as a bare URL, which is the first
 * thing a recruiter sees of the site. It is generated at build, in the site's
 * own display face, from the same headline the hero uses.
 */

export const alt = `${person.name} — I turn complexity into clarity`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "node_modules/@fontsource");

export default async function Image() {
  const [display, body] = await Promise.all([
    readFile(join(fonts, "bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff")),
    readFile(join(fonts, "inter/files/inter-latin-500-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(ellipse 60% 55% at 30% 45%, rgba(255,100,40,0.22), transparent 70%), #08080a",
          color: "#f4f5f7",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, color: "#8b93a1" }}>
          {person.name}
          <span style={{ margin: "0 14px", color: "#3a3d45" }}>/</span>
          Product Ops
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Bricolage",
            fontSize: 112,
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
          }}
        >
          <span>I TURN</span>
          <span style={{ color: "#ff5a1f" }}>COMPLEXITY</span>
          <span>INTO CLARITY</span>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#8b93a1" }}>
          Data pipelines, 0 → 1 features and the systems behind them
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, style: "normal", weight: 800 },
        { name: "Inter", data: body, style: "normal", weight: 500 },
      ],
    },
  );
}
