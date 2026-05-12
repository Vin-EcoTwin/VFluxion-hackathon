export type LngLatAlt = [number, number, number];

export type TwinThingType =
  | "EV"
  | "CHARGING_STATION"
  | "POWER_SUBSTATION"
  | "CONTROL_CENTER"
  | "BUILDING";

export type GridLineStatus = "normal" | "high" | "overload";

export type EVStatus = "moving" | "charging" | "idle";

export type StationStatus = "available" | "occupied" | "charging";

export type SubstationStatus = "normal" | "warning" | "overload";

export type TwinSource = "backend" | "mock";

export interface RoutePoint {
  position: LngLatAlt;
  timestamp: number;
}

export interface BaseTwinThing {
  id: string;
  thingId: string;
  type: TwinThingType;
  name: string;
  source: TwinSource;
  position: LngLatAlt;
  createdAt: string;
  updatedAt: string;
}

export interface EVThing extends BaseTwinThing {
  type: "EV";
  heading: number;
  speedKmh: number;
  batteryLevel: number;
  status: EVStatus;
  route: RoutePoint[];
  routeCursor: number;
}

export interface ChargingStationThing extends BaseTwinThing {
  type: "CHARGING_STATION";
  heading?: number;
  capacity: number;
  parkedEVs: number;
  occupiedPorts: number;
  status: StationStatus;
  loadLevel: number;
}

export interface PowerSubstationThing extends BaseTwinThing {
  type: "POWER_SUBSTATION";
  maxMw: number;
  currentMw: number;
  status: SubstationStatus;
  loadLevel: number;
}

export interface ControlCenterThing extends BaseTwinThing {
  type: "CONTROL_CENTER";
  monitoredDistrict: string;
  gridLoad: number;
}

export interface BuildingThing extends BaseTwinThing {
  type: "BUILDING";
  height: number;
  footprint: [number, number][];
  district: string;
}

export type TwinThing =
  | EVThing
  | ChargingStationThing
  | PowerSubstationThing
  | ControlCenterThing
  | BuildingThing;

export interface TwinSceneState {
  evs: EVThing[];
  chargingStations: ChargingStationThing[];
  substations: PowerSubstationThing[];
  buildings: BuildingThing[];
  controlCenter: ControlCenterThing;
  simulationTime: number;
  simulationTick: number;
}

export type CreateObjectType = "EV" | "CHARGING_STATION" | "POWER_SUBSTATION";

export interface CreateObjectPayload {
  type: CreateObjectType;
  name: string;
  position: LngLatAlt;
  heading?: number;
  batteryLevel?: number;
  capacity?: number;
  maxMw?: number;
}

export interface DashboardMetrics {
  totalEVs: number;
  chargingStationsInUse: number;
  currentGridLoad: number;
  averageBatteryLevel: number;
}
