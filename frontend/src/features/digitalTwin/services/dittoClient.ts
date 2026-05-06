import { DITTO_PROXY_BASE_URL } from "@/features/digitalTwin/config/constants";
import type { DittoThingPayload } from "@/features/digitalTwin/types/twin";

async function requestDitto<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${DITTO_PROXY_BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Ditto API ${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function fetchThings(): Promise<DittoThingPayload[]> {
  return requestDitto<DittoThingPayload[]>("/things");
}

export function fetchThing(thingId: string): Promise<DittoThingPayload> {
  return requestDitto<DittoThingPayload>(`/things/${encodeURIComponent(thingId)}`);
}

export function createThing(thingId: string, payload: DittoThingPayload): Promise<{ thing_id: string; status: number }> {
  return requestDitto<{ thing_id: string; status: number }>(`/things/${encodeURIComponent(thingId)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function updateThing(thingId: string, payload: DittoThingPayload): Promise<{ thing_id: string; status: number }> {
  return requestDitto<{ thing_id: string; status: number }>(`/things/${encodeURIComponent(thingId)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

// Optional pattern for direct Ditto WebSocket subscription (when frontend can access Ditto gateway directly):
// const ws = new WebSocket(`${process.env.NEXT_PUBLIC_DITTO_WS_URL}/ws/2`, ["ditto"]);
// ws.onopen = () => {
//   ws.send(JSON.stringify({
//     topic: "_/_/things/twin/events",
//     headers: {
//       responseRequired: false
//     },
//     path: "/",
//     value: {}
//   }));
// };
