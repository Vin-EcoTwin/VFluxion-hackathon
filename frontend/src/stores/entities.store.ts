import { create } from "zustand";
import {
  HANOI_COMMAND_CENTER,
  HANOI_CORE_CENTER,
  HANOI_MOCK_BACKEND_ENTITIES,
  HANOI_MOCK_BUILDINGS,
  SCENARIO_PRESET_MAP
} from "@/mock/hanoiTwinMock";
import type { BackendEntityPayload } from "@/types/backend";
import type {
  BuildingTwinModel,
  ChargerEntity,
  CommandCenterEntity,
  EVEntity,
  GridSegmentEntity,
  HeatPoint,
  SimulationScenarioKey
} from "@/types/entities";

const HANOI_BOUNDS = {
  west: 105.8475,
  east: 105.8588,
  south: 21.0248,
  north: 21.0323
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toEVEntity(entity: BackendEntityPayload): EVEntity | null {
  if (entity.type !== "EV") {
    return null;
  }

  return {
    id: entity.id,
    name: entity.name,
    type: "EV",
    lng: entity.location.lng,
    lat: entity.location.lat,
    soc: entity.soc,
    speedKmh: entity.speed_kmh
  };
}

function toChargerEntity(entity: BackendEntityPayload): ChargerEntity | null {
  if (entity.type !== "CHARGER") {
    return null;
  }

  return {
    id: entity.id,
    name: entity.name,
    type: "CHARGER",
    lng: entity.location.lng,
    lat: entity.location.lat,
    maxKw: entity.max_kw,
    occupancy: entity.occupancy_ratio
  };
}

function toGridSegmentEntity(entity: BackendEntityPayload): GridSegmentEntity | null {
  if (entity.type !== "GRID_SEGMENT") {
    return null;
  }

  return {
    id: entity.id,
    name: entity.name,
    type: "GRID_SEGMENT",
    loadRatio: entity.load_ratio,
    path: [
      [entity.start.lng, entity.start.lat],
      [entity.end.lng, entity.end.lat]
    ]
  };
}

function buildHeatPoints(evs: EVEntity[], chargers: ChargerEntity[]): HeatPoint[] {
  const chargerPoints = chargers.map((charger) => ({
    lng: charger.lng,
    lat: charger.lat,
    weight: clamp(charger.occupancy + 0.1, 0.2, 1)
  }));

  const evPoints = evs.map((ev) => ({
    lng: ev.lng,
    lat: ev.lat,
    weight: clamp((100 - ev.soc) / 100 + 0.05, 0.12, 1)
  }));

  const merged = [...chargerPoints, ...evPoints];
  if (merged.length > 0) {
    return merged;
  }

  return [
    { lng: HANOI_CORE_CENTER.lng - 0.0011, lat: HANOI_CORE_CENTER.lat + 0.0007, weight: 0.42 },
    { lng: HANOI_CORE_CENTER.lng + 0.0014, lat: HANOI_CORE_CENTER.lat - 0.0008, weight: 0.36 }
  ];
}

function normalizeEntities(entities: BackendEntityPayload[]) {
  const evs = entities.map(toEVEntity).filter((entity): entity is EVEntity => entity !== null);
  const chargers = entities
    .map(toChargerEntity)
    .filter((entity): entity is ChargerEntity => entity !== null);
  const gridSegments = entities
    .map(toGridSegmentEntity)
    .filter((entity): entity is GridSegmentEntity => entity !== null);

  return {
    evs,
    chargers,
    gridSegments,
    heatPoints: buildHeatPoints(evs, chargers)
  };
}

const MOCK_MODEL = normalizeEntities(HANOI_MOCK_BACKEND_ENTITIES);

export type EntitiesState = {
  evs: EVEntity[];
  chargers: ChargerEntity[];
  gridSegments: GridSegmentEntity[];
  heatPoints: HeatPoint[];
  buildings: BuildingTwinModel[];
  commandCenter: CommandCenterEntity;
  dataSource: "backend" | "mock";
  simulationScenario: SimulationScenarioKey;
  simulationTick: number;
  isSimulationRunning: boolean;
  lastSyncedAt: string | null;
  hydrateFromBackend: (entities: BackendEntityPayload[]) => void;
  hydrateFromMock: () => void;
  addLocalEV: (ev: EVEntity) => void;
  addLocalCharger: (charger: ChargerEntity) => void;
  setSimulationScenario: (scenario: SimulationScenarioKey) => void;
  toggleSimulation: () => void;
  stepSimulation: () => void;
  resetSimulation: () => void;
};

export const useEntitiesStore = create<EntitiesState>((set) => ({
  evs: MOCK_MODEL.evs,
  chargers: MOCK_MODEL.chargers,
  gridSegments: MOCK_MODEL.gridSegments,
  heatPoints: MOCK_MODEL.heatPoints,
  buildings: HANOI_MOCK_BUILDINGS,
  commandCenter: HANOI_COMMAND_CENTER,
  dataSource: "mock",
  simulationScenario: "city_baseline",
  simulationTick: 0,
  isSimulationRunning: false,
  lastSyncedAt: null,
  hydrateFromBackend: (entities) => {
    const normalized = normalizeEntities(entities);
    const evs = normalized.evs.length > 0 ? normalized.evs : MOCK_MODEL.evs;
    const chargers = normalized.chargers.length > 0 ? normalized.chargers : MOCK_MODEL.chargers;
    const gridSegments =
      normalized.gridSegments.length > 0 ? normalized.gridSegments : MOCK_MODEL.gridSegments;

    set({
      evs,
      chargers,
      gridSegments,
      heatPoints: buildHeatPoints(evs, chargers),
      dataSource: "backend",
      lastSyncedAt: new Date().toISOString()
    });
  },
  hydrateFromMock: () =>
    set({
      evs: MOCK_MODEL.evs,
      chargers: MOCK_MODEL.chargers,
      gridSegments: MOCK_MODEL.gridSegments,
      heatPoints: MOCK_MODEL.heatPoints,
      dataSource: "mock",
      simulationTick: 0,
      isSimulationRunning: false,
      commandCenter: {
        ...HANOI_COMMAND_CENTER,
        status: "nominal"
      },
      lastSyncedAt: new Date().toISOString()
    }),
  addLocalEV: (ev) =>
    set((state) => {
      const evs = [...state.evs, ev];
      return {
        evs,
        heatPoints: buildHeatPoints(evs, state.chargers)
      };
    }),
  addLocalCharger: (charger) =>
    set((state) => {
      const chargers = [...state.chargers, charger];
      return {
        chargers,
        heatPoints: buildHeatPoints(state.evs, chargers)
      };
    }),
  setSimulationScenario: (scenario) => set({ simulationScenario: scenario }),
  toggleSimulation: () =>
    set((state) => ({
      isSimulationRunning: !state.isSimulationRunning
    })),
  stepSimulation: () =>
    set((state) => {
      const scenario = SCENARIO_PRESET_MAP[state.simulationScenario];
      const nextTick = state.simulationTick + 1;

      const evs = state.evs.map((ev, index) => {
        const angle = nextTick * 0.085 * scenario.speedMultiplier + index * 0.72;
        const radiusLng = 0.0007 + (index % 5) * 0.00028;
        const radiusLat = 0.00055 + (index % 5) * 0.00021;

        const lng = clamp(
          HANOI_CORE_CENTER.lng + Math.cos(angle) * radiusLng,
          HANOI_BOUNDS.west,
          HANOI_BOUNDS.east
        );
        const lat = clamp(
          HANOI_CORE_CENTER.lat + Math.sin(angle * 1.14) * radiusLat,
          HANOI_BOUNDS.south,
          HANOI_BOUNDS.north
        );

        const baseSpeed = 18 + (index % 4) * 5;
        const speedKmh = Math.max(5, baseSpeed * scenario.speedMultiplier + Math.sin(angle * 2.1) * 4.2);

        const chargingBoost = scenario.key === "night_charge" ? 0.85 : 0;
        let soc = ev.soc - scenario.socDrain + chargingBoost;
        if (soc <= 15) {
          soc = 92;
        }
        soc = clamp(soc, 10, 100);

        return {
          ...ev,
          lng: Number(lng.toFixed(6)),
          lat: Number(lat.toFixed(6)),
          soc: Number(soc.toFixed(1)),
          speedKmh: Number(speedKmh.toFixed(1))
        };
      });

      const chargers = state.chargers.map((charger, index) => {
        const wave = 0.48 + 0.38 * Math.sin(nextTick * 0.07 + index * 0.9);
        const occupancy = clamp(wave + scenario.chargerBias, 0.06, 0.98);
        return {
          ...charger,
          occupancy: Number(occupancy.toFixed(2))
        };
      });

      const gridSegments = state.gridSegments.map((segment, index) => {
        const wave = 0.42 + 0.24 * Math.sin(nextTick * 0.05 + index * 0.66);
        const loadRatio = clamp(wave + scenario.gridBias, 0.18, 0.97);
        return {
          ...segment,
          loadRatio: Number(loadRatio.toFixed(2))
        };
      });

      const avgGridLoad =
        gridSegments.reduce((sum, segment) => sum + segment.loadRatio, 0) /
        Math.max(gridSegments.length, 1);

      let status: CommandCenterEntity["status"] = "nominal";
      if (avgGridLoad > 0.82) {
        status = "critical";
      } else if (avgGridLoad > 0.64) {
        status = "watch";
      }

      return {
        evs,
        chargers,
        gridSegments,
        heatPoints: buildHeatPoints(evs, chargers),
        commandCenter: {
          ...state.commandCenter,
          status
        },
        simulationTick: nextTick
      };
    }),
  resetSimulation: () =>
    set({
      evs: MOCK_MODEL.evs,
      chargers: MOCK_MODEL.chargers,
      gridSegments: MOCK_MODEL.gridSegments,
      heatPoints: MOCK_MODEL.heatPoints,
      commandCenter: {
        ...HANOI_COMMAND_CENTER,
        status: "nominal"
      },
      simulationScenario: "city_baseline",
      simulationTick: 0,
      isSimulationRunning: false,
      dataSource: "mock",
      lastSyncedAt: new Date().toISOString()
    })
}));
