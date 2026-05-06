import { apiClient } from "@/services/api/client";

export type DittoThing = {
  thingId: string;
  policyId?: string;
  attributes?: Record<string, unknown>;
  features?: Record<string, unknown>;
};

export const dittoService = {
  listThings: () => apiClient<DittoThing[]>("/ditto/things")
};
