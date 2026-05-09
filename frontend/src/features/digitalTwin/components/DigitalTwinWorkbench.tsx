"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CreateObjectModal } from "@/features/digitalTwin/components/CreateObjectModal";
import { TwinSidebarDashboard } from "@/features/digitalTwin/components/TwinSidebarDashboard";
import { useDigitalTwinScene } from "@/features/digitalTwin/hooks/useDigitalTwinScene";
import { useTwinSimulation } from "@/features/digitalTwin/hooks/useTwinSimulation";
import type { LngLatAlt, TwinThing } from "@/features/digitalTwin/types/twin";

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
            onCreateAtCoordinate={(position) => setCreateCoordinate(position)}
            onSelectThing={setSelectedThing}
          />

          <CreateObjectModal
            open={Boolean(createCoordinate)}
            coordinate={createCoordinate}
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
