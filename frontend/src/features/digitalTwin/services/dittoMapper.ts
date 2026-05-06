import { DITTO_NAMESPACE, HANOI_CENTER } from "@/features/digitalTwin/config/constants";
import { createLoopRoute } from "@/features/digitalTwin/lib/geo";
import { createMockScene } from "@/features/digitalTwin/lib/mockScene";
import type {
  BuildingThing,
  ChargingStationThing,
  ControlCenterThing,
  DittoThingPayload,
  EVThing,
  LngLatAlt,
  PowerSubstationThing,
  RoutePoint,
  TwinSceneState,
  TwinThing
} from "@/features/digitalTwin/types/twin";

function nowISO(): string {
  return new Date().toISOString();
}

function toThingId(type: string, id: string): string {
  return `${DITTO_NAMESPACE}:${type.toLowerCase()}-${id}`;
}

export function toDittoThingPayload(thing: TwinThing): DittoThingPayload {
  return {
    thingId: thing.thingId,
    policyId: thing.thingId,
    attributes: {
      twinType: thing.type,
      name: thing.name,
      source: thing.source,
      createdAt: thing.createdAt,
      updatedAt: thing.updatedAt
    },
    features: {
      state: {
        properties: thing as unknown as Record<string, unknown>
      }
    }
  };
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function toLngLatAlt(value: unknown, fallback: LngLatAlt): LngLatAlt {
  if (!Array.isArray(value) || value.length < 2) {
    return fallback;
  }

  const lng = asNumber(value[0], fallback[0]);
  const lat = asNumber(value[1], fallback[1]);
  const alt = asNumber(value[2], fallback[2]);
  return [lng, lat, alt];
}

function toRoute(value: unknown, fallbackStart: LngLatAlt): RoutePoint[] {
  if (!Array.isArray(value)) {
    return createLoopRoute(fallbackStart);
  }

  const parsed = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as { position?: unknown; timestamp?: unknown };
      return {
        position: toLngLatAlt(candidate.position, fallbackStart),
        timestamp: asNumber(candidate.timestamp, 0)
      } satisfies RoutePoint;
    })
    .filter((item): item is RoutePoint => item !== null);

  return parsed.length >= 2 ? parsed : createLoopRoute(fallbackStart);
}

function toFootprint(value: unknown, position: LngLatAlt): [number, number][] {
  if (!Array.isArray(value)) {
    return [
      [position[0] - 0.0002, position[1] - 0.00016],
      [position[0] + 0.0002, position[1] - 0.00016],
      [position[0] + 0.0002, position[1] + 0.00016],
      [position[0] - 0.0002, position[1] + 0.00016]
    ];
  }

  const parsed = value
    .map((point) => {
      if (!Array.isArray(point) || point.length < 2) {
        return null;
      }
      return [asNumber(point[0], position[0]), asNumber(point[1], position[1])] as [number, number];
    })
    .filter((point): point is [number, number] => point !== null);

  return parsed.length >= 3
    ? parsed
    : [
        [position[0] - 0.0002, position[1] - 0.00016],
        [position[0] + 0.0002, position[1] - 0.00016],
        [position[0] + 0.0002, position[1] + 0.00016],
        [position[0] - 0.0002, position[1] + 0.00016]
      ];
}

function mapEV(raw: Record<string, unknown>, thingId: string): EVThing {
  const id = asString(raw.id, thingId.split(":").at(-1) ?? "ev-unknown");
  const fallbackPosition: LngLatAlt = [HANOI_CENTER[0], HANOI_CENTER[1], 1.2];
  const position = toLngLatAlt(raw.position, fallbackPosition);
  const route = toRoute(raw.route, position);
  return {
    id,
    thingId,
    type: "EV",
    name: asString(raw.name, "EV"),
    source: (asString(raw.source, "ditto") === "mock" ? "mock" : "ditto"),
    position,
    heading: asNumber(raw.heading, 0),
    speedKmh: asNumber(raw.speedKmh, 28),
    batteryLevel: asNumber(raw.batteryLevel, 68),
    status: ["moving", "charging", "idle"].includes(String(raw.status))
      ? (raw.status as EVThing["status"])
      : "moving",
    route,
    routeCursor: Math.max(0, Math.floor(asNumber(raw.routeCursor, 0))),
    createdAt: asString(raw.createdAt, nowISO()),
    updatedAt: asString(raw.updatedAt, nowISO())
  };
}

function mapStation(raw: Record<string, unknown>, thingId: string): ChargingStationThing {
  const id = asString(raw.id, thingId.split(":").at(-1) ?? "station-unknown");
  const position = toLngLatAlt(raw.position, [HANOI_CENTER[0], HANOI_CENTER[1], 0]);
  const capacity = Math.max(1, Math.floor(asNumber(raw.capacity, 4)));
  const occupiedPorts = Math.max(0, Math.min(capacity, Math.floor(asNumber(raw.occupiedPorts, 1))));
  return {
    id,
    thingId,
    type: "CHARGING_STATION",
    name: asString(raw.name, "Charging station"),
    source: (asString(raw.source, "ditto") === "mock" ? "mock" : "ditto"),
    position,
    capacity,
    parkedEVs: Math.max(0, Math.min(4, Math.floor(asNumber(raw.parkedEVs, occupiedPorts)))),
    occupiedPorts,
    status: ["available", "occupied", "charging"].includes(String(raw.status))
      ? (raw.status as ChargingStationThing["status"])
      : occupiedPorts === 0
        ? "available"
        : occupiedPorts === capacity
          ? "occupied"
          : "charging",
    loadLevel: asNumber(raw.loadLevel, occupiedPorts / capacity),
    createdAt: asString(raw.createdAt, nowISO()),
    updatedAt: asString(raw.updatedAt, nowISO())
  };
}

function mapSubstation(raw: Record<string, unknown>, thingId: string): PowerSubstationThing {
  const id = asString(raw.id, thingId.split(":").at(-1) ?? "substation-unknown");
  const position = toLngLatAlt(raw.position, [HANOI_CENTER[0], HANOI_CENTER[1], 0]);
  const maxMw = asNumber(raw.maxMw, 8);
  const currentMw = asNumber(raw.currentMw, maxMw * 0.48);
  const loadLevel = maxMw > 0 ? currentMw / maxMw : 0;
  return {
    id,
    thingId,
    type: "POWER_SUBSTATION",
    name: asString(raw.name, "Power substation"),
    source: (asString(raw.source, "ditto") === "mock" ? "mock" : "ditto"),
    position,
    maxMw,
    currentMw,
    status: ["normal", "warning", "overload"].includes(String(raw.status))
      ? (raw.status as PowerSubstationThing["status"])
      : loadLevel >= 0.9
        ? "overload"
        : loadLevel >= 0.68
          ? "warning"
          : "normal",
    loadLevel,
    createdAt: asString(raw.createdAt, nowISO()),
    updatedAt: asString(raw.updatedAt, nowISO())
  };
}

function mapControlCenter(raw: Record<string, unknown>, thingId: string): ControlCenterThing {
  const id = asString(raw.id, "control-center-01");
  const position = toLngLatAlt(raw.position, [HANOI_CENTER[0] + 0.0012, HANOI_CENTER[1] - 0.0004, 20]);
  return {
    id,
    thingId,
    type: "CONTROL_CENTER",
    name: asString(raw.name, "Hoan Kiem Control Center"),
    source: (asString(raw.source, "ditto") === "mock" ? "mock" : "ditto"),
    position,
    monitoredDistrict: asString(raw.monitoredDistrict, "Hoan Kiem"),
    gridLoad: asNumber(raw.gridLoad, 0.5),
    createdAt: asString(raw.createdAt, nowISO()),
    updatedAt: asString(raw.updatedAt, nowISO())
  };
}

function mapBuilding(raw: Record<string, unknown>, thingId: string): BuildingThing {
  const id = asString(raw.id, thingId.split(":").at(-1) ?? "building-unknown");
  const position = toLngLatAlt(raw.position, [HANOI_CENTER[0], HANOI_CENTER[1], 0]);
  const footprint = toFootprint(raw.footprint, position);
  return {
    id,
    thingId,
    type: "BUILDING",
    name: asString(raw.name, "Building"),
    source: (asString(raw.source, "ditto") === "mock" ? "mock" : "ditto"),
    position,
    height: asNumber(raw.height, 44),
    footprint,
    district: asString(raw.district, "Hoan Kiem"),
    createdAt: asString(raw.createdAt, nowISO()),
    updatedAt: asString(raw.updatedAt, nowISO())
  };
}

export function fromDittoThings(things: DittoThingPayload[]): TwinSceneState {
  const fallback = createMockScene();

  const evs: EVThing[] = [];
  const chargingStations: ChargingStationThing[] = [];
  const substations: PowerSubstationThing[] = [];
  const buildings: BuildingThing[] = [];
  let controlCenter: ControlCenterThing | null = null;

  for (const thing of things) {
    const raw = (thing.features?.state?.properties ?? {}) as Record<string, unknown>;
    const type = asString(raw.type ?? thing.attributes?.twinType, "");

    if (type === "EV") {
      evs.push(mapEV(raw, thing.thingId));
      continue;
    }

    if (type === "CHARGING_STATION") {
      chargingStations.push(mapStation(raw, thing.thingId));
      continue;
    }

    if (type === "POWER_SUBSTATION") {
      substations.push(mapSubstation(raw, thing.thingId));
      continue;
    }

    if (type === "BUILDING") {
      buildings.push(mapBuilding(raw, thing.thingId));
      continue;
    }

    if (type === "CONTROL_CENTER") {
      controlCenter = mapControlCenter(raw, thing.thingId);
      continue;
    }
  }

  return {
    evs: evs.length > 0 ? evs : fallback.evs,
    chargingStations: chargingStations.length > 0 ? chargingStations : fallback.chargingStations,
    substations: substations.length > 0 ? substations : fallback.substations,
    buildings: buildings.length > 0 ? buildings : fallback.buildings,
    controlCenter: controlCenter ?? fallback.controlCenter,
    simulationTime: 0,
    simulationTick: 0
  };
}

export function makeThingId(type: TwinThing["type"], id: string): string {
  return toThingId(type.toLowerCase(), id);
}
