"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopAppBar() {
  const pathname = usePathname();

  const isLiveMap = pathname?.includes("/live-map");
  const isAnalytics = pathname?.includes("/global-analytics");

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm flex justify-between items-center h-16 px-container-margin">
      <div className="flex items-center gap-xl">
        <img src="/images/vfluxion-logo-frontend.png" alt="V-fluxion Logo" className="h-16 w-auto brightness-0 invert" />

        {/* Top Nav Links (Desktop) */}
        <nav className="hidden md:flex gap-lg">
          <Link
            href="/cpo/live-map"
            className={`font-label-md text-label-md pb-2 cursor-pointer transition-all duration-300 ${isLiveMap
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-surface hover:bg-primary/10 px-sm py-xs rounded-DEFAULT"
              }`}
          >
            V2G Live Map
          </Link>
          <Link
            href="/cpo/global-analytics"
            className={`font-label-md text-label-md pb-2 cursor-pointer transition-all duration-300 ${isAnalytics
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-surface hover:bg-primary/10 px-sm py-xs rounded-DEFAULT"
              }`}
          >
            Global Analytics
          </Link>
        </nav>
      </div>

      {/* Search and Trailing Icons */}
      <div className="flex items-center gap-md">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">search</span>
          <input
            type="text"
            className="bg-surface-container-highest/40 border border-outline-variant/30 rounded-DEFAULT py-xs pl-xl pr-sm text-label-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 w-48 transition-colors"
            placeholder="Search Assets..."
          />
        </div>
        <div className="flex gap-sm">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-primary/10">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-primary/10">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-primary/10">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
