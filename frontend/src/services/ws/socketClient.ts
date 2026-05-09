import { WS_URL } from "@/config/appConfig";

export function createRealtimeSocket() {
  return new WebSocket(WS_URL);
}
