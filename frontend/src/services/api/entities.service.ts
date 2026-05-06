import { apiClient } from "@/services/api/client";
import type { BackendEntityPayload, CreateBackendEntityPayload } from "@/types/backend";

export const entitiesService = {
  list: () => apiClient<BackendEntityPayload[]>("/entities"),
  create: (payload: CreateBackendEntityPayload) =>
    apiClient<BackendEntityPayload>("/entities", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
