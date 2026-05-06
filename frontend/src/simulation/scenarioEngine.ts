import { simulationService } from "@/services/api/simulation.service";
import type { ScenarioRequest, ScenarioResponse } from "@/types/api";

export async function runScenario(request: ScenarioRequest): Promise<ScenarioResponse> {
  return simulationService.runScenario(request);
}
