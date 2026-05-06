import { ArcLayer } from "@deck.gl/layers";
import type { ChargerEntity, CommandCenterEntity, EVEntity } from "@/types/entities";

type FlowLink = {
  id: string;
  sourcePosition: [number, number];
  targetPosition: [number, number];
  ratio: number;
};

export function createPowerFlowLayer(
  commandCenter: CommandCenterEntity,
  chargers: ChargerEntity[],
  evs: EVEntity[]
) {
  const chargerLinks: FlowLink[] = chargers.map((charger) => ({
    id: `flow-charger-${charger.id}`,
    sourcePosition: [commandCenter.lng, commandCenter.lat],
    targetPosition: [charger.lng, charger.lat],
    ratio: charger.occupancy
  }));

  const priorityEvs = [...evs]
    .sort((a, b) => a.soc - b.soc)
    .slice(0, Math.min(evs.length, 8));

  const evLinks: FlowLink[] = priorityEvs.map((ev) => ({
    id: `flow-ev-${ev.id}`,
    sourcePosition: [commandCenter.lng, commandCenter.lat],
    targetPosition: [ev.lng, ev.lat],
    ratio: Math.max(0.1, (100 - ev.soc) / 100)
  }));

  return new ArcLayer<FlowLink>({
    id: "power-flow-layer",
    data: [...chargerLinks, ...evLinks],
    getSourcePosition: (link) => link.sourcePosition,
    getTargetPosition: (link) => link.targetPosition,
    getSourceColor: [98, 226, 255, 195],
    getTargetColor: (link) => [255, 184, 92, Math.round(120 + link.ratio * 110)],
    getWidth: (link) => 2 + link.ratio * 5,
    widthUnits: "meters",
    pickable: false
  });
}
