import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./cpo-theme.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { TopAppBar } from "@/components/cpo/TopAppBar";
import { SideNavBar } from "@/components/cpo/SideNavBar";

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
    <section className={`dark bg-background text-on-surface h-screen w-screen overflow-hidden font-body-md selection:bg-primary-container selection:text-on-primary-container ${displayFont.variable} ${bodyFont.variable}`}>
      <TopAppBar />
      <SideNavBar />
      <main className="absolute top-16 left-0 md:left-20 right-0 bottom-0 z-20 overflow-hidden">
        {children}
      </main>
    </section>
  );
}
