"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { EVDeepDivePanel } from "@/components/cpo/EVDeepDivePanel";
import { StationDeepDivePanel } from "@/components/cpo/StationDeepDivePanel";
import { TransformerDeepDivePanel } from "@/components/cpo/TransformerDeepDivePanel";
import type { ActiveEV, ChargingStation, TransformerEntity } from "@/types/cpo";
import { CHARGING_STATIONS, TRANSFORMERS } from "@/store/cpo-data";
import type { MapClickInfo } from "@/components/cpo/TripsLiveMap";
import { useStationEditorStore } from "@/stores/station-editor.store";

const TripsLiveMap = dynamic(
  () => import("@/components/cpo/TripsLiveMap").then((module) => module.TripsLiveMap),
  { ssr: false }
);

const DRAFT_STATION_ID = "draft-station";
const DRAFT_TRANSFORMER_ID = "draft-transformer";
const HEADING_STEP = 5;
const SNAP_HEADING_STEP = 15;

function normalizeHeading(value: number) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function snapHeading(value: number, step: number) {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

function formatCoordinate(info: MapClickInfo | null) {
  if (!info) return "Move cursor over the map";
  return `${info.coordinate[0].toFixed(6)}, ${info.coordinate[1].toFixed(6)}`;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function stationNetPower(station: ChargingStation): number {
  const stallPower = station.stalls.reduce((sum, stall) => sum + (stall.powerKw ?? 0), 0);
  if (stallPower !== 0) return stallPower;
  if (station.inUseStalls > 0) return station.inUseStalls * 11;
  return 0;
}

function buildStation(id: string, name: string, position: [number, number], heading: number, capacity: number): ChargingStation {
  const safeCapacity = Math.max(1, Math.min(20, Math.round(capacity)));
  return {
    id,
    name: name.trim() || "Unnamed",
    position,
    heading,
    totalStalls: safeCapacity,
    activeStalls: safeCapacity,
    inUseStalls: 0,
    stalls: Array.from({ length: safeCapacity }, (_, i) => ({
      id: `${id}-stall-${i + 1}`,
      status: "AVAILABLE" as const
    })),
    financials: {
      "1D": { currentRate: 0.42, v2gProfit: 0, pset: 0, ptot: 0 },
      "3D": { currentRate: 0.41, v2gProfit: 0, pset: 0, ptot: 0 },
      "7D": { currentRate: 0.43, v2gProfit: 0, pset: 0, ptot: 0 }
    },
    fulfillment: 0
  };
}

function pickNearestStations(
  position: [number, number],
  stations: ChargingStation[],
  count = 4
): string[] {
  return [...stations]
    .sort((a, b) => {
      const dxA = a.position[0] - position[0];
      const dyA = a.position[1] - position[1];
      const dxB = b.position[0] - position[0];
      const dyB = b.position[1] - position[1];
      return (dxA * dxA + dyA * dyA) - (dxB * dxB + dyB * dyB);
    })
    .slice(0, Math.max(1, count))
    .map((station) => station.id);
}

function buildPowerHistory(baseKw: number): TransformerEntity["powerHistory"] {
  return Array.from({ length: 12 }, (_, idx) => {
    const wave = Math.sin((idx / 11) * Math.PI * 2);
    return {
      time: `${String(6 + idx).padStart(2, "0")}:00`,
      netPower: Math.max(0, Math.round(baseKw + wave * baseKw * 0.2))
    };
  });
}

function withComputedTelemetry(transformer: TransformerEntity, stations: ChargingStation[]): TransformerEntity {
  const linkedStations = stations.filter((station) => transformer.stationIds.includes(station.id));
  const evLoad = linkedStations.reduce((sum, station) => sum + stationNetPower(station), 0);
  const netPower = transformer.telemetry.inflexibleLoad + evLoad - transformer.telemetry.pvGeneration;
  const loadFactor = transformer.maxCapacityKw > 0 ? netPower / transformer.maxCapacityKw : 0;
  const drRatio = clampNumber(transformer.telemetry.drCapacityReduction / 100, 0, 1);
  const drLimit = transformer.maxCapacityKw * (1 - drRatio);

  let status: TransformerEntity["status"] = "optimal";
  if (drRatio > 0 && netPower >= drLimit) {
    status = "dr_active";
  } else if (loadFactor >= 0.9) {
    status = "critical";
  } else if (loadFactor >= 0.7) {
    status = "warning";
  }

  return {
    ...transformer,
    status,
    telemetry: {
      ...transformer.telemetry,
      timestamp: new Date().toISOString(),
      evLoad,
      netPower: Math.round(netPower),
      loadFactor: Number(loadFactor.toFixed(3))
    }
  };
}

function buildTransformer(
  id: string,
  name: string,
  position: [number, number],
  heading: number,
  draft: {
    maxCapacityKw: number;
    inflexibleLoadKw: number;
    pvGenerationKw: number;
    drCapacityReduction: number;
  },
  stations: ChargingStation[]
): TransformerEntity {
  const maxCapacityKw = clampNumber(Math.round(draft.maxCapacityKw), 200, 5000);
  const inflexibleLoad = clampNumber(Math.round(draft.inflexibleLoadKw), 0, maxCapacityKw * 2);
  const pvGeneration = clampNumber(Math.round(draft.pvGenerationKw), 0, maxCapacityKw);
  const drCapacityReduction = clampNumber(Math.round(draft.drCapacityReduction), 0, 60);
  const stationIds = pickNearestStations(position, stations, 4);

  return withComputedTelemetry({
    id,
    name: name.trim() || "Transformer",
    position,
    heading,
    maxCapacityKw,
    stationIds,
    telemetry: {
      timestamp: new Date().toISOString(),
      loadFactor: 0,
      inflexibleLoad,
      evLoad: 0,
      pvGeneration,
      netPower: 0,
      drCapacityReduction
    },
    status: "optimal",
    drEvent: drCapacityReduction > 0 ? { label: "Peak Shaving", minutesRemaining: 15 } : undefined,
    health: { hotSpotTempC: 82, lossOfLifeDailyPct: 0.02 },
    powerHistory: buildPowerHistory(maxCapacityKw * 0.78)
  }, stations);
}

// ---------------------------------------------------------------------------
// Main CPO Live Map Client
// ---------------------------------------------------------------------------
export function CpoLiveMapClient() {
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [selectedTransformer, setSelectedTransformer] = useState<TransformerEntity | null>(null);
  const [selectedEV, setSelectedEV] = useState<ActiveEV | null>(null);
  const [stations, setStations] = useState<ChargingStation[]>(() => [...CHARGING_STATIONS]);
  const [transformers, setTransformers] = useState<TransformerEntity[]>(() => [...TRANSFORMERS]);
  const [hoverInfo, setHoverInfo] = useState<MapClickInfo | null>(null);
  const [movingStation, setMovingStation] = useState<ChargingStation | null>(null);
  const [movingTransformer, setMovingTransformer] = useState<TransformerEntity | null>(null);
  const [movingHeading, setMovingHeading] = useState<number | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [shiftPressed, setShiftPressed] = useState(false);

  const mode = useStationEditorStore((state) => state.mode);
  const assetType = useStationEditorStore((state) => state.assetType);
  const setMode = useStationEditorStore((state) => state.setMode);
  const draft = useStationEditorStore((state) => state.draft);
  const setDraft = useStationEditorStore((state) => state.setDraft);
  const selectStation = useStationEditorStore((state) => state.selectStation);

  const placementInfo = hoverInfo;
  const placementHeading =
    mode === "add" ? draft.heading : movingHeading ?? movingStation?.heading ?? movingTransformer?.heading ?? 0;
  const placementValid = placementInfo?.isValidPosition ?? false;
  const placementCoordinate = placementInfo?.coordinate;

  useEffect(() => {
    if (mode === "idle") {
      setHoverInfo(null);
      setMovingStation(null);
      setMovingTransformer(null);
      setMovingHeading(null);
      selectStation(null);
    }
    if (mode !== "move") {
      setMovingStation(null);
      setMovingTransformer(null);
      setMovingHeading(null);
      selectStation(null);
    }
    if (mode !== "idle") {
      setSelectedStation(null);
      setSelectedTransformer(null);
      setSelectedEV(null);
    }
  }, [mode, selectStation]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(true);
      }

      if (mode === "idle") return;

      const isRotateLeft = event.key === "q" || event.key === "Q" || event.key === "ArrowLeft";
      const isRotateRight = event.key === "e" || event.key === "E" || event.key === "ArrowRight";
      if (!isRotateLeft && !isRotateRight) return;

      event.preventDefault();
      const snap = event.shiftKey;
      const delta = isRotateLeft ? -HEADING_STEP : HEADING_STEP;
      const current = placementHeading;
      const nextBase = normalizeHeading(current + delta);
      const nextHeading = snap ? snapHeading(nextBase, SNAP_HEADING_STEP) : nextBase;

      if (mode === "add") {
        setDraft({ heading: nextHeading });
      } else if (mode === "move") {
        setMovingHeading(nextHeading);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [mode, placementHeading, setDraft]);

  const handleSelectEntity = (entity: any) => {
    if (mode === "add") return;

    if (mode === "move") {
      if (entity?.type === "STATION") {
        const station = entity.data as ChargingStation;
        if (station.id === DRAFT_STATION_ID) return;
        setMovingStation(station);
        setMovingTransformer(null);
        setMovingHeading(station.heading ?? 0);
        selectStation(station.id);
      } else if (entity?.type === "TRANSFORMER") {
        const transformer = entity.data as TransformerEntity;
        if (transformer.id === DRAFT_TRANSFORMER_ID) return;
        setMovingTransformer(transformer);
        setMovingStation(null);
        setMovingHeading(transformer.heading ?? 0);
        selectStation(null);
      }
      return;
    }

    if (!entity) {
      setSelectedStation(null);
      setSelectedTransformer(null);
      setSelectedEV(null);
    } else if (entity.type === "STATION") {
      if ((entity.data as ChargingStation).id === DRAFT_STATION_ID) return;
      setSelectedStation(entity.data as ChargingStation);
      setSelectedTransformer(null);
      setSelectedEV(null);
    } else if (entity.type === "TRANSFORMER") {
      if ((entity.data as TransformerEntity).id === DRAFT_TRANSFORMER_ID) return;
      setSelectedTransformer(entity.data as TransformerEntity);
      setSelectedStation(null);
      setSelectedEV(null);
    } else if (entity.type === "EV") {
      setSelectedEV(entity.data as ActiveEV);
      setSelectedStation(null);
      setSelectedTransformer(null);
    }
  };

  const handleMapClick = (info: MapClickInfo) => {
    if (mode === "idle") return;
    setHoverInfo(info);
  };

  const handleMapHover = (info: MapClickInfo | null) => {
    if (mode === "idle" || !info) return;
    setHoverInfo(info);
  };

  const handleCancelEdit = () => {
    setMode("idle");
    setHoverInfo(null);
    setMovingStation(null);
    setMovingTransformer(null);
    setMovingHeading(null);
  };

  const handleLockPosition = () => {
    if (!placementCoordinate || !placementValid) return;

    if (mode === "add") {
      if (assetType === "station") {
        const id = `station-new-${Date.now()}`;
        const newStation = buildStation(id, draft.name, placementCoordinate, placementHeading, draft.capacity);
        setStations((prev) => [...prev, newStation]);
      } else {
        const id = `transformer-new-${Date.now()}`;
        const newTransformer = buildTransformer(
          id,
          draft.name,
          placementCoordinate,
          placementHeading,
          {
            maxCapacityKw: draft.maxCapacityKw,
            inflexibleLoadKw: draft.inflexibleLoadKw,
            pvGenerationKw: draft.pvGenerationKw,
            drCapacityReduction: draft.drCapacityReduction
          },
          stations
        );
        setTransformers((prev) => [...prev, newTransformer]);
      }
    }

    if (mode === "move" && movingStation) {
      setStations((prev) =>
        prev.map((st) =>
          st.id === movingStation.id
            ? { ...st, position: placementCoordinate, heading: placementHeading }
            : st
        )
      );
    }

    if (mode === "move" && movingTransformer) {
      setTransformers((prev) =>
        prev.map((tx) =>
          tx.id === movingTransformer.id
            ? { ...tx, position: placementCoordinate, heading: placementHeading }
            : tx
        )
      );
    }

    setMode("idle");
    setHoverInfo(null);
    setMovingStation(null);
    setMovingTransformer(null);
    setMovingHeading(null);
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

  const displayStations = useMemo(() => {
    let nextStations = stations;

    if (mode === "move" && movingStation && placementCoordinate) {
      nextStations = nextStations.map((station) =>
        station.id === movingStation.id
          ? { ...station, position: placementCoordinate, heading: placementHeading }
          : station
      );
    }

    if (mode === "add" && assetType === "station" && placementCoordinate) {
      const draftStation = buildStation(
        DRAFT_STATION_ID,
        draft.name,
        placementCoordinate,
        placementHeading,
        draft.capacity
      );
      nextStations = [...nextStations, draftStation];
    }

    return nextStations;
  }, [stations, mode, movingStation, placementCoordinate, placementHeading, draft, assetType]);

  const displayTransformers = useMemo(() => {
    let nextTransformers = transformers;

    if (mode === "move" && movingTransformer && placementCoordinate) {
      nextTransformers = nextTransformers.map((transformer) =>
        transformer.id === movingTransformer.id
          ? { ...transformer, position: placementCoordinate, heading: placementHeading }
          : transformer
      );
    }

    if (mode === "add" && assetType === "transformer" && placementCoordinate) {
      const draftTransformer = buildTransformer(
        DRAFT_TRANSFORMER_ID,
        draft.name,
        placementCoordinate,
        placementHeading,
        {
          maxCapacityKw: draft.maxCapacityKw,
          inflexibleLoadKw: draft.inflexibleLoadKw,
          pvGenerationKw: draft.pvGenerationKw,
          drCapacityReduction: draft.drCapacityReduction
        },
        stations
      );
      nextTransformers = [...nextTransformers, draftTransformer];
    }

    return nextTransformers.map((transformer) => withComputedTelemetry(transformer, stations));
  }, [
    transformers,
    mode,
    movingTransformer,
    placementCoordinate,
    placementHeading,
    draft,
    assetType,
    stations
  ]);

  const canLockPosition =
    Boolean(placementCoordinate) && placementValid && (mode === "add" || Boolean(movingStation) || Boolean(movingTransformer));

  return (
    <>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <TripsLiveMap
            onSelectEntity={handleSelectEntity}
            onMapClick={handleMapClick}
            onMapHover={handleMapHover}
            stations={displayStations}
            transformers={displayTransformers}
            snapToGrid={snapToGrid}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 data-grid opacity-15" />
      </div>

      {mode !== "idle" && (
        <section className="absolute left-6 top-24 z-40 w-[320px] rounded-xl glass-panel px-4 py-4 shadow-2xl border-cyan-glow pointer-events-auto">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              {mode === "add"
                ? assetType === "transformer"
                  ? "Add transformer"
                  : "Add station"
                : "Move or rotate"}
            </span>
            <span className="material-symbols-outlined text-primary">tune</span>
          </div>

          <div className="mt-3 text-xs text-on-surface-variant">
            Position: <span className="text-on-surface">{formatCoordinate(placementInfo)}</span>
          </div>

          {placementInfo && !placementValid && (
            <div className="mt-2 rounded border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-400">
              Invalid location. The station overlaps with a building.
            </div>
          )}

          {mode === "move" && !movingStation && !movingTransformer && (
            <div className="mt-3 rounded border border-outline-variant/40 bg-surface-container/40 p-2 text-xs text-on-surface-variant">
              Select a station or transformer on the map to begin moving.
            </div>
          )}

          {mode === "add" && assetType === "station" && (
            <div className="mt-3 space-y-3 text-sm">
              <label className="flex flex-col gap-1 text-on-surface-variant">
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ name: e.target.value })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>

              <label className="flex flex-col gap-1 text-on-surface-variant">
                Capacity (stalls)
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={draft.capacity}
                  onChange={(e) => setDraft({ capacity: Number(e.target.value) })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>
            </div>
          )}

          {mode === "add" && assetType === "transformer" && (
            <div className="mt-3 space-y-3 text-sm">
              <label className="flex flex-col gap-1 text-on-surface-variant">
                Name
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ name: e.target.value })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>

              <label className="flex flex-col gap-1 text-on-surface-variant">
                Max capacity (kW)
                <input
                  type="number"
                  min={200}
                  max={5000}
                  value={draft.maxCapacityKw}
                  onChange={(e) => setDraft({ maxCapacityKw: Number(e.target.value) })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>

              <label className="flex flex-col gap-1 text-on-surface-variant">
                Inflexible load (kW)
                <input
                  type="number"
                  min={0}
                  max={6000}
                  value={draft.inflexibleLoadKw}
                  onChange={(e) => setDraft({ inflexibleLoadKw: Number(e.target.value) })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>

              <label className="flex flex-col gap-1 text-on-surface-variant">
                PV generation (kW)
                <input
                  type="number"
                  min={0}
                  max={2000}
                  value={draft.pvGenerationKw}
                  onChange={(e) => setDraft({ pvGenerationKw: Number(e.target.value) })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>

              <label className="flex flex-col gap-1 text-on-surface-variant">
                DR reduction (%)
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={draft.drCapacityReduction}
                  onChange={(e) => setDraft({ drCapacityReduction: Number(e.target.value) })}
                  className="rounded border border-outline-variant/40 bg-surface-container px-2 py-1.5 text-on-surface outline-none focus:border-primary/60"
                />
              </label>
            </div>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span>Heading</span>
              <span className="text-on-surface">{Math.round(placementHeading)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={placementHeading}
              onChange={(e) => {
                const raw = normalizeHeading(Number(e.target.value));
                const next = shiftPressed ? snapHeading(raw, SNAP_HEADING_STEP) : raw;
                if (mode === "add") {
                  setDraft({ heading: next });
                } else if (mode === "move") {
                  setMovingHeading(next);
                }
              }}
              className="w-full accent-[var(--md-sys-color-primary,#22d3ee)]"
            />
            <div className="text-[10px] text-on-surface-variant">
              Use Q/E or arrow keys to rotate. Hold Shift to snap to 15 deg.
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
            <button
              type="button"
              onClick={() => setSnapToGrid((prev) => !prev)}
              className={`rounded px-2 py-1 border ${
                snapToGrid
                  ? "border-primary/50 text-primary bg-primary/10"
                  : "border-outline-variant/40 text-on-surface-variant"
              }`}
            >
              Snap to grid
            </button>
            <span>{snapToGrid ? "Grid snapping on" : "Grid snapping off"}</span>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded border border-outline-variant/40 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canLockPosition}
              onClick={handleLockPosition}
              className="rounded border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/25"
            >
              Lock position
            </button>
          </div>
        </section>
      )}

      {/* Default Map Overlay (City Overview) */}
      {mode === "idle" && !selectedStation && !selectedTransformer && !selectedEV && (
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
      {selectedTransformer && (
        <TransformerDeepDivePanel
          onClose={() => setSelectedTransformer(null)}
          data={selectedTransformer}
        />
      )}
      {selectedEV && (
        <EVDeepDivePanel onClose={() => setSelectedEV(null)} data={selectedEV} />
      )}
    </>
  );
}
