import type { ScenarioRequest } from "@/types/api";

export const scenarioPresets: ScenarioRequest[] = [
  {
    scenarioName: "rush-hour-v2g",
    durationMinutes: 30,
    targetDistrict: "Hoan Kiem"
  },
  {
    scenarioName: "night-charge-balance",
    durationMinutes: 45,
    targetDistrict: "Ba Dinh"
  }
];
