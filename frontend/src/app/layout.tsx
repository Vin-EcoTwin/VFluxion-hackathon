import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const displayFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Rajdhani({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "EcoTwin - Digital Twin V2G Hanoi",
  description: "Cyberpunk control center for V2G simulation in Hanoi city core"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${displayFont.variable} ${bodyFont.variable} bg-cyber-bg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
