"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AmbientLight,
  type DeckProps,
  FlyToInterpolator,
  type MapViewState,
  LightingEffect,
  TRANSITION_EVENTS,
  type ViewStateChangeParameters,
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

type CinematicTourStatus = "idle" | "running" | "paused";

type CinematicTourStop = {
  id: string;
  name: string;
  position: LngLatAlt;
  zoom?: number;
  pitch?: number;
  bearing?: number;
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

const TOUR_FLY_DURATION_MS = 5200;
const TOUR_DWELL_DURATION_MS = 2600;

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: HANOI_CENTER[0],
  latitude: HANOI_CENTER[1],
  zoom: 14.9,
  pitch: 58,
  bearing: -17,
  minZoom: 12,
  maxZoom: 18,
  maxPitch: 60
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function stripTransition(viewState: MapViewState): MapViewState {
  return {
    ...INITIAL_VIEW_STATE,
    longitude: viewState.longitude,
    latitude: viewState.latitude,
    zoom: viewState.zoom,
    pitch: viewState.pitch,
    bearing: viewState.bearing
  };
}

function hasUserCameraInput(params: ViewStateChangeParameters<MapViewState>): boolean {
  const { interactionState } = params;
  return Boolean(
    interactionState.isDragging ||
      interactionState.isPanning ||
      interactionState.isRotating ||
      interactionState.isZooming
  );
}

function buildCinematicTourStops(scene: TwinSceneState): CinematicTourStop[] {
  // Plug in your own hand-authored city landmarks here if you want total art direction.
  // Example:
  // return [
  //   { id: "lake", name: "Hoan Kiem Lake", position: [105.852, 21.028, 0], zoom: 16.2, pitch: 58, bearing: -35 },
  //   { id: "tower", name: "Signature Tower", position: [105.849, 21.029, 0], zoom: 16.6, pitch: 54, bearing: 42 }
  // ];
  const tallestBuildings = [...scene.buildings]
    .sort((a, b) => b.height - a.height)
    .slice(0, 3)
    .map((building, index) => ({
      id: building.id,
      name: building.name,
      position: building.position,
      zoom: 16.15 + index * 0.08
    }));

  const utilityStops = [
    {
      id: scene.controlCenter.id,
      name: scene.controlCenter.name,
      position: scene.controlCenter.position,
      zoom: 16.2,
      pitch: 58,
      bearing: -25
    },
    ...scene.chargingStations.slice(0, 3).map((station, index) => ({
      id: station.id,
      name: station.name,
      position: station.position,
      zoom: 16.35,
      pitch: 52 + (index % 2) * 4
    })),
    ...scene.substations.slice(0, 2).map((substation) => ({
      id: substation.id,
      name: substation.name,
      position: substation.position,
      zoom: 16.05,
      pitch: 56
    }))
  ];

  return [...utilityStops, ...tallestBuildings];
}

function toCinematicViewState(stop: CinematicTourStop, index: number): MapViewState {
  return {
    ...INITIAL_VIEW_STATE,
    longitude: stop.position[0],
    latitude: stop.position[1],
    zoom: stop.zoom ?? 16.1,
    pitch: stop.pitch ?? 48 + (index % 3) * 5,
    bearing: stop.bearing ?? -45 + ((index * 67) % 180)
  };
}

export function DigitalTwinDeckMap({ scene, onCreateAtCoordinate, onSelectThing }: DigitalTwinDeckMapProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [tourStatus, setTourStatus] = useState<CinematicTourStatus>("idle");
  const [activeTourStopName, setActiveTourStopName] = useState<string>("");

  const tourStops = useMemo(() => buildCinematicTourStops(scene), [scene]);
  const tourStopsRef = useRef<CinematicTourStop[]>(tourStops);
  const tourTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tourRunIdRef = useRef(0);
  const tourActiveRef = useRef(false);
  const tourAutostartedRef = useRef(false);

  const parkedEvs = useMemo(() => makeParkedEVs(scene.chargingStations), [scene.chargingStations]);
  const gridArcs = useMemo(() => makeGridArcs(scene), [scene]);

  useEffect(() => {
    tourStopsRef.current = tourStops;
  }, [tourStops]);

  const clearTourTimeout = useCallback(() => {
    if (tourTimeoutRef.current) {
      clearTimeout(tourTimeoutRef.current);
      tourTimeoutRef.current = null;
    }
  }, []);

  const stopTour = useCallback(
    (status: Exclude<CinematicTourStatus, "running"> = "idle", finalViewState?: MapViewState) => {
      tourRunIdRef.current += 1;
      tourActiveRef.current = false;
      clearTourTimeout();
      setTourStatus(status);
      setViewState((current) => stripTransition(finalViewState ?? current));
    },
    [clearTourTimeout]
  );

  const flyToTourStop = useCallback(
    function flyToTourStop(index: number, runId: number) {
      const stops = tourStopsRef.current;
      if (!tourActiveRef.current || tourRunIdRef.current !== runId || stops.length === 0) {
        return;
      }

      const safeIndex = index % stops.length;
      const stop = stops[safeIndex];
      const nextViewState = toCinematicViewState(stop, safeIndex);

      setActiveTourStopName(stop.name);
      setTourStatus("running");
      setViewState({
        ...nextViewState,
        transitionDuration: TOUR_FLY_DURATION_MS,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.05, curve: 1.5, maxDuration: 7000 }),
        transitionEasing: easeInOutCubic,
        transitionInterruption: TRANSITION_EVENTS.BREAK,
        onTransitionEnd: () => {
          if (!tourActiveRef.current || tourRunIdRef.current !== runId) {
            return;
          }

          tourTimeoutRef.current = setTimeout(() => {
            flyToTourStop(safeIndex + 1, runId);
          }, TOUR_DWELL_DURATION_MS);
        },
        onTransitionInterrupt: () => {
          if (tourRunIdRef.current === runId) {
            stopTour("paused");
          }
        }
      });
    },
    [stopTour]
  );

  const startTour = useCallback(() => {
    if (tourStopsRef.current.length === 0) {
      return;
    }

    clearTourTimeout();
    const runId = tourRunIdRef.current + 1;
    tourRunIdRef.current = runId;
    tourActiveRef.current = true;
    flyToTourStop(0, runId);
  }, [clearTourTimeout, flyToTourStop]);

  useEffect(() => {
    if (tourAutostartedRef.current || tourStops.length === 0) {
      return;
    }

    tourAutostartedRef.current = true;
    const timer = setTimeout(startTour, 900);

    return () => clearTimeout(timer);
  }, [startTour, tourStops.length]);

  useEffect(
    () => () => {
      tourRunIdRef.current += 1;
      tourActiveRef.current = false;
      clearTourTimeout();
    },
    [clearTourTimeout]
  );

  const handleViewStateChange = useCallback(
    (params: ViewStateChangeParameters<MapViewState>) => {
      if (tourActiveRef.current && hasUserCameraInput(params)) {
        stopTour("paused", params.viewState);
        return params.viewState;
      }

      setViewState(params.viewState);
      return params.viewState;
    },
    [stopTour]
  );

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
    <div className="relative h-full w-full">
      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={handleViewStateChange as DeckProps["onViewStateChange"]}
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
          if (tourActiveRef.current) {
            stopTour("paused");
          }

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

      {tourStops.length > 0 && (
        <aside
          className="absolute right-3 top-3 max-w-[18rem] rounded-md border border-[color:var(--app-border-strong)] bg-[var(--panel-background)] px-3 py-2 text-xs text-[var(--text-primary)] shadow-panel backdrop-blur-sm"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <p className="font-[var(--font-display)] text-[11px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">
            Cinematic tour
          </p>
          <p className="mt-1 text-[var(--text-muted)]">
            {tourStatus === "running" ? `Flying to ${activeTourStopName}` : tourStatus === "paused" ? "Paused" : "Ready"}
          </p>
          <button
            type="button"
            className="mt-2 rounded border border-[color:var(--app-border-strong)] px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-primary)] transition hover:border-[color:var(--accent-primary)] hover:text-[var(--accent-primary)]"
            onClick={() => {
              if (tourStatus === "running") {
                stopTour("idle");
                return;
              }

              startTour();
            }}
          >
            {tourStatus === "running" ? "Stop tour" : "Start tour"}
          </button>
        </aside>
      )}
    </div>
  );
}
