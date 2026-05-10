import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./cpo-theme.css";
import "maplibre-gl/dist/maplibre-gl.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export default function CpoLayout({ children }: { children: ReactNode }) {
  return (
    <section className={`${displayFont.variable} ${bodyFont.variable} urban-energy min-h-screen w-full`}>
      {children}
    </section>
  );
}
