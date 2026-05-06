"use client";

import { useMemo } from "react";
import { createBaseMapLayer } from "@/map/deck/layers/baseMapLayer";
import { createBuildingLayer } from "@/map/deck/layers/buildingLayer";
import { createChargerLayer } from "@/map/deck/layers/chargerLayer";
import { createCommandCenterLayers } from "@/map/deck/layers/commandCenterLayer";
import { createEVLayer } from "@/map/deck/layers/evLayer";
import { createGridLayer } from "@/map/deck/layers/gridLayer";
import { createHeatmapLayer } from "@/map/deck/layers/heatmapLayer";
import { createPowerFlowLayer } from "@/map/deck/layers/powerFlowLayer";
import { useEntitiesStore } from "@/stores/entities.store";
import type { EntitiesState } from "@/stores/entities.store";

export function useDeckLayers() {
  const evs = useEntitiesStore((state: EntitiesState) => state.evs);
  const chargers = useEntitiesStore((state: EntitiesState) => state.chargers);
  const gridSegments = useEntitiesStore((state: EntitiesState) => state.gridSegments);
  const heatPoints = useEntitiesStore((state: EntitiesState) => state.heatPoints);
  const buildings = useEntitiesStore((state: EntitiesState) => state.buildings);
  const commandCenter = useEntitiesStore((state: EntitiesState) => state.commandCenter);

  return useMemo(() => {
    const commandCenterLayers = createCommandCenterLayers(commandCenter);
    return [
      createBaseMapLayer(),
      createGridLayer(gridSegments),
      createHeatmapLayer(heatPoints),
      createBuildingLayer(buildings),
      createChargerLayer(chargers),
      createEVLayer(evs),
      createPowerFlowLayer(commandCenter, chargers, evs),
      ...commandCenterLayers
    ];
  }, [evs, chargers, gridSegments, heatPoints, buildings, commandCenter]);
}
