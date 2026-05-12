"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CreateObjectModal } from "@/features/digitalTwin/components/CreateObjectModal";
import { TwinSidebarDashboard } from "@/features/digitalTwin/components/TwinSidebarDashboard";
import { useDigitalTwinScene } from "@/features/digitalTwin/hooks/useDigitalTwinScene";
import { useTwinSimulation } from "@/features/digitalTwin/hooks/useTwinSimulation";
import type { BuildingThing, LngLatAlt, TwinThing } from "@/features/digitalTwin/types/twin";

function checkValidPosition(position: LngLatAlt, buildings: BuildingThing[]) {
  const x = position[0], y = position[1];
  for (const b of buildings) {
    let inside = false;
    const polygon = b.footprint;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    if (inside) return false;
  }
  return true;
}

const DigitalTwinDeckMap = dynamic(
  () => import("@/features/digitalTwin/components/DigitalTwinDeckMap").then((module) => module.DigitalTwinDeckMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[var(--map-panel)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
        Loading map engine...
      </div>
    )
  }
);

export function DigitalTwinWorkbench() {
  const {
    scene,
    setScene,
    metrics,
    loading,
    syncError,
    loadScene,
    createObjectAtCoordinate,
    persistSceneBatch
  } = useDigitalTwinScene();

  const { running, toggleSimulation, stepOnce } = useTwinSimulation(scene, setScene, persistSceneBatch);

  const [selectedThing, setSelectedThing] = useState<TwinThing | null>(null);
  const [createCoordinate, setCreateCoordinate] = useState<LngLatAlt | null>(null);

  const isValidPosition = createCoordinate ? checkValidPosition(createCoordinate, scene.buildings) : undefined;

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-[var(--map-panel)] text-[var(--text-primary)]">
      <header className="z-20 flex h-14 items-center justify-between border-b border-[color:var(--app-border)] bg-[var(--nav-background)] px-4 backdrop-blur-md">
        <div>
          <p className="font-[var(--font-display)] text-xs uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
            Deck.gl + MongoDB
          </p>
          <h1 className="font-[var(--font-display)] text-base tracking-[0.04em]">Hanoi Digital Twin Mini Region</h1>
        </div>
        <p className="text-xs text-[var(--text-muted)]">Click map to create object | Click object for details</p>
      </header>

      <section className="grid h-[calc(100vh-3.5rem)] w-full grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div className="relative h-full w-full">
          <DigitalTwinDeckMap
            scene={scene}
            onCreateAtCoordinate={(position) => {
              const isValid = checkValidPosition(position, scene.buildings);
              if (selectedThing?.type === "CHARGING_STATION" && isValid) {
                const updatedStation = { ...selectedThing, position };
                const newScene = {
                  ...scene,
                  chargingStations: scene.chargingStations.map((st) =>
                    st.id === selectedThing.id ? updatedStation : st
                  )
                };
                setScene(newScene);
                setSelectedThing(updatedStation);
                void persistSceneBatch([updatedStation]);
              } else {
                setCreateCoordinate(position);
              }
            }}
            onSelectThing={setSelectedThing}
          />

          <CreateObjectModal
            open={Boolean(createCoordinate)}
            coordinate={createCoordinate}
            isValidPosition={isValidPosition}
            onClose={() => setCreateCoordinate(null)}
            onCreate={async (payload) => {
              await createObjectAtCoordinate(payload);
            }}
          />
        </div>

        <TwinSidebarDashboard
          metrics={metrics}
          running={running}
          loading={loading}
          syncError={syncError}
          onRefresh={loadScene}
          onToggleSimulation={toggleSimulation}
          onStep={stepOnce}
          selectedThing={selectedThing}
        />
      </section>
    </main>
  );
}
