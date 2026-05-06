import { ColumnLayer } from "@deck.gl/layers";
import type { ChargerEntity } from "@/types/entities";

export function createChargerLayer(data: ChargerEntity[]) {
  return new ColumnLayer<ChargerEntity>({
    id: "charger-layer",
    data,
    extruded: true,
    diskResolution: 16,
    radius: 28,
    radiusUnits: "meters",
    getPosition: (d) => [d.lng, d.lat],
    getElevation: (d) => Math.max(35, d.maxKw * (0.2 + d.occupancy) * 0.8),
    getFillColor: (d) => {
      const warning = Math.round(d.occupancy * 255);
      return [255, 146 - Math.floor(warning * 0.35), 18, 220];
    },
    getLineColor: [255, 245, 214, 210],
    lineWidthUnits: "pixels",
    lineWidthMinPixels: 1,
    material: {
      ambient: 0.4,
      diffuse: 0.6,
      shininess: 36,
      specularColor: [255, 186, 105]
    },
    pickable: true,
    autoHighlight: true
  });
}
