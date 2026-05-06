"use client";

import { useEffect } from "react";
import { useEntitiesStore } from "@/stores/entities.store";
import { useSimulationStore } from "@/stores/simulation.store";

const STEP_INTERVAL_MS = 1400;

export function useScenarioSimulation() {
  const isSimulationRunning = useEntitiesStore((state) => state.isSimulationRunning);
  const simulationScenario = useEntitiesStore((state) => state.simulationScenario);
  const stepSimulation = useEntitiesStore((state) => state.stepSimulation);
  const pushLocalEvent = useSimulationStore((state) => state.pushLocalEvent);

  useEffect(() => {
    if (!isSimulationRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      stepSimulation();
      const state = useEntitiesStore.getState();
      pushLocalEvent("mock.simulation.tick", {
        scenario: simulationScenario,
        tick: state.simulationTick,
        evCount: state.evs.length,
        chargerCount: state.chargers.length
      });
    }, STEP_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isSimulationRunning, simulationScenario, stepSimulation, pushLocalEvent]);
}
