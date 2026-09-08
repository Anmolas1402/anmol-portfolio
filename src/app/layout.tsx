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

export const metadata: Metadata = {
  metadataBase: new URL("https://anmolsethi.com"),
  title: `${person.name} — ${person.role}`,
  description: person.tagline,
  openGraph: {
    title: `${person.name} — ${person.role}`,
    description: person.tagline,
    type: "website",
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
