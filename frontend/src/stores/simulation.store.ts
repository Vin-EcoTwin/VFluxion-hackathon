import { create } from "zustand";
import type { RealtimeEnvelope } from "@/types/websocket";

export type SimulationState = {
  events: RealtimeEnvelope[];
  pushEvent: (event: RealtimeEnvelope) => void;
  pushLocalEvent: (channel: string, payload: Record<string, unknown>) => void;
  clearEvents: () => void;
};

export const useSimulationStore = create<SimulationState>((set) => ({
  events: [],
  pushEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 150)
    })),
  pushLocalEvent: (channel, payload) =>
    set((state) => ({
      events: [
        {
          channel,
          timestamp: new Date().toISOString(),
          payload
        },
        ...state.events
      ].slice(0, 150)
    })),
  clearEvents: () => set({ events: [] })
}));
