import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import type { HeatPoint } from "@/types/entities";

export function createHeatmapLayer(data: HeatPoint[]) {
  return new HeatmapLayer<HeatPoint>({
    id: "charger-heat-layer",
    data,
    getPosition: (d: HeatPoint) => [d.lng, d.lat],
    getWeight: (d: HeatPoint) => d.weight,
    radiusPixels: 52,
    intensity: 1.2,
    threshold: 0.08
  });
}
