"use client";

import type { DashboardMetrics, TwinThing } from "@/features/digitalTwin/types/twin";

type TwinSidebarDashboardProps = {
  metrics: DashboardMetrics;
  running: boolean;
  loading: boolean;
  syncError: string | null;
  onRefresh: () => Promise<void>;
  onToggleSimulation: () => void;
  onStep: () => void;
  selectedThing: TwinThing | null;
};

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function TwinSidebarDashboard({
  metrics,
  running,
  loading,
  syncError,
  onRefresh,
  onToggleSimulation,
  onStep,
  selectedThing
}: TwinSidebarDashboardProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-3 overflow-auto bg-[var(--dashboard-background)] p-4 text-[var(--text-primary)]">
      <section className="rounded-lg border border-[color:var(--app-border)] bg-[var(--panel-background)] p-3 shadow-panel">
        <h3 className="font-[var(--font-display)] text-xs uppercase tracking-[0.16em] text-[var(--accent-primary)]">
          Digital Twin Dashboard
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <article className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-2">
            <p className="text-xs text-[var(--text-muted)]">Total EVs</p>
            <p className="font-[var(--font-display)] text-lg">{metrics.totalEVs}</p>
          </article>
          <article className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-2">
            <p className="text-xs text-[var(--text-muted)]">Stations In Use</p>
            <p className="font-[var(--font-display)] text-lg">{metrics.chargingStationsInUse}</p>
          </article>
          <article className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-2">
            <p className="text-xs text-[var(--text-muted)]">Current Grid Load</p>
            <p className="font-[var(--font-display)] text-lg">{pct(metrics.currentGridLoad)}</p>
          </article>
          <article className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-2">
            <p className="text-xs text-[var(--text-muted)]">Average Battery</p>
            <p className="font-[var(--font-display)] text-lg">{Math.round(metrics.averageBatteryLevel)}%</p>
          </article>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleSimulation}
            className="rounded border border-[color:var(--app-border-strong)] px-3 py-1 text-xs uppercase tracking-[0.12em]"
          >
            {running ? "Pause Simulation" : "Run Simulation"}
          </button>
          <button
            type="button"
            onClick={onStep}
            className="rounded border border-[color:var(--app-border)] px-3 py-1 text-xs uppercase tracking-[0.12em]"
          >
            Step
          </button>
          <button
            type="button"
            onClick={() => {
              void onRefresh();
            }}
            className="rounded border border-[color:var(--app-border)] px-3 py-1 text-xs uppercase tracking-[0.12em]"
          >
            Reload Ditto
          </button>
        </div>

        {loading && <p className="mt-2 text-xs text-[var(--text-muted)]">Loading things from Ditto...</p>}
        {syncError && <p className="mt-2 text-xs text-[var(--warning-text)]">{syncError}</p>}
      </section>

      <section className="rounded-lg border border-[color:var(--app-border)] bg-[var(--panel-background)] p-3 shadow-panel">
        <h3 className="font-[var(--font-display)] text-xs uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
          Selected Object
        </h3>

        {!selectedThing && <p className="mt-2 text-xs text-[var(--text-muted)]">Click a car, station, building, or control center.</p>}

        {selectedThing && (
          <div className="mt-2 space-y-1 text-xs">
            <p>Name: {selectedThing.name}</p>
            <p>Type: {selectedThing.type}</p>
            <p>Thing ID: {selectedThing.thingId}</p>
            <p>
              Position: {selectedThing.position[0].toFixed(6)}, {selectedThing.position[1].toFixed(6)}, alt {selectedThing.position[2].toFixed(1)}
            </p>
            {selectedThing.type === "EV" && (
              <>
                <p>Battery: {Math.round(selectedThing.batteryLevel)}%</p>
                <p>Status: {selectedThing.status}</p>
                <p>Heading: {Math.round(selectedThing.heading)} deg</p>
              </>
            )}
            {selectedThing.type === "CHARGING_STATION" && (
              <>
                <p>Capacity: {selectedThing.capacity}</p>
                <p>Occupied ports: {selectedThing.occupiedPorts}</p>
                <p>Status: {selectedThing.status}</p>
              </>
            )}
            {selectedThing.type === "POWER_SUBSTATION" && (
              <>
                <p>Load: {pct(selectedThing.loadLevel)}</p>
                <p>
                  Power: {selectedThing.currentMw.toFixed(1)} / {selectedThing.maxMw.toFixed(1)} MW
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </aside>
  );
}
