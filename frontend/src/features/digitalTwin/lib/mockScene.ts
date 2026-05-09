import {
  DEFAULT_EV_COUNT,
  DEFAULT_STATION_COUNT,
  DEFAULT_SUBSTATION_COUNT,
  TWIN_NAMESPACE,
  HANOI_CENTER
} from "@/features/digitalTwin/config/constants";
import { createLoopRoute, randomInRange, randomLngLatAlt } from "@/features/digitalTwin/lib/geo";
import type {
  BuildingThing,
  ChargingStationThing,
  ControlCenterThing,
  EVThing,
  PowerSubstationThing,
  TwinSceneState
} from "@/features/digitalTwin/types/twin";

function nowISO(): string {
  return new Date().toISOString();
}

function makeThingId(type: string, id: string): string {
  return `${TWIN_NAMESPACE}:${type.toLowerCase()}-${id}`;
}

function createControlCenter(): ControlCenterThing {
  const id = "control-center-01";
  return {
    id,
    thingId: makeThingId("control_center", id),
    type: "CONTROL_CENTER",
    name: "Hoan Kiem Control Center",
    source: "mock",
    position: [HANOI_CENTER[0] + 0.0012, HANOI_CENTER[1] - 0.0004, 20],
    monitoredDistrict: "Hoan Kiem",
    gridLoad: 0.46,
    createdAt: nowISO(),
    updatedAt: nowISO()
  };
}

function createBuildings(): BuildingThing[] {
  const raw = [
    { name: "Command Campus", lng: 105.8512, lat: 21.0274, h: 78, district: "Hoan Kiem" },
    { name: "City Office A", lng: 105.853, lat: 21.0291, h: 54, district: "Hoan Kiem" },
    { name: "City Office B", lng: 105.8487, lat: 21.0287, h: 61, district: "Hoan Kiem" },
    { name: "Public Service Hub", lng: 105.8525, lat: 21.0259, h: 45, district: "Hoan Kiem" },
    { name: "Residential Cluster", lng: 105.8546, lat: 21.0268, h: 38, district: "Hoan Kiem" }
  ];

  return raw.map((entry, index) => {
    const id = `building-${index + 1}`;
    const width = 0.00022;
    const height = 0.00017;
    return {
      id,
      thingId: makeThingId("building", id),
      type: "BUILDING",
      name: entry.name,
      source: "mock",
      position: [entry.lng, entry.lat, 0],
      height: entry.h,
      district: entry.district,
      footprint: [
        [entry.lng - width, entry.lat - height],
        [entry.lng + width, entry.lat - height],
        [entry.lng + width, entry.lat + height],
        [entry.lng - width, entry.lat + height]
      ],
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
  });
}

function createEVs(count: number): EVThing[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `ev-${index + 1}`;
    const start = randomLngLatAlt(1.2);
    const route = createLoopRoute(start, 28 + (index % 8));
    return {
      id,
      thingId: makeThingId("ev", id),
      type: "EV",
      name: `EV-${String(index + 1).padStart(3, "0")}`,
      source: "mock",
      position: route[0].position,
      heading: 0,
      speedKmh: randomInRange(20, 48),
      batteryLevel: randomInRange(34, 96),
      status: "moving",
      route,
      routeCursor: 0,
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
  });
}

function createChargingStations(count: number): ChargingStationThing[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `station-${index + 1}`;
    const [lng, lat] = randomLngLatAlt(0);
    const occupied = Math.round(randomInRange(0, 4));
    return {
      id,
      thingId: makeThingId("charging_station", id),
      type: "CHARGING_STATION",
      name: `Charging Hub ${index + 1}`,
      source: "mock",
      position: [lng, lat, 0],
      capacity: 4,
      parkedEVs: occupied,
      occupiedPorts: occupied,
      status: occupied === 0 ? "available" : occupied < 4 ? "charging" : "occupied",
      loadLevel: occupied / 4,
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
  });
}

function createSubstations(count: number): PowerSubstationThing[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `substation-${index + 1}`;
    const [lng, lat] = randomLngLatAlt(0);
    const maxMw = randomInRange(6, 12);
    const currentMw = randomInRange(2.2, 7.8);
    const loadLevel = currentMw / maxMw;
    return {
      id,
      thingId: makeThingId("power_substation", id),
      type: "POWER_SUBSTATION",
      name: `Substation ${index + 1}`,
      source: "mock",
      position: [lng, lat, 0],
      maxMw,
      currentMw,
      loadLevel,
      status: loadLevel >= 0.9 ? "overload" : loadLevel >= 0.68 ? "warning" : "normal",
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
  });
}

export function createMockScene(
  evCount = DEFAULT_EV_COUNT,
  stationCount = DEFAULT_STATION_COUNT,
  substationCount = DEFAULT_SUBSTATION_COUNT
): TwinSceneState {
  return {
    evs: createEVs(evCount),
    chargingStations: createChargingStations(stationCount),
    substations: createSubstations(substationCount),
    buildings: createBuildings(),
    controlCenter: createControlCenter(),
    simulationTime: 0,
    simulationTick: 0
  };
}
