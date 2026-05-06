export type RealtimeEnvelope = {
  channel: string;
  timestamp: string;
  payload: Record<string, unknown>;
};
