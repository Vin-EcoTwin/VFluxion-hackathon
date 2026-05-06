"use client";

import { useMemo, useState } from "react";
import type { PickingInfo } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { useDeckLayers } from "@/hooks/useDeckLayer";
import { useEntitiesStore } from "@/stores/entities.store";
import type { EntitiesState } from "@/stores/entities.store";

const INITIAL_VIEW_STATE = {
  longitude: 105.8524,
  latitude: 21.0289,
  zoom: 15.2,
  pitch: 52,
  bearing: -24
};

function toTooltip(info: PickingInfo) {
  if (!info.object) {
    return null;
  }

  const object = info.object as Record<string, unknown>;
  const lines: string[] = [];

  if (typeof object.name === "string") {
    lines.push(object.name);
  }

  if (typeof object.id === "string") {
    lines.push(`ID: ${object.id}`);
  }

  if (typeof object.soc === "number") {
    lines.push(`SOC: ${Math.round(object.soc)}%`);
  }

  if (typeof object.occupancy === "number") {
    lines.push(`Occupancy: ${Math.round(object.occupancy * 100)}%`);
  }

  if (typeof object.loadRatio === "number") {
    lines.push(`Grid load: ${Math.round(object.loadRatio * 100)}%`);
  }

  if (lines.length === 0) {
    return null;
  }

  return {
    text: lines.join("\n")
  };
}

export function DeckTwinViewer() {
  const layers = useDeckLayers();
  const evs = useEntitiesStore((state: EntitiesState) => state.evs);
  const chargers = useEntitiesStore((state: EntitiesState) => state.chargers);
  const buildings = useEntitiesStore((state: EntitiesState) => state.buildings);
  const commandCenter = useEntitiesStore((state: EntitiesState) => state.commandCenter);
  const simulationScenario = useEntitiesStore((state: EntitiesState) => state.simulationScenario);
  const simulationTick = useEntitiesStore((state: EntitiesState) => state.simulationTick);
  const dataSource = useEntitiesStore((state: EntitiesState) => state.dataSource);

  const [selectedLabel, setSelectedLabel] = useState("Nothing selected");

  const footerSummary = useMemo(
    () =>
      `EV ${evs.length} | Chargers ${chargers.length} | Buildings ${buildings.length} | Scenario ${simulationScenario}`,
    [evs.length, chargers.length, buildings.length, simulationScenario]
  );

  return (
    <section className="relative h-full w-full overflow-hidden border-r border-[color:var(--app-border)] bg-[var(--map-panel)]">
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{
          dragRotate: true,
          touchRotate: true,
          keyboard: true,
          inertia: true
        }}
        getTooltip={toTooltip}
        onClick={(info) => {
          const object = info.object as Record<string, unknown> | null;
          if (!object) {
            setSelectedLabel("Nothing selected");
            return;
          }

          const title = typeof object.name === "string" ? object.name : "Unknown object";
          const id = typeof object.id === "string" ? object.id : "n/a";
          setSelectedLabel(`${title} (${id})`);
        }}
      />

      <aside className="absolute left-3 top-3 max-w-[18rem] rounded-md border border-[color:var(--app-border-strong)] bg-[var(--panel-background)] px-3 py-2 shadow-panel backdrop-blur-sm">
        <p className="font-[var(--font-display)] text-[11px] uppercase tracking-[0.22em] text-[var(--accent-primary)]">
          Hanoi Core Digital Twin
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{footerSummary}</p>
        <p className="mt-2 text-xs text-[var(--text-primary)]">Command center: {commandCenter.status.toUpperCase()}</p>
      </aside>

      <aside className="absolute bottom-3 left-3 max-w-[22rem] rounded-md border border-[color:var(--app-border)] bg-[var(--panel-background)] px-3 py-2 text-xs text-[var(--text-primary)] shadow-panel backdrop-blur-sm">
        <p>Selected: {selectedLabel}</p>
        <p className="mt-1 text-[var(--text-muted)]">Simulation tick #{simulationTick} | Source: {dataSource}</p>
      </aside>
    </section>
  );
}
