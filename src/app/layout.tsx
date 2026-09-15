import type { Metadata } from "next";
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
 * The address the site is actually served from. Share images and canonical
 * links are resolved against it, so it must be a domain that resolves — it
 * previously pointed at anmolsethi.com, which does not exist, and every link
 * preview would have pulled its image from nowhere. Override with
 * NEXT_PUBLIC_SITE_URL once a custom domain is attached.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://anmol-portfolio-nu.vercel.app";

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
    </html>
  );
}
