export type ApiError = {
  detail: string;
};

export type ScenarioRequest = {
  scenarioName: string;
  durationMinutes: number;
  targetDistrict: string;
};

export type ScenarioResponse = {
  scenarioId: string;
  status: "started" | "completed";
  estimatedLoadShift: number;
};
