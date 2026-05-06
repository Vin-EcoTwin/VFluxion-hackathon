import { apiClient } from "@/services/api/client";
import type { ScenarioRequest, ScenarioResponse } from "@/types/api";

export const simulationService = {
  runScenario: (payload: ScenarioRequest) =>
    apiClient<ScenarioResponse>("/simulation/run", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
