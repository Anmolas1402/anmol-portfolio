import type { NextConfig } from "next";

// GitHub Pages serves a project repo from /<repo>, so the build needs that
// prefix baked in. Deploying to the custom domain serves from the root
// instead, so leave PAGES_BASE_PATH unset there and the prefix disappears.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Pages has no Node server, so everything has to be prerendered to HTML.
  output: "export",
  // Without a server there is no image optimiser either; ship the files as-is.
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
