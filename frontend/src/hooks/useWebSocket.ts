"use client";

import { useEffect } from "react";
import { createRealtimeSocket } from "@/services/ws/socketClient";
import { logger } from "@/lib/utils/logger";
import { useSimulationStore } from "@/stores/simulation.store";
import type { SimulationState } from "@/stores/simulation.store";
import type { RealtimeEnvelope } from "@/types/websocket";

export function useWebSocket() {
  const pushEvent = useSimulationStore((state: SimulationState) => state.pushEvent);

  useEffect(() => {
    const socket = createRealtimeSocket();

    socket.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data) as RealtimeEnvelope;
        pushEvent(payload);
      } catch (error) {
        logger.error("Invalid realtime payload", error);
      }
    };

    socket.onerror = (event) => {
      logger.error("Realtime socket error", event);
    };

    return () => {
      socket.close();
    };
  }, [pushEvent]);
}
