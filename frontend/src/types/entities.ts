export type EntityType = "EV" | "CHARGER" | "GRID_SEGMENT" | "BUILDING";

export type BaseEntity = {
  id: string;
  name: string;
  type: EntityType;
};

export type EVEntity = BaseEntity & {
  type: "EV";
  lng: number;
  lat: number;
  soc: number;
  speedKmh: number;
};

export type ChargerEntity = BaseEntity & {
  type: "CHARGER";
  lng: number;
  lat: number;
  maxKw: number;
  occupancy: number;
};

export type GridSegmentEntity = BaseEntity & {
  type: "GRID_SEGMENT";
  path: [number, number][];
  loadRatio: number;
};

export type BuildingEntity = BaseEntity & {
  type: "BUILDING";
  address: string;
  lng: number;
  lat: number;
};

export type BuildingCategory = "residential" | "office" | "public" | "utility" | "command";

export type BuildingTwinModel = {
  id: string;
  name: string;
  category: BuildingCategory;
  footprint: [number, number][];
  height: number;
  demandMw: number;
};

export type CommandCenterStatus = "nominal" | "watch" | "critical";

export type CommandCenterEntity = {
  id: string;
  name: string;
  lng: number;
  lat: number;
  radiusMeters: number;
  towerHeight: number;
  status: CommandCenterStatus;
};

export type SimulationScenarioKey =
  | "city_baseline"
  | "rush_hour"
  | "night_charge"
  | "grid_stress";

export type HeatPoint = {
  lng: number;
  lat: number;
  weight: number;
};
