"use client";

import { type FormEvent, useMemo, useState } from "react";
import { HANOI_CORE_CENTER, SCENARIO_PRESETS } from "@/mock/hanoiTwinMock";
import type { CreateChargerInput, CreateEVInput } from "@/hooks/useEntitiesSync";
import { t } from "@/lib/i18n/translations";
import { useEntitiesStore } from "@/stores/entities.store";
import type { EntitiesState } from "@/stores/entities.store";
import { useSimulationStore } from "@/stores/simulation.store";
import type { SimulationState } from "@/stores/simulation.store";
import { useUIStore } from "@/stores/ui.store";
import type { UIState } from "@/stores/ui.store";
import { NeonPanel } from "@/components/ui/cyberpunk/NeonPanel";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

type DashboardPanelProps = {
  sync: {
    isLoading: boolean;
    error: string | null;
    dataSource: "backend" | "mock";
    dittoThingCount: number;
    refresh: () => Promise<void>;
    createEV: (input: CreateEVInput) => Promise<void>;
    createCharger: (input: CreateChargerInput) => Promise<void>;
  };
};

export function DashboardPanel({ sync }: DashboardPanelProps) {
  const { isLoading, error, dataSource, dittoThingCount, refresh, createEV, createCharger } = sync;

  const language = useUIStore((state: UIState) => state.language);

  const evs = useEntitiesStore((state: EntitiesState) => state.evs);
  const chargers = useEntitiesStore((state: EntitiesState) => state.chargers);
  const gridSegments = useEntitiesStore((state: EntitiesState) => state.gridSegments);
  const commandCenter = useEntitiesStore((state: EntitiesState) => state.commandCenter);
  const lastSyncedAt = useEntitiesStore((state: EntitiesState) => state.lastSyncedAt);
  const simulationScenario = useEntitiesStore((state: EntitiesState) => state.simulationScenario);
  const simulationTick = useEntitiesStore((state: EntitiesState) => state.simulationTick);
  const isSimulationRunning = useEntitiesStore((state: EntitiesState) => state.isSimulationRunning);
  const setSimulationScenario = useEntitiesStore((state: EntitiesState) => state.setSimulationScenario);
  const toggleSimulation = useEntitiesStore((state: EntitiesState) => state.toggleSimulation);
  const stepSimulation = useEntitiesStore((state: EntitiesState) => state.stepSimulation);
  const resetSimulation = useEntitiesStore((state: EntitiesState) => state.resetSimulation);

  const events = useSimulationStore((state: SimulationState) => state.events);

  const [evName, setEvName] = useState("Fleet EV");
  const [evLng, setEvLng] = useState(String(HANOI_CORE_CENTER.lng));
  const [evLat, setEvLat] = useState(String(HANOI_CORE_CENTER.lat));
  const [evSoc, setEvSoc] = useState("70");
  const [evSpeed, setEvSpeed] = useState("24");

  const [chargerName, setChargerName] = useState("Charging Station");
  const [chargerLng, setChargerLng] = useState(String(round(HANOI_CORE_CENTER.lng + 0.0011, 6)));
  const [chargerLat, setChargerLat] = useState(String(round(HANOI_CORE_CENTER.lat - 0.0007, 6)));
  const [chargerMaxKw, setChargerMaxKw] = useState("180");
  const [chargerOcc, setChargerOcc] = useState("0.52");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const averageSoc = useMemo(() => {
    if (evs.length === 0) {
      return 0;
    }
    return round(evs.reduce((sum, ev) => sum + ev.soc, 0) / evs.length, 1);
  }, [evs]);

  const averageGridLoad = useMemo(() => {
    if (gridSegments.length === 0) {
      return 0;
    }
    return round(
      (gridSegments.reduce((sum, segment) => sum + segment.loadRatio, 0) / gridSegments.length) * 100,
      1
    );
  }, [gridSegments]);

  const onAddEV = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await createEV({
        name: evName.trim() || "Fleet EV",
        lng: Number(evLng),
        lat: Number(evLat),
        soc: Number(evSoc),
        speedKmh: Number(evSpeed)
      });
      setEvName(`Fleet EV ${evs.length + 1}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to create EV");
    }
  };

  const onAddCharger = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await createCharger({
        name: chargerName.trim() || "Charging Station",
        lng: Number(chargerLng),
        lat: Number(chargerLat),
        maxKw: Number(chargerMaxKw),
        occupancy: Number(chargerOcc)
      });
      setChargerName(`Charging Station ${chargers.length + 1}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to create charger");
    }
  };

  return (
    <section className="h-full w-full overflow-auto bg-[var(--dashboard-background)] p-4 text-[var(--text-primary)]">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NeonPanel title={t(language, "panel.fleet")} accent="cyan">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <article className="rounded-md border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">EV fleet</p>
              <p className="mt-1 font-[var(--font-display)] text-2xl">{evs.length}</p>
            </article>
            <article className="rounded-md border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Average SOC</p>
              <p className="mt-1 font-[var(--font-display)] text-2xl">{averageSoc}%</p>
            </article>
            <article className="rounded-md border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Chargers</p>
              <p className="mt-1 font-[var(--font-display)] text-2xl">{chargers.length}</p>
            </article>
            <article className="rounded-md border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Grid average load</p>
              <p className="mt-1 font-[var(--font-display)] text-2xl">{averageGridLoad}%</p>
            </article>
          </div>

          <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
            <p>{t(language, "map.source")}: {dataSource.toUpperCase()}</p>
            <p>Ditto twins: {dittoThingCount}</p>
            <p>Command center status: {commandCenter.status.toUpperCase()}</p>
            <p>
              Last sync: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString(language === "en" ? "en-US" : "vi-VN") : "n/a"}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              className="rounded border border-[color:var(--app-border-strong)] px-2 py-1 text-xs uppercase tracking-[0.12em] hover:bg-[var(--button-soft-hover)]"
            >
              Refresh Data
            </button>
            {isLoading && <span className="text-xs text-[var(--text-muted)]">Loading...</span>}
          </div>

          {error && <p className="mt-2 text-xs text-[var(--warning-text)]">{error}</p>}
        </NeonPanel>

        <NeonPanel title={t(language, "panel.simulation")} accent="pink">
          <p className="text-xs text-[var(--text-muted)]">
            Choose a scenario and run deterministic updates to animate EV movement, charger occupancy, and grid load.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <label className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Scenario</label>
            <select
              value={simulationScenario}
              onChange={(event) => setSimulationScenario(event.target.value as EntitiesState["simulationScenario"])}
              className="rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] px-2 py-1 text-sm outline-none"
            >
              {SCENARIO_PRESETS.map((scenario) => (
                <option key={scenario.key} value={scenario.key}>
                  {scenario.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--text-muted)]">
              {SCENARIO_PRESETS.find((scenario) => scenario.key === simulationScenario)?.description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={toggleSimulation}
              className="rounded border border-[color:var(--app-border-strong)] px-3 py-1 uppercase tracking-[0.12em] hover:bg-[var(--button-soft-hover)]"
            >
              {isSimulationRunning ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={stepSimulation}
              className="rounded border border-[color:var(--app-border)] px-3 py-1 uppercase tracking-[0.12em] hover:bg-[var(--button-soft-hover)]"
            >
              Step
            </button>
            <button
              type="button"
              onClick={resetSimulation}
              className="rounded border border-[color:var(--app-border)] px-3 py-1 uppercase tracking-[0.12em] hover:bg-[var(--button-soft-hover)]"
            >
              Reset Mock Scene
            </button>
            <span className="text-[var(--text-muted)]">Tick #{simulationTick}</span>
          </div>
        </NeonPanel>

        <NeonPanel title={t(language, "panel.assets")} accent="cyan">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <form onSubmit={onAddEV} className="space-y-2 rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-3">
              <h3 className="font-[var(--font-display)] text-xs uppercase tracking-[0.18em]">Add EV</h3>
              <input
                value={evName}
                onChange={(event) => setEvName(event.target.value)}
                className="w-full rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                placeholder="EV name"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={evLng}
                  onChange={(event) => setEvLng(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Longitude"
                />
                <input
                  value={evLat}
                  onChange={(event) => setEvLat(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Latitude"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={evSoc}
                  onChange={(event) => setEvSoc(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="SOC"
                />
                <input
                  value={evSpeed}
                  onChange={(event) => setEvSpeed(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Speed km/h"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded border border-[color:var(--app-border-strong)] px-3 py-1 text-xs uppercase tracking-[0.12em] hover:bg-[var(--button-soft-hover)]"
              >
                Create EV
              </button>
            </form>

            <form
              onSubmit={onAddCharger}
              className="space-y-2 rounded border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-3"
            >
              <h3 className="font-[var(--font-display)] text-xs uppercase tracking-[0.18em]">Add Charging Station</h3>
              <input
                value={chargerName}
                onChange={(event) => setChargerName(event.target.value)}
                className="w-full rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                placeholder="Station name"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={chargerLng}
                  onChange={(event) => setChargerLng(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Longitude"
                />
                <input
                  value={chargerLat}
                  onChange={(event) => setChargerLat(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Latitude"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={chargerMaxKw}
                  onChange={(event) => setChargerMaxKw(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Max kW"
                />
                <input
                  value={chargerOcc}
                  onChange={(event) => setChargerOcc(event.target.value)}
                  className="rounded border border-[color:var(--app-border)] bg-transparent px-2 py-1 text-sm outline-none"
                  placeholder="Occupancy 0..1"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded border border-[color:var(--app-border-strong)] px-3 py-1 text-xs uppercase tracking-[0.12em] hover:bg-[var(--button-soft-hover)]"
              >
                Create Charger
              </button>
            </form>
          </div>

          {submitError && <p className="mt-2 text-xs text-[var(--warning-text)]">{submitError}</p>}
        </NeonPanel>

        <NeonPanel title={t(language, "panel.stream")} accent="pink">
          <div className="max-h-72 space-y-2 overflow-auto pr-1 text-xs">
            {events.length === 0 && <p className="text-[var(--text-muted)]">No events yet.</p>}

            {events.slice(0, 24).map((event, index) => (
              <article key={`${event.timestamp}-${index}`} className="rounded-md border border-[color:var(--app-border)] bg-[var(--surface-soft)] p-2">
                <p className="font-[var(--font-display)] uppercase tracking-[0.14em]">{event.channel}</p>
                <p className="mt-1 text-[var(--text-muted)]">{event.timestamp}</p>
              </article>
            ))}
          </div>
        </NeonPanel>
      </div>
    </section>
  );
}
