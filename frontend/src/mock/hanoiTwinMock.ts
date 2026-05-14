import type { BackendEntityPayload } from "@/types/backend";
import type { BuildingTwinModel, CommandCenterEntity, SimulationScenarioKey } from "@/types/entities";

export const HANOI_CORE_CENTER = {
  lng: 105.8524,
  lat: 21.0289
};

function rectangleFootprint(
  centerLng: number,
  centerLat: number,
  widthDeg: number,
  heightDeg: number
): [number, number][] {
  return [
    [centerLng - widthDeg, centerLat - heightDeg],
    [centerLng + widthDeg, centerLat - heightDeg],
    [centerLng + widthDeg, centerLat + heightDeg],
    [centerLng - widthDeg, centerLat + heightDeg]
  ];
}

export const HANOI_MOCK_BUILDINGS: BuildingTwinModel[] = [
  {
    id: "bld-hoankiem-01",
    name: "Hoan Kiem Residential Block A",
    category: "residential",
    footprint: rectangleFootprint(105.8512, 21.0297, 0.00023, 0.00014),
    height: 54,
    demandMw: 1.4
  },
  {
    id: "bld-hoankiem-02",
    name: "Hoan Kiem Residential Block B",
    category: "residential",
    footprint: rectangleFootprint(105.8536, 21.0296, 0.0002, 0.00013),
    height: 47,
    demandMw: 1.2
  },
  {
    id: "bld-off-01",
    name: "Old Quarter Office Hub",
    category: "office",
    footprint: rectangleFootprint(105.8542, 21.0278, 0.00026, 0.00018),
    height: 82,
    demandMw: 2.7
  },
  {
    id: "bld-hospital",
    name: "District Public Service Center",
    category: "public",
    footprint: rectangleFootprint(105.8498, 21.0279, 0.0003, 0.0002),
    height: 36,
    demandMw: 1.9
  },
  {
    id: "bld-utility",
    name: "Urban Utility Node",
    category: "utility",
    footprint: rectangleFootprint(105.8509, 21.0268, 0.00019, 0.00012),
    height: 28,
    demandMw: 1.1
  },
  {
    id: "bld-command-campus",
    name: "VFluxion Command Campus",
    category: "command",
    footprint: rectangleFootprint(105.8529, 21.0285, 0.00024, 0.00016),
    height: 65,
    demandMw: 2.2
  }
];

export const HANOI_COMMAND_CENTER: CommandCenterEntity = {
  id: "command-center-hn-core",
  name: "VFluxion Command Center",
  lng: 105.8529,
  lat: 21.0285,
  radiusMeters: 95,
  towerHeight: 120,
  status: "nominal"
};

export const HANOI_MOCK_BACKEND_ENTITIES: BackendEntityPayload[] = [
  {
    id: "ev-hn-01",
    name: "VinFast VF9 #01",
    type: "EV",
    location: { lng: 105.8519, lat: 21.0292 },
    soc: 79,
    speed_kmh: 28
  },
  {
    id: "ev-hn-02",
    name: "VinFast VF8 #02",
    type: "EV",
    location: { lng: 105.8541, lat: 21.0282 },
    soc: 54,
    speed_kmh: 33
  },
  {
    id: "ev-hn-03",
    name: "VinFast e34 #03",
    type: "EV",
    location: { lng: 105.8505, lat: 21.0281 },
    soc: 67,
    speed_kmh: 24
  },
  {
    id: "ev-hn-04",
    name: "VinFast Minio Green #04",
    type: "EV",
    location: { lng: 105.8531, lat: 21.0304 },
    soc: 41,
    speed_kmh: 29
  },
  {
    id: "charger-hn-01",
    name: "Charging Hub Trang Tien",
    type: "CHARGER",
    location: { lng: 105.8534, lat: 21.0288 },
    max_kw: 200,
    occupancy_ratio: 0.62
  },
  {
    id: "charger-hn-02",
    name: "Charging Hub Hang Bai",
    type: "CHARGER",
    location: { lng: 105.8511, lat: 21.0276 },
    max_kw: 150,
    occupancy_ratio: 0.44
  },
  {
    id: "charger-hn-03",
    name: "Charging Hub Ly Thai To",
    type: "CHARGER",
    location: { lng: 105.8546, lat: 21.0299 },
    max_kw: 175,
    occupancy_ratio: 0.51
  },
  {
    id: "grid-hn-main",
    name: "Hanoi Core Main Trunk",
    type: "GRID_SEGMENT",
    load_ratio: 0.57,
    start: { lng: 105.8497, lat: 21.0271 },
    end: { lng: 105.8568, lat: 21.0302 }
  },
  {
    id: "grid-hn-ring",
    name: "Inner Ring Feeder",
    type: "GRID_SEGMENT",
    load_ratio: 0.48,
    start: { lng: 105.8502, lat: 21.031 },
    end: { lng: 105.8559, lat: 21.0267 }
  },
  {
    id: "bld-backend-hub",
    name: "Hanoi Control Building",
    type: "BUILDING",
    location: { lng: 105.8528, lat: 21.0287 },
    district: "Hoan Kiem"
  }
];

export type ScenarioPreset = {
  key: SimulationScenarioKey;
  label: string;
  description: string;
  speedMultiplier: number;
  socDrain: number;
  chargerBias: number;
  gridBias: number;
};

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    key: "city_baseline",
    label: "City Baseline",
    description: "Balanced traffic and charging demand during normal operation.",
    speedMultiplier: 1,
    socDrain: 0.55,
    chargerBias: 0,
    gridBias: 0
  },
  {
    key: "rush_hour",
    label: "Rush Hour",
    description: "Higher traffic speed variance and heavier charger utilization.",
    speedMultiplier: 1.35,
    socDrain: 0.95,
    chargerBias: 0.16,
    gridBias: 0.12
  },
  {
    key: "night_charge",
    label: "Night Charging",
    description: "Slow traffic, more charging sessions, SOC tends to recover.",
    speedMultiplier: 0.58,
    socDrain: -0.25,
    chargerBias: 0.28,
    gridBias: 0.18
  },
  {
    key: "grid_stress",
    label: "Grid Stress",
    description: "Emergency stress test with high load and unstable occupancy.",
    speedMultiplier: 1.12,
    socDrain: 1.1,
    chargerBias: 0.22,
    gridBias: 0.28
  }
];

export const SCENARIO_PRESET_MAP: Record<SimulationScenarioKey, ScenarioPreset> =
  SCENARIO_PRESETS.reduce((acc, scenario) => {
    acc[scenario.key] = scenario;
    return acc;
  }, {} as Record<SimulationScenarioKey, ScenarioPreset>);
