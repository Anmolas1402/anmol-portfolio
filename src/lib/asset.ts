/**
 * Prefixes a file in public/ with the deployment's base path.
 *
 * GitHub Pages serves a project repo from /<repo>, so a root-absolute path
 * like "/anmol.png" resolves against the domain root and 404s. next/image
 * does not rewrite these for us once the optimiser is off, so the paths from
 * content.ts have to be prefixed where they are used.
 *
 * On the apex domain the base path is empty and this returns the path as-is.
 */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
