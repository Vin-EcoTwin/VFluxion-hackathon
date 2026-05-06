export function createRealtimeSocket() {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/realtime";
  return new WebSocket(wsUrl);
}
