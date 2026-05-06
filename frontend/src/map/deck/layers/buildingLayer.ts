import { PolygonLayer } from "@deck.gl/layers";
import type { BuildingTwinModel } from "@/types/entities";

function colorByCategory(category: BuildingTwinModel["category"]): [number, number, number, number] {
  switch (category) {
    case "command":
      return [92, 226, 255, 228];
    case "office":
      return [132, 189, 255, 212];
    case "public":
      return [126, 234, 172, 210];
    case "utility":
      return [255, 195, 86, 216];
    case "residential":
    default:
      return [198, 206, 230, 198];
  }
}

export function createBuildingLayer(data: BuildingTwinModel[]) {
  return new PolygonLayer<BuildingTwinModel>({
    id: "building-layer",
    data,
    extruded: true,
    wireframe: true,
    getPolygon: (building) => building.footprint,
    getElevation: (building) => building.height,
    elevationScale: 1,
    getFillColor: (building) => colorByCategory(building.category),
    getLineColor: [34, 42, 58, 220],
    lineWidthMinPixels: 1,
    material: {
      ambient: 0.36,
      diffuse: 0.62,
      shininess: 22,
      specularColor: [255, 255, 245]
    },
    pickable: true,
    autoHighlight: true
  });
}
