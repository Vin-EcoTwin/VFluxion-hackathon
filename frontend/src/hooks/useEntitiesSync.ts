"use client";

import { useCallback, useEffect, useState } from "react";
import { logger } from "@/lib/utils/logger";
import { entitiesService } from "@/services/api/entities.service";
import { useEntitiesStore } from "@/stores/entities.store";
import type { ChargerEntity, EVEntity } from "@/types/entities";

const POLL_INTERVAL_MS = 18000;

export type CreateEVInput = {
  name: string;
  lng: number;
  lat: number;
  soc: number;
  speedKmh: number;
};

export type CreateChargerInput = {
  name: string;
  lng: number;
  lat: number;
  maxKw: number;
  occupancy: number;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unable to load entities";
}

function makeLocalId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export function useEntitiesSync() {
  const hydrateFromBackend = useEntitiesStore((state) => state.hydrateFromBackend);
  const hydrateFromMock = useEntitiesStore((state) => state.hydrateFromMock);
  const addLocalEV = useEntitiesStore((state) => state.addLocalEV);
  const addLocalCharger = useEntitiesStore((state) => state.addLocalCharger);
  const dataSource = useEntitiesStore((state) => state.dataSource);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityCount, setEntityCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const entities = await entitiesService.list();

      if (entities.length === 0) {
        hydrateFromMock();
        setError("Backend has no entities, mock city model loaded.");
      } else {
        hydrateFromBackend(entities);
        setError(null);
      }

      setEntityCount(entities.length);
    } catch (err) {
      logger.warn("Backend unreachable, switching to mock model", err);
      hydrateFromMock();
      setError(`Running mock mode: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [hydrateFromBackend, hydrateFromMock]);

  const createEV = useCallback(
    async (input: CreateEVInput) => {
      const localEV: EVEntity = {
        id: makeLocalId("local-ev"),
        name: input.name,
        type: "EV",
        lng: input.lng,
        lat: input.lat,
        soc: input.soc,
        speedKmh: input.speedKmh
      };
      addLocalEV(localEV);

      try {
        await entitiesService.create({
          name: input.name,
          type: "EV",
          location: {
            lng: input.lng,
            lat: input.lat
          },
          soc: input.soc,
          speed_kmh: input.speedKmh
        });
        await refresh();
      } catch (err) {
        logger.warn("Create EV fallback to local mode", err);
        setError(`EV created locally only: ${getErrorMessage(err)}`);
      }
    },
    [addLocalEV, refresh]
  );

  const createCharger = useCallback(
    async (input: CreateChargerInput) => {
      const localCharger: ChargerEntity = {
        id: makeLocalId("local-charger"),
        name: input.name,
        type: "CHARGER",
        lng: input.lng,
        lat: input.lat,
        maxKw: input.maxKw,
        occupancy: input.occupancy
      };
      addLocalCharger(localCharger);

      try {
        await entitiesService.create({
          name: input.name,
          type: "CHARGER",
          location: {
            lng: input.lng,
            lat: input.lat
          },
          max_kw: input.maxKw,
          occupancy_ratio: input.occupancy
        });
        await refresh();
      } catch (err) {
        logger.warn("Create charger fallback to local mode", err);
        setError(`Charger created locally only: ${getErrorMessage(err)}`);
      }
    },
    [addLocalCharger, refresh]
  );

  useEffect(() => {
    void refresh();
    const timerId = window.setInterval(() => {
      void refresh();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [refresh]);

  return {
    isLoading,
    error,
    dataSource,
    entityCount,
    refresh,
    createEV,
    createCharger
  };
}
