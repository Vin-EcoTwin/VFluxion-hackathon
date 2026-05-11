"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { EVDeepDivePanel } from "@/components/cpo/EVDeepDivePanel";
import { StationDeepDivePanel } from "@/components/cpo/StationDeepDivePanel";
import type { ActiveEV } from "@/types/cpo";

const TripsLiveMap = dynamic(
  () => import("@/components/cpo/TripsLiveMap").then((module) => module.TripsLiveMap),
  { ssr: false }
);

export function CpoLiveMapClient() {
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [selectedEV, setSelectedEV] = useState<ActiveEV | null>(null);

  const handleSelectEntity = (entity: any) => {
    if (!entity) {
      setSelectedStation(null);
      setSelectedEV(null);
    } else if (entity.type === "STATION") {
      setSelectedStation(entity.data);
    } else if (entity.type === "EV") {
      setSelectedEV(entity.data as ActiveEV);
    }
  };

  /** When the user clicks a stall in StationDeepDivePanel, resolve the EV from the map's shared data. */
  const handleStallSelect = async (evId: string) => {
    const { MOCK_EVS, buildHorizon } = await import("@/store/cpo-data");
    const ev = MOCK_EVS.find((e) => e.id === evId);
    if (ev) {
      setSelectedEV(ev);
    } else {
      // Graceful fallback for stall EVs not in the map mock list
      const horizon = buildHorizon(0.35, -10, 1);
      setSelectedEV({
        id: evId,
        position: [-73.99, 40.75],
        vehicleType: "V2G EV",
        isDischarging: false,
        connectedTime: "12:00",
        socPercent: 75,
        targetSocPercent: 90,
        departureTime: "18:00",
        minutesUntilDeparture: 120,
        pset: 11,
        ptot: 10.8,
        currentLoadPercent: 75,
        reliefKw: 0,
        revenue: 0,
        rate: 0.35,
        financials: { "1D": horizon, "3D": horizon, "7D": horizon }
      } satisfies ActiveEV);
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <TripsLiveMap onSelectEntity={handleSelectEntity} />
        </div>
        <div className="pointer-events-none absolute inset-0 data-grid opacity-15" />
      </div>

      {/* Default Map Overlay (City Overview) */}
      {!selectedStation && !selectedEV && (
        <section className="absolute right-8 top-8 z-30 min-w-[240px] rounded-xl glass-panel px-4 py-3 shadow-2xl border-cyan-glow pointer-events-auto">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Current Grid Price
            </span>
            <span className="material-symbols-outlined text-primary">show_chart</span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-headline-md text-2xl text-primary">$0.24</span>
            <span className="text-xs text-on-surface-variant">/kWh</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/10 px-2 py-1 text-xs text-secondary">
            <span className="material-symbols-outlined text-[16px]">trending_down</span>
            -0.02 vs 1h ago
          </div>
        </section>
      )}

      {/* Deep-Dive Panels */}
      {selectedStation && (
        <StationDeepDivePanel 
          onClose={() => setSelectedStation(null)} 
          data={selectedStation} 
          onSelectEV={handleStallSelect} 
        />
      )}
      {selectedEV && (
        <EVDeepDivePanel 
          onClose={() => setSelectedEV(null)} 
          data={selectedEV} 
        />
      )}
    </>
  );
}
