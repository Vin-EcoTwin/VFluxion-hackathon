"use client";

import { useMemo } from "react";
import {
  AmbientLight,
  type DeckProps,
  LightingEffect,
  _SunLight as SunLight,
} from "@deck.gl/core";
import { TileLayer, TripsLayer } from "@deck.gl/geo-layers";
import { ArcLayer, BitmapLayer, ColumnLayer, PathLayer, ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import type { PickingInfo } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { HANOI_CENTER, MODEL_URLS } from "@/features/digitalTwin/config/constants";
import type {
  BuildingThing,
  ChargingStationThing,
  ControlCenterThing,
  EVThing,
  GridLineStatus,
  LngLatAlt,
  PowerSubstationThing,
  RoutePoint,
  TwinSceneState,
  TwinThing
} from "@/features/digitalTwin/types/twin";

type GridArcDatum = {
  id: string;
  source: LngLatAlt;
  target: LngLatAlt;
  status: GridLineStatus;
  loadLevel: number;
};

type ParkedEVDatum = {
  id: string;
  position: LngLatAlt;
  batteryLevel: number;
  stationName: string;
};

type DigitalTwinDeckMapProps = {
  scene: TwinSceneState;
  onCreateAtCoordinate: (position: LngLatAlt) => void;
  onSelectThing: (thing: TwinThing | null) => void;
};

function batteryColor(level: number): [number, number, number, number] {
  if (level > 65) {
    return [53, 217, 125, 235];
  }
  if (level > 30) {
    return [255, 196, 84, 235];
  }
  return [255, 86, 92, 235];
}

function gridColor(status: GridLineStatus): [number, number, number, number] {
  if (status === "overload") {
    return [255, 86, 88, 225];
  }
  if (status === "high") {
    return [255, 174, 63, 225];
  }
  return [79, 233, 144, 205];
}

function toGridStatus(loadLevel: number): GridLineStatus {
  if (loadLevel >= 0.85) {
    return "overload";
  }
  if (loadLevel >= 0.6) {
    return "high";
  }
  return "normal";
}

function makeGridArcs(scene: TwinSceneState): GridArcDatum[] {
  const arcs: GridArcDatum[] = [];

  for (const station of scene.chargingStations) {
    const status = toGridStatus(station.loadLevel);
    arcs.push({
      id: `grid-arc-station-${station.id}`,
      source: scene.controlCenter.position,
      target: station.position,
      status,
      loadLevel: station.loadLevel
    });
  }

  for (const substation of scene.substations) {
    const status = toGridStatus(substation.loadLevel);
    arcs.push({
      id: `grid-arc-substation-${substation.id}`,
      source: scene.controlCenter.position,
      target: substation.position,
      status,
      loadLevel: substation.loadLevel
    });
  }

  return arcs;
}

function makeParkedEVs(stations: ChargingStationThing[]): ParkedEVDatum[] {
  const parked: ParkedEVDatum[] = [];

  stations.forEach((station) => {
    const count = Math.max(0, Math.min(4, station.parkedEVs));
    for (let i = 0; i < count; i += 1) {
      const offset = -0.00011 + i * 0.00007;
      parked.push({
        id: `parked-${station.id}-${i}`,
        position: [station.position[0] + offset, station.position[1] - 0.00008, 0.8],
        batteryLevel: 35 + ((i + 1) * 14) % 60,
        stationName: station.name
      });
    }
  });

  return parked;
}

const INITIAL_VIEW_STATE: DeckProps["initialViewState"] = {
  longitude: HANOI_CENTER[0],
  latitude: HANOI_CENTER[1],
  zoom: 14.9,
  pitch: 58,
  bearing: -17,
  minZoom: 12,
  maxZoom: 18
};

export function DigitalTwinDeckMap({ scene, onCreateAtCoordinate, onSelectThing }: DigitalTwinDeckMapProps) {
  const parkedEvs = useMemo(() => makeParkedEVs(scene.chargingStations), [scene.chargingStations]);
  const gridArcs = useMemo(() => makeGridArcs(scene), [scene]);

  const lightingEffect = useMemo(() => {
    const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.05 });
    const sunLight = new SunLight({
      timestamp: Date.UTC(2026, 3, 13, 4),
      color: [255, 244, 230],
      intensity: 1.35
    });

    return new LightingEffect({
      ambientLight,
      sunLight
    });
  }, []);

  const layers = useMemo(() => {
    const osmBasemapLayer = new TileLayer({
      id: "osm-basemap-layer",
      data: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      renderSubLayers: (props: any) => {
        const {
          tile: { bbox },
          data
        } = props;
        const { west, south, east, north } = bbox;

        return new BitmapLayer(props, {
          image: data,
          bounds: [west, south, east, north]
        });
      }
    });

    const buildingLayer = new PathLayer<BuildingThing>({
      id: "local-building-footprints",
      data: scene.buildings,
      getPath: (building: BuildingThing) => [...building.footprint, building.footprint[0]],
      getWidth: 4,
      widthUnits: "meters",
      getColor: [79, 160, 255, 180],
      pickable: true,
      autoHighlight: true
    });

    const evTripsLayer = new TripsLayer<EVThing>({
      id: "ev-trips-layer",
      data: scene.evs,
      getPath: (ev: EVThing) => ev.route.map((point: RoutePoint) => point.position),
      getTimestamps: (ev: EVThing) => ev.route.map((point: RoutePoint) => point.timestamp),
      getColor: (ev: EVThing) => batteryColor(ev.batteryLevel),
      opacity: 0.7,
      widthMinPixels: 2,
      rounded: true,
      trailLength: 18,
      currentTime: scene.simulationTime
    });

    const evModelLayer = new ScenegraphLayer<EVThing>({
      id: "ev-model-layer",
      data: scene.evs,
      scenegraph: MODEL_URLS.electricCar,
      getPosition: (ev: EVThing) => ev.position,
      getOrientation: (ev: EVThing) => [0, ev.heading, 90],
      getColor: (ev: EVThing) => batteryColor(ev.batteryLevel),
      sizeScale: 13,
      _lighting: "pbr",
      pickable: true,
      autoHighlight: true
    });

    const stationLayer = new ScenegraphLayer<ChargingStationThing>({
      id: "charging-station-layer",
      data: scene.chargingStations,
      scenegraph: MODEL_URLS.chargingStation,
      getPosition: (station: ChargingStationThing) => [station.position[0], station.position[1], 0],
      getOrientation: (station: ChargingStationThing) => [0, station.heading || 0, 0],
      getColor: (station: ChargingStationThing) =>
        station.status === "occupied"
          ? [255, 108, 108, 230]
          : station.status === "charging"
            ? [255, 188, 92, 230]
            : [70, 223, 150, 230],
      sizeScale: 16,
      _lighting: "pbr",
      pickable: true,
      autoHighlight: true
    });

    const parkedEVLayer = new ScenegraphLayer<ParkedEVDatum>({
      id: "parked-ev-layer",
      data: parkedEvs,
      scenegraph: MODEL_URLS.electricCar,
      getPosition: (ev: ParkedEVDatum) => ev.position,
      getOrientation: [0, 35, 90],
      getColor: (ev: ParkedEVDatum) => batteryColor(ev.batteryLevel),
      sizeScale: 7,
      _lighting: "pbr",
      pickable: false
    });

    const substationLayer = new ScenegraphLayer<PowerSubstationThing>({
      id: "substation-layer",
      data: scene.substations,
      scenegraph: MODEL_URLS.substation,
      getPosition: (substation: PowerSubstationThing) => substation.position,
      getOrientation: [0, 0, 0],
      getColor: (substation: PowerSubstationThing) =>
        substation.status === "overload"
          ? [255, 92, 92, 235]
          : substation.status === "warning"
            ? [255, 180, 73, 230]
            : [93, 231, 162, 220],
      sizeScale: 15,
      _lighting: "pbr",
      pickable: true,
      autoHighlight: true
    });

    const gridArcLayer = new ArcLayer<GridArcDatum>({
      id: "grid-arc-layer",
      data: gridArcs,
      getSourcePosition: (arc: GridArcDatum) => arc.source,
      getTargetPosition: (arc: GridArcDatum) => arc.target,
      getSourceColor: (arc: GridArcDatum) => gridColor(arc.status),
      getTargetColor: (arc: GridArcDatum) => gridColor(arc.status),
      getWidth: (arc: GridArcDatum) => 2 + arc.loadLevel * 4,
      widthUnits: "meters",
      pickable: true
    });

    const controlCenterLayer = new ColumnLayer<ControlCenterThing>({
      id: "control-center-layer",
      data: [scene.controlCenter],
      radius: 38,
      diskResolution: 24,
      extruded: true,
      getPosition: (center: ControlCenterThing) => center.position,
      getElevation: 120,
      getFillColor: [90, 188, 255, 245],
      getLineColor: [255, 255, 255, 220],
      lineWidthMinPixels: 1,
      material: {
        ambient: 0.35,
        diffuse: 0.64,
        shininess: 78,
        specularColor: [255, 255, 240]
      },
      pickable: true
    });

    const pulseRadius = 70 + Math.sin(scene.simulationTime * 0.42) * 22;

    const controlPulseLayer = new ScatterplotLayer<ControlCenterThing>({
      id: "control-center-pulse",
      data: [scene.controlCenter],
      getPosition: (center: ControlCenterThing) => center.position,
      getRadius: pulseRadius,
      radiusUnits: "meters",
      stroked: true,
      filled: false,
      getLineColor: [83, 205, 255, 220],
      lineWidthUnits: "meters",
      getLineWidth: 2,
      pickable: false
    });

    const controlCenterLabelLayer = new TextLayer<ControlCenterThing>({
      id: "control-center-label",
      data: [scene.controlCenter],
      getPosition: (center: ControlCenterThing) => [center.position[0], center.position[1], 130],
      getText: (center: ControlCenterThing) => `${center.name} | Grid ${(center.gridLoad * 100).toFixed(0)}%`,
      getColor: [248, 250, 255, 255],
      getSize: 16,
      sizeUnits: "pixels",
      getPixelOffset: [0, -16],
      getTextAnchor: "middle",
      getAlignmentBaseline: "bottom",
      billboard: true,
      pickable: false
    });

    return [
      osmBasemapLayer,
      buildingLayer,
      evTripsLayer,
      evModelLayer,
      stationLayer,
      parkedEVLayer,
      substationLayer,
      gridArcLayer,
      controlCenterLayer,
      controlPulseLayer,
      controlCenterLabelLayer
    ];
  }, [gridArcs, parkedEvs, scene]);

  return (
    <DeckGL
      layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      effects={[lightingEffect]}
      controller={{
        dragRotate: true,
        touchRotate: true,
        keyboard: true,
        inertia: true,
        doubleClickZoom: true
      }}
      getTooltip={({ object }) => {
        if (!object) {
          return null;
        }
        const candidate = object as Partial<TwinThing>;
        if (candidate.type && candidate.name) {
          return {
            text: `${candidate.name} (${candidate.type})`
          };
        }

        const arc = object as Partial<GridArcDatum>;
        if (typeof arc.loadLevel === "number") {
          return {
            text: `Grid load ${(arc.loadLevel * 100).toFixed(0)}%`
          };
        }

        return null;
      }}
      onClick={(info: PickingInfo) => {
        const coordinate = info.coordinate;

        if (info.object) {
          const candidate = info.object as Partial<TwinThing>;
          if (candidate.type && candidate.thingId) {
            onSelectThing(candidate as TwinThing);
            return;
          }
        }

        onSelectThing(null);

        if (coordinate && coordinate.length >= 2) {
          onCreateAtCoordinate([coordinate[0], coordinate[1], 0]);
        }
      }}
    />
  );
}
