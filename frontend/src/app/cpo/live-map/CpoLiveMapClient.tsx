"use client";

import dynamic from "next/dynamic";

const TripsLiveMap = dynamic(
  () => import("@/components/cpo/TripsLiveMap").then((module) => module.TripsLiveMap),
  { ssr: false }
);

export function CpoLiveMapClient() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[color:var(--ue-surface)] text-[color:var(--ue-text)]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <TripsLiveMap />
        </div>
        <div className="pointer-events-none absolute inset-0 data-grid opacity-15" />
      </div>

      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[color:var(--ue-outline-variant)]/40 bg-[color:var(--ue-surface)]/80 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[color:var(--ue-primary-strong)]/15 text-[color:var(--ue-primary-strong)]">
            <span className="material-symbols-outlined">electric_bolt</span>
          </div>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-[color:var(--ue-text-muted)]">
              CPO Live Map
            </p>
            <h1 className="font-display text-lg tracking-tight text-[color:var(--ue-primary)]">V2G Command</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <button className="font-display text-xs uppercase tracking-[0.18em] text-[color:var(--ue-primary)]">
            Live Map
          </button>
          <button className="font-display text-xs uppercase tracking-[0.18em] text-[color:var(--ue-text-muted)] hover:text-[color:var(--ue-text)]">
            Global Analytics
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-primary-strong)]/10 hover:text-[color:var(--ue-primary)]">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="rounded-full p-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-primary-strong)]/10 hover:text-[color:var(--ue-primary)]">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="rounded-full p-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-primary-strong)]/10 hover:text-[color:var(--ue-primary)]">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <aside className="group fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-20 flex-col gap-4 border-r border-[color:var(--ue-outline-variant)]/40 bg-[color:var(--ue-surface-container-low)]/70 py-6 backdrop-blur-xl transition-all duration-500 hover:w-64 md:flex">
        <div className="flex items-center gap-3 px-4 text-[color:var(--ue-text-muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--ue-primary-strong)]/20 text-[color:var(--ue-primary)]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="text-xs">
            <p className="font-display text-[color:var(--ue-text)]">CPO Admin</p>
            <p className="text-[color:var(--ue-text-muted)]">Zone Alpha-7</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-2">
          <button className="flex items-center gap-3 rounded-lg bg-[color:var(--ue-primary-strong)]/20 px-3 py-2 text-[color:var(--ue-primary)]">
            <span className="material-symbols-outlined">map</span>
            <span className="text-xs uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Map View
            </span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-surface-container)]/60 hover:text-[color:var(--ue-text)]">
            <span className="material-symbols-outlined">electric_car</span>
            <span className="text-xs uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Fleet Status
            </span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-surface-container)]/60 hover:text-[color:var(--ue-text)]">
            <span className="material-symbols-outlined">bolt</span>
            <span className="text-xs uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Grid Load
            </span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-surface-container)]/60 hover:text-[color:var(--ue-text)]">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-xs uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Revenue
            </span>
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-[color:var(--ue-text-muted)] hover:bg-[color:var(--ue-surface-container)]/60 hover:text-[color:var(--ue-text)]">
            <span className="material-symbols-outlined">security</span>
            <span className="text-xs uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Safety
            </span>
          </button>
        </nav>

        <div className="px-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--ue-error)]/40 bg-[color:var(--ue-error)]/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--ue-error)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="material-symbols-outlined">warning</span>
            Emergency Shutdown
          </button>
        </div>
      </aside>

      <section className="absolute right-8 top-24 z-30 min-w-[240px] rounded-xl glass-panel luminous-border px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--ue-outline-variant)]/40 pb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--ue-text-muted)]">
            Current Grid Price
          </span>
          <span className="material-symbols-outlined text-[color:var(--ue-primary)]">show_chart</span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-2xl text-[color:var(--ue-primary)]">$0.24</span>
          <span className="text-xs text-[color:var(--ue-text-muted)]">/kWh</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[color:var(--ue-secondary)]/30 bg-[color:var(--ue-secondary)]/10 px-2 py-1 text-xs text-[color:var(--ue-secondary)]">
          <span className="material-symbols-outlined">trending_down</span>
          -0.02 vs 1h ago
        </div>
      </section>
    </main>
  );
}
