"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { headingFrom } from "@/features/digitalTwin/lib/geo";
import type {
  ChargingStationThing,
  EVThing,
  PowerSubstationThing,
  TwinSceneState,
  TwinThing
} from "@/features/digitalTwin/types/twin";

const SIM_STEP_MS = 900;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function useTwinSimulation(
  scene: TwinSceneState,
  setScene: React.Dispatch<React.SetStateAction<TwinSceneState>>,
  persistSceneBatch: (things: TwinThing[]) => Promise<void>
) {
  const [running, setRunning] = useState(false);
  const [persistEveryTicks] = useState(5);
  const tickRef = useRef(0);

  const runStep = useCallback(() => {
    setScene((prev) => {
      const nextTick = prev.simulationTick + 1;
      const nextTime = prev.simulationTime + 1;

      const evs = prev.evs.map((ev, index) => {
        if (ev.route.length < 2) {
          return ev;
        }

        const cursor = (ev.routeCursor + 1) % ev.route.length;
        const nextPoint = ev.route[cursor];
        const previousPoint = ev.route[ev.routeCursor];

        const chargingBias = prev.chargingStations.some(
          (station) => Math.abs(station.position[0] - nextPoint.position[0]) < 0.00025 && Math.abs(station.position[1] - nextPoint.position[1]) < 0.00025
        );

        const batteryDelta = chargingBias ? 1.1 : -0.42 - (index % 6) * 0.07;
        const nextBattery = clamp01((ev.batteryLevel + batteryDelta) / 100) * 100;
        const status: EVThing["status"] = chargingBias ? "charging" : "moving";

        return {
          ...ev,
          routeCursor: cursor,
          position: nextPoint.position,
          heading: headingFrom(previousPoint.position, nextPoint.position),
          batteryLevel: Number(nextBattery.toFixed(2)),
          status,
          updatedAt: new Date().toISOString()
        };
      });

      const chargingStations = prev.chargingStations.map((station, index) => {
        const wave = 0.45 + Math.sin((nextTick + index) * 0.12) * 0.35;
        const occupied = Math.max(0, Math.min(station.capacity, Math.round(station.capacity * wave)));
        const status: ChargingStationThing["status"] =
          occupied === 0 ? "available" : occupied >= station.capacity ? "occupied" : "charging";
        return {
          ...station,
          parkedEVs: Math.max(0, Math.min(4, occupied)),
          occupiedPorts: occupied,
          loadLevel: occupied / station.capacity,
          status,
          updatedAt: new Date().toISOString()
        };
      });

      const substations = prev.substations.map((substation, index) => {
        const stationContribution = chargingStations[index % Math.max(chargingStations.length, 1)]?.loadLevel ?? 0.3;
        const loadLevel = clamp01(0.35 + stationContribution * 0.5 + Math.sin((nextTick + index) * 0.08) * 0.16);
        const currentMw = substation.maxMw * loadLevel;
        const status: PowerSubstationThing["status"] =
          loadLevel >= 0.9 ? "overload" : loadLevel >= 0.7 ? "warning" : "normal";
        return {
          ...substation,
          loadLevel,
          currentMw: Number(currentMw.toFixed(2)),
          status,
          updatedAt: new Date().toISOString()
        };
      });

      const avgGridLoad =
        substations.reduce((sum, station) => sum + station.loadLevel, 0) /
        Math.max(substations.length, 1);

      const controlCenter = {
        ...prev.controlCenter,
        gridLoad: Number(avgGridLoad.toFixed(3)),
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        evs,
        chargingStations,
        substations,
        controlCenter,
        simulationTick: nextTick,
        simulationTime: nextTime
      };
    });
  }, [setScene]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      tickRef.current += 1;
      runStep();
    }, SIM_STEP_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [runStep, running]);

  useEffect(() => {
    if (!running) {
      return;
    }

    if (scene.simulationTick % persistEveryTicks !== 0 || scene.simulationTick === 0) {
      return;
    }

    const changedThings: TwinThing[] = [
      ...scene.evs,
      ...scene.chargingStations,
      ...scene.substations,
      scene.controlCenter
    ];

    void persistSceneBatch(changedThings);
  }, [persistEveryTicks, persistSceneBatch, running, scene]);

  const toggleSimulation = useCallback(() => {
    setRunning((prev) => !prev);
  }, []);

  return {
    running,
    toggleSimulation,
    stepOnce: runStep
  };
}
