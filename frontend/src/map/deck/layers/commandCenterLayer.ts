import { ColumnLayer, ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import type { CommandCenterEntity } from "@/types/entities";

function statusColor(status: CommandCenterEntity["status"]): [number, number, number, number] {
  if (status === "critical") {
    return [255, 86, 86, 235];
  }
  if (status === "watch") {
    return [255, 186, 82, 235];
  }
  return [96, 232, 255, 235];
}

export function createCommandCenterLayers(commandCenter: CommandCenterEntity) {
  const color = statusColor(commandCenter.status);

  const tower = new ColumnLayer<CommandCenterEntity>({
    id: "command-center-tower",
    data: [commandCenter],
    extruded: true,
    diskResolution: 24,
    radius: 38,
    radiusUnits: "meters",
    getPosition: (entity) => [entity.lng, entity.lat],
    getElevation: (entity) => entity.towerHeight,
    getFillColor: color,
    getLineColor: [255, 255, 255, 230],
    material: {
      ambient: 0.28,
      diffuse: 0.75,
      shininess: 84,
      specularColor: [255, 250, 246]
    },
    pickable: true,
    autoHighlight: true
  });

  const coverage = new ScatterplotLayer<CommandCenterEntity>({
    id: "command-center-coverage",
    data: [commandCenter],
    stroked: true,
    filled: false,
    radiusUnits: "meters",
    getPosition: (entity) => [entity.lng, entity.lat],
    getRadius: (entity) => entity.radiusMeters,
    getLineColor: color,
    lineWidthUnits: "meters",
    getLineWidth: 2,
    pickable: false
  });

  const label = new TextLayer<CommandCenterEntity>({
    id: "command-center-label",
    data: [commandCenter],
    getPosition: (entity) => [entity.lng, entity.lat],
    getText: (entity) => `${entity.name} (${entity.status.toUpperCase()})`,
    getColor: [248, 250, 255, 255],
    getSize: 14,
    sizeUnits: "pixels",
    getPixelOffset: [0, -28],
    getTextAnchor: "middle",
    getAlignmentBaseline: "bottom",
    billboard: true,
    pickable: false
  });

  return [tower, coverage, label];
}
