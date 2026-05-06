import { PathLayer } from "@deck.gl/layers";
import type { GridSegmentEntity } from "@/types/entities";

export function createGridLayer(data: GridSegmentEntity[]) {
  return new PathLayer<GridSegmentEntity>({
    id: "grid-segment-layer",
    data,
    getPath: (d) => d.path,
    widthUnits: "meters",
    getWidth: 26,
    getColor: (d) => {
      const ratio = Math.max(0, Math.min(1, d.loadRatio));
      const red = Math.round(255 * ratio);
      const green = Math.round(220 * (1 - ratio));
      return [red, green, 120, 230];
    },
    jointRounded: true,
    capRounded: true,
    pickable: true,
    autoHighlight: true
  });
}
