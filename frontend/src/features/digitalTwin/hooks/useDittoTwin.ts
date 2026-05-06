"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HANOI_CENTER } from "@/features/digitalTwin/config/constants";
import { createMockScene } from "@/features/digitalTwin/lib/mockScene";
import { createThing, fetchThings, updateThing } from "@/features/digitalTwin/services/dittoClient";
import { fromDittoThings, toDittoThingPayload } from "@/features/digitalTwin/services/dittoMapper";
import type {
  CreateObjectPayload,
  DashboardMetrics,
  TwinSceneState,
  TwinThing
} from "@/features/digitalTwin/types/twin";

function nowISO(): string {
  return new Date().toISOString();
}

function createBootstrapScene(): TwinSceneState {
  const stableTime = "1970-01-01T00:00:00.000Z";

  return {
    evs: [],
    chargingStations: [],
    substations: [],
    buildings: [],
    controlCenter: {
      id: "control-center-bootstrap",
      thingId: "digitaltwin.hanoi:control_center-bootstrap",
      type: "CONTROL_CENTER",
      name: "Hoan Kiem Control Center",
      source: "mock",
      position: [HANOI_CENTER[0] + 0.0012, HANOI_CENTER[1] - 0.0004, 20],
      monitoredDistrict: "Hoan Kiem",
      gridLoad: 0,
      createdAt: stableTime,
      updatedAt: stableTime
    },
    simulationTime: 0,
    simulationTick: 0
  };
}

function toMetrics(scene: TwinSceneState): DashboardMetrics {
  const totalEVs = scene.evs.length;
  const chargingStationsInUse = scene.chargingStations.filter((station) => station.occupiedPorts > 0).length;
  const averageBatteryLevel =
    totalEVs > 0 ? scene.evs.reduce((sum, ev) => sum + ev.batteryLevel, 0) / totalEVs : 0;

  const avgSubstationLoad =
    scene.substations.length > 0
      ? scene.substations.reduce((sum, station) => sum + station.loadLevel, 0) / scene.substations.length
      : 0;

  return {
    totalEVs,
    chargingStationsInUse,
    currentGridLoad: avgSubstationLoad,
    averageBatteryLevel
  };
}

export function useDittoTwin() {
  const [scene, setScene] = useState<TwinSceneState>(() => createBootstrapScene());
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadFromDitto = useCallback(async () => {
    try {
      const things = await fetchThings();
      if (things.length === 0) {
        setScene(createMockScene());
        setSyncError("Ditto returned no objects. Showing mock Hanoi scene.");
      } else {
        setScene(fromDittoThings(things));
        setSyncError(null);
      }
    } catch (error) {
      setScene(createMockScene());
      setSyncError(error instanceof Error ? error.message : "Unable to fetch Ditto things.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFromDitto();
  }, [loadFromDitto]);

  const persistThing = useCallback(async (thing: TwinThing, mode: "create" | "update") => {
    const payload = toDittoThingPayload(thing);
    if (mode === "create") {
      await createThing(thing.thingId, payload);
      return;
    }
    await updateThing(thing.thingId, payload);
  }, []);

  const persistSceneBatch = useCallback(async (things: TwinThing[]) => {
    await Promise.allSettled(things.map((thing) => persistThing(thing, "update")));
  }, [persistThing]);

  const subscribeToDitto = useCallback(() => {
    // For real-time subscriptions later, connect directly to Ditto WebSocket and
    // translate incoming events into scene updates.
    //
    // Example skeleton:
    // const ws = new WebSocket(`${process.env.NEXT_PUBLIC_DITTO_WS_URL}/ws/2`, ["ditto"]);
    // ws.onopen = () => {
    //   ws.send(JSON.stringify({
    //     topic: "_/_/things/twin/events",
    //     path: "/",
    //     headers: { responseRequired: false },
    //     value: {}
    //   }));
    // };
    // ws.onmessage = (event) => {
    //   // Parse Ditto event and merge into local scene state.
    // };
    // return () => ws.close();

    return () => {
      // No-op in demo mode.
    };
  }, []);

  const createObjectAtCoordinate = useCallback(
    async (payload: CreateObjectPayload) => {
      const idSeed = String(Date.now());
      const createdAt = nowISO();

      if (payload.type === "EV") {
        const id = `ev-${idSeed}`;
        const thing: TwinThing = {
          id,
          thingId: `digitaltwin.hanoi:ev-${idSeed}`,
          type: "EV",
          name: payload.name,
          source: "mock",
          position: payload.position,
          heading: 0,
          speedKmh: 24,
          batteryLevel: payload.batteryLevel ?? 72,
          status: "idle",
          route: [
            { position: payload.position, timestamp: 0 },
            { position: payload.position, timestamp: 1 }
          ],
          routeCursor: 0,
          createdAt,
          updatedAt: createdAt
        };

        setScene((prev) => ({ ...prev, evs: [...prev.evs, thing] }));
        await persistThing(thing, "create");
        return;
      }

      if (payload.type === "CHARGING_STATION") {
        const id = `station-${idSeed}`;
        const thing: TwinThing = {
          id,
          thingId: `digitaltwin.hanoi:charging_station-${idSeed}`,
          type: "CHARGING_STATION",
          name: payload.name,
          source: "mock",
          position: payload.position,
          capacity: payload.capacity ?? 4,
          parkedEVs: 0,
          occupiedPorts: 0,
          status: "available",
          loadLevel: 0,
          createdAt,
          updatedAt: createdAt
        };

        setScene((prev) => ({ ...prev, chargingStations: [...prev.chargingStations, thing] }));
        await persistThing(thing, "create");
        return;
      }

      const id = `substation-${idSeed}`;
      const thing: TwinThing = {
        id,
        thingId: `digitaltwin.hanoi:power_substation-${idSeed}`,
        type: "POWER_SUBSTATION",
        name: payload.name,
        source: "mock",
        position: payload.position,
        maxMw: payload.maxMw ?? 8,
        currentMw: (payload.maxMw ?? 8) * 0.45,
        status: "normal",
        loadLevel: 0.45,
        createdAt,
        updatedAt: createdAt
      };

      setScene((prev) => ({ ...prev, substations: [...prev.substations, thing] }));
      await persistThing(thing, "create");
    },
    [persistThing]
  );

  const metrics = useMemo(() => toMetrics(scene), [scene]);

  return {
    scene,
    setScene,
    metrics,
    loading,
    syncError,
    loadFromDitto,
    createObjectAtCoordinate,
    persistThing,
    persistSceneBatch,
    subscribeToDitto
  };
}
