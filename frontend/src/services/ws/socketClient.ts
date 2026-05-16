import { WS_URL } from "@/config/appConfig";

export function createRealtimeSocket(): WebSocket | null {
  if (!WS_URL) {
    return null;
  }

  return new WebSocket(WS_URL);
}
