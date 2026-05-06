import { ColumnLayer } from "@deck.gl/layers";
import type { EVEntity } from "@/types/entities";

export function createEVLayer(data: EVEntity[]) {
  return new ColumnLayer<EVEntity>({
    id: "ev-layer",
    data,
    extruded: true,
    diskResolution: 20,
    radius: 22,
    radiusUnits: "meters",
    getPosition: (d) => [d.lng, d.lat],
    getElevation: (d) => Math.max(30, d.soc * 1.4 + d.speedKmh * 1.2),
    getFillColor: (d) => {
      const socRatio = Math.max(0, Math.min(1, d.soc / 100));
      const red = Math.round(255 * (1 - socRatio));
      const green = Math.round(210 * socRatio);
      return [red, green, 255, 225];
    },
    getLineColor: [255, 249, 255, 220],
    lineWidthUnits: "pixels",
    lineWidthMinPixels: 1,
    material: {
      ambient: 0.35,
      diffuse: 0.7,
      shininess: 64,
      specularColor: [220, 220, 255]
    },
    pickable: true,
    autoHighlight: true
  });
}
