import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

// Classic editorial display serif (variable, optical sizing) + an expressive
// single-weight italic serif for accents. The 2026 serif-revival pairing.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const url = "https://tanushsinghal.dev";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: `${profile.name} — ${profile.roleLine}`,
  description: profile.intro,
  keywords: [
    profile.name,
    "Backend Engineer",
    "AI Engineer",
    "Software Engineer",
    "Portfolio",
    "BITS Pilani",
  ],
  authors: [{ name: profile.name, url: profile.socials.linkedin }],
  openGraph: {
    title: `${profile.name} — ${profile.roleLine}`,
    description: profile.tagline,
    url,
    siteName: `${profile.name} · Portfolio`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.roleLine}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0f16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable} ${display.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
