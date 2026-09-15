import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import { person } from "@/lib/content";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

// One serif, used only for the italic accent inside a display line — the
// reference does the same. It is not a fourth body font.
const accentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

/**
 * The address the site is served from. Share images and canonical links are
 * resolved against it, so it must be a domain that actually resolves — an
 * earlier value, anmolsethi.com, never existed. The vercel.app address still
 * serves the site, but canonical points here so search and link previews
 * settle on one URL.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://anmolsethi.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${person.name} — ${person.role}`,
  description: person.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${person.name} — ${person.role}`,
    description: person.tagline,
    url: "/",
    siteName: person.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.role}`,
    description: person.tagline,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${accentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
      {/* Google Analytics, only once a measurement ID is configured in Vercel.
          Loaded after hydration by the component, so it never holds up the
          first paint. */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
