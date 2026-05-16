"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map as MapView, useControl, type MapRef, type ViewStateChangeEvent } from "react-map-gl/maplibre";
import { MapboxOverlay, type MapboxOverlayProps } from "@deck.gl/mapbox";
import {
  AmbientLight,
  LightingEffect,
  PointLight,
  type MapViewState,
  type PickingInfo,
  type Position
} from "@deck.gl/core";
import { TripsLayer } from "@deck.gl/geo-layers";
import { ArcLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import type { ChargingStation, ActiveEV, TransformerEntity } from "@/types/cpo";
import { CHARGING_STATIONS, MOCK_EVS, TRANSFORMERS } from "@/store/cpo-data";

export type MapClickInfo = {
  coordinate: [number, number];
  isValidPosition: boolean;
};

// ---------------------------------------------------------------------------
// Static assets
// ---------------------------------------------------------------------------
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const MANHATTAN_BOUNDS: [[number, number], [number, number]] = [
  [-74.03, 40.7],
  [-73.93, 40.88]
];

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

const AUTO_VIEW_FIT_DURATION_MS = 2600;
const AUTO_VIEW_ORBIT_PITCH = 52;
const AUTO_VIEW_ORBIT_MAX_ZOOM = 14.35;
const AUTO_VIEW_ORBIT_PADDING = 120;
const AUTO_VIEW_ORBIT_DEGREES_PER_SECOND = 15;

type AutoViewBounds = {
  center: [number, number];
  bounds: [[number, number], [number, number]];
};

const DATA_URLS = {
  buildings:
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json"
};

// ---------------------------------------------------------------------------
// Lighting
// ---------------------------------------------------------------------------
const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.0 });
const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});
const lightingEffect = new LightingEffect({ ambientLight, pointLight });

// ---------------------------------------------------------------------------
// Ground cover (keeps deck.gl / MapLibre in sync)
// ---------------------------------------------------------------------------
const LAND_COVER: Position[][] = [
  [
    [-74.0, 40.7],
    [-74.02, 40.7],
    [-74.02, 40.72],
    [-74.0, 40.72]
  ]
];

type Building = { polygon: Position[]; height: number };

// ---------------------------------------------------------------------------
// Point-in-polygon collision check (raycasting)
// ---------------------------------------------------------------------------
function isPositionValid(coord: [number, number], buildings: Building[]): boolean {
  const x = coord[0], y = coord[1];
  for (const b of buildings) {
    let inside = false;
    const poly = b.polygon;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    if (inside) return false;
  }
  return true;
}

// Mock data is now imported from @/store/cpo-data

// ---------------------------------------------------------------------------
// Station color helper
// ---------------------------------------------------------------------------
function mixChannel(start: number, end: number, t: number) {
  return Math.round(start + (end - start) * t);
}
function getStationColor(station: ChargingStation): [number, number, number, number] {
  const ratio = station.inUseStalls / Math.max(1, station.activeStalls);
  const low: [number, number, number] = [78, 222, 163];
  const high: [number, number, number] = [255, 178, 102];
  return [mixChannel(low[0], high[0], ratio), mixChannel(low[1], high[1], ratio), mixChannel(low[2], high[2], ratio), 230];
}

function getTransformerColor(transformer: TransformerEntity): [number, number, number, number] {
  if (transformer.status === "critical") return [255, 96, 96, 235];
  if (transformer.status === "warning") return [255, 186, 82, 235];
  if (transformer.status === "dr_active") return [255, 126, 207, 235];
  return [96, 232, 255, 230];
}

const FLOW_BASE_DURATION = 1000;
const FLOW_OFFSETS = [0, 0.33, 0.66];

type SpeedGroup = "slow" | "normal" | "fast";

const SPEED_GROUP_FACTOR: Record<SpeedGroup, number> = {
  slow: 0.75,
  normal: 1,
  fast: 1.35
};

type StationFlowLink = {
  id: string;
  transformerId: string;
  stationId: string;
  sourcePosition: [number, number];
  targetPosition: [number, number];
  powerFlow: number;
  capacityRatio: number;
};

type FlowTrip = {
  id: string;
  path: [number, number, number][];
  timestamps: number[];
  isV2G: boolean;
  ratio: number;
  speedGroup: SpeedGroup;
};

function stationNetPower(station: ChargingStation): number {
  const stallPower = station.stalls.reduce((sum, stall) => sum + (stall.powerKw ?? 0), 0);
  if (stallPower !== 0) return stallPower;
  if (station.inUseStalls > 0) return station.inUseStalls * 11;
  return 0;
}

function pickSpeedGroup(powerFlow: number): SpeedGroup {
  const magnitude = Math.abs(powerFlow);
  if (magnitude < 8) return "slow";
  if (magnitude < 22) return "normal";
  return "fast";
}

function buildTransformerLinks(
  transformers: TransformerEntity[],
  stations: ChargingStation[]
): StationFlowLink[] {
  const stationMap = new Map(stations.map((station) => [station.id, station]));
  const links: StationFlowLink[] = [];

  for (const transformer of transformers) {
    for (const stationId of transformer.stationIds) {
      const station = stationMap.get(stationId);
      if (!station) continue;
      const powerFlow = stationNetPower(station);
      const ratioBase = Math.max(1, station.totalStalls * 12);
      links.push({
        id: `link-${transformer.id}-${station.id}`,
        transformerId: transformer.id,
        stationId: station.id,
        sourcePosition: transformer.position,
        targetPosition: station.position,
        powerFlow,
        capacityRatio: Math.min(1, Math.abs(powerFlow) / ratioBase)
      });
    }
  }

  return links;
}

function generateArcTrip(
  source: [number, number],
  target: [number, number],
  powerFlow: number,
  numPoints = 20,
  maxAltitude = 80
): { path: [number, number, number][]; timestamps: number[] } {
  const path: [number, number, number][] = [];
  const timestamps: number[] = [];
  const isV2G = powerFlow < 0;
  const pStart = isV2G ? target : source;
  const pEnd = isV2G ? source : target;

  for (let i = 0; i <= numPoints; i += 1) {
    const t = i / numPoints;
    const lng = pStart[0] + (pEnd[0] - pStart[0]) * t;
    const lat = pStart[1] + (pEnd[1] - pStart[1]) * t;
    const alt = 4 * maxAltitude * t * (1 - t);
    path.push([lng, lat, alt]);
    timestamps.push(t * FLOW_BASE_DURATION);
  }

  return { path, timestamps };
}

function buildFlowTrips(links: StationFlowLink[]): Record<SpeedGroup, FlowTrip[]> {
  const grouped: Record<SpeedGroup, FlowTrip[]> = { slow: [], normal: [], fast: [] };

  for (const link of links) {
    if (Math.abs(link.powerFlow) < 0.1) continue;
    const speedGroup = pickSpeedGroup(link.powerFlow);
    const altitude = 70 + link.capacityRatio * 90;
    const { path, timestamps } = generateArcTrip(
      link.sourcePosition,
      link.targetPosition,
      link.powerFlow,
      20,
      altitude
    );

    grouped[speedGroup].push({
      id: `trip-${link.id}`,
      path,
      timestamps,
      isV2G: link.powerFlow < 0,
      ratio: link.capacityRatio,
      speedGroup
    });
  }

  return grouped;
}

function buildAutoViewBounds(
  stations: ChargingStation[],
  transformers: TransformerEntity[]
): AutoViewBounds {
  // To hardcode an art-directed overview instead, return your preferred center and bounds here:
  // return { center: [-74.0, 40.75], bounds: [[-74.03, 40.70], [-73.93, 40.88]] };
  const positions = [
    ...stations.map((station) => station.position),
    ...transformers.map((transformer) => transformer.position),
    ...MOCK_EVS.map((ev) => ev.position)
  ];

  if (positions.length === 0) {
    return {
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      bounds: MANHATTAN_BOUNDS
    };
  }

  let minLng = positions[0][0];
  let maxLng = positions[0][0];
  let minLat = positions[0][1];
  let maxLat = positions[0][1];

  for (const [lng, lat] of positions) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  const lngSpan = Math.max(maxLng - minLng, 0.006);
  const latSpan = Math.max(maxLat - minLat, 0.006);
  const lngPadding = lngSpan * 0.22;
  const latPadding = latSpan * 0.22;

  return {
    center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
    bounds: [
      [minLng - lngPadding, minLat - latPadding],
      [maxLng + lngPadding, maxLat + latPadding]
    ]
  };
}

function useParticleAnimation(speed = 6) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setCurrentTime((prev) => (prev + speed) % FLOW_BASE_DURATION);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  return currentTime;
}

// ---------------------------------------------------------------------------
// DeckGL overlay (shares WebGL context with MapLibre)
// ---------------------------------------------------------------------------
function DeckGLOverlay(props: MapboxOverlayProps & { interleaved?: boolean }) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
type TripsLiveMapProps = {
  onSelectEntity?: (entity: any) => void;
  onMapClick?: (info: MapClickInfo) => void;
  onMapHover?: (info: MapClickInfo | null) => void;
  autoViewEnabled?: boolean;
  onAutoViewInterrupted?: () => void;
  stations?: ChargingStation[];
  transformers?: TransformerEntity[];
  snapToGrid?: boolean;
  gridStep?: number;
};

export function TripsLiveMap({
  onSelectEntity,
  onMapClick,
  onMapHover,
  autoViewEnabled = true,
  onAutoViewInterrupted,
  stations,
  transformers,
  snapToGrid = false,
  gridStep = 0.00005
}: TripsLiveMapProps) {
  const resolvedStations = stations ?? CHARGING_STATIONS;
  const resolvedTransformers = transformers ?? TRANSFORMERS;
  const mapRef = useRef<MapRef | null>(null);
  const autoViewFitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoViewFrameRef = useRef<number | null>(null);
  const autoViewRunIdRef = useRef(0);
  const [mapReady, setMapReady] = useState(false);
  const STATION_MODEL_URL = "/models/charge_point.glb";
  const TRANSFORMER_MODEL_URL = "/models/transformer.glb";
  // Tạm thời trỏ ev-model sang charge_point để chứng minh layer code đã hoạt động chuẩn
  const EV_MODEL_URL = "/models/ev-model.glb"; // TODO: Đổi lại "/models/ev-model.glb" sau khi bạn fix file model

  const [stationModelAvailable, setStationModelAvailable] = useState(false);
  const [transformerModelAvailable, setTransformerModelAvailable] = useState(false);
  const [evModelAvailable, setEvModelAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch(STATION_MODEL_URL, { method: "HEAD" }),
      fetch(TRANSFORMER_MODEL_URL, { method: "HEAD" }),
      fetch(EV_MODEL_URL, { method: "HEAD" })
    ]).then(([sr, tr, er]) => {
      if (mounted) {
        setStationModelAvailable(sr.ok);
        setTransformerModelAvailable(tr.ok);
        // Temporarily disable the EV model because parse-gltf crashes on the current ev-model.glb
        setEvModelAvailable(er.ok);
      }
    }).catch(() => { });
    return () => { mounted = false; };
  }, []);

  const currentTime = useParticleAnimation(8);

  const [buildingData, setBuildingData] = useState<Building[]>([]);
  const autoViewBounds = useMemo(
    () => buildAutoViewBounds(resolvedStations, resolvedTransformers),
    [resolvedStations, resolvedTransformers]
  );

  const clearAutoViewTimers = useCallback(() => {
    if (autoViewFitTimeoutRef.current) {
      clearTimeout(autoViewFitTimeoutRef.current);
      autoViewFitTimeoutRef.current = null;
    }

    if (autoViewFrameRef.current) {
      cancelAnimationFrame(autoViewFrameRef.current);
      autoViewFrameRef.current = null;
    }
  }, []);

  const stopAutoView = useCallback(() => {
    autoViewRunIdRef.current += 1;
    clearAutoViewTimers();
    mapRef.current?.stop();
  }, [clearAutoViewTimers]);

  const startPanoramicOrbit = useCallback(
    (runId: number) => {
      const map = mapRef.current;
      if (!map || autoViewRunIdRef.current !== runId) {
        return;
      }

      const startedAt = performance.now();
      const startBearing = map.getBearing();

      const animate = (now: number) => {
        if (autoViewRunIdRef.current !== runId) {
          return;
        }

        const elapsedSeconds = (now - startedAt) / 1000;
        map.jumpTo({
          center: autoViewBounds.center,
          pitch: AUTO_VIEW_ORBIT_PITCH,
          bearing: startBearing + elapsedSeconds * AUTO_VIEW_ORBIT_DEGREES_PER_SECOND
        });

        autoViewFrameRef.current = requestAnimationFrame(animate);
      };

      autoViewFrameRef.current = requestAnimationFrame(animate);
    },
    [autoViewBounds.center]
  );

  useEffect(() => {
    if (!autoViewEnabled) {
      stopAutoView();
      return;
    }

    const map = mapRef.current;
    if (!mapReady || !map) {
      return;
    }

    const runId = autoViewRunIdRef.current + 1;
    autoViewRunIdRef.current = runId;
    clearAutoViewTimers();

    map.fitBounds(autoViewBounds.bounds, {
      padding: AUTO_VIEW_ORBIT_PADDING,
      duration: AUTO_VIEW_FIT_DURATION_MS,
      pitch: AUTO_VIEW_ORBIT_PITCH,
      bearing: map.getBearing(),
      maxZoom: AUTO_VIEW_ORBIT_MAX_ZOOM,
      essential: true
    });

    autoViewFitTimeoutRef.current = setTimeout(() => {
      startPanoramicOrbit(runId);
    }, AUTO_VIEW_FIT_DURATION_MS);

    return clearAutoViewTimers;
  }, [
    autoViewBounds,
    autoViewEnabled,
    clearAutoViewTimers,
    mapReady,
    startPanoramicOrbit,
    stopAutoView
  ]);

  useEffect(
    () => () => {
      stopAutoView();
    },
    [stopAutoView]
  );

  const handleAutoViewUserInterruption = useCallback(
    (event?: ViewStateChangeEvent) => {
      if (!autoViewEnabled) {
        return;
      }

      if (event && !event.originalEvent) {
        return;
      }

      stopAutoView();
      onAutoViewInterrupted?.();
    },
    [autoViewEnabled, onAutoViewInterrupted, stopAutoView]
  );

  useEffect(() => {
    let mounted = true;
    fetch(DATA_URLS.buildings)
      .then((r) => r.json())
      .then((data: Building[]) => { if (mounted) setBuildingData(data); })
      .catch(() => { });
    return () => { mounted = false; };
  }, []);

  const layers = useMemo(() => {
    const flowLinks = buildTransformerLinks(resolvedTransformers, resolvedStations);
    const flowTripsBySpeed = buildFlowTrips(flowLinks);

    const transformerLayer = transformerModelAvailable
      ? new ScenegraphLayer<TransformerEntity>({
        id: "transformer-models",
        data: resolvedTransformers,
        scenegraph: TRANSFORMER_MODEL_URL,
        getPosition: (d) => [...d.position, -50] as [number, number, number],
        getScale: () => [2.6, 2.6, 2.6],
        getOrientation: (d) => [0, d.heading ?? 0, 0] as [number, number, number],
        getColor: (d) => getTransformerColor(d),
        sizeScale: 20,
        sizeMinPixels: 5,
        sizeMaxPixels: 50,
        _lighting: "pbr",
        pickable: true,
        autoHighlight: true
      })
      : new ScenegraphLayer<TransformerEntity>({
        id: "transformer-fallback",
        data: resolvedTransformers,
        scenegraph: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
        getPosition: (d) => [...d.position, 0] as [number, number, number],
        getColor: (d) => getTransformerColor(d),
        getScale: () => [8, 8, 8],
        sizeScale: 6,
        _lighting: "pbr",
        pickable: true,
        autoHighlight: true
      });

    const connectionLayer = new ArcLayer<StationFlowLink>({
      id: "transformer-links",
      data: flowLinks,
      getSourcePosition: (link) => link.sourcePosition,
      getTargetPosition: (link) => link.targetPosition,
      getSourceColor: (link) =>
        link.powerFlow < 0 ? [16, 185, 129, 190] : [255, 184, 92, 190],
      getTargetColor: (link) =>
        link.powerFlow < 0 ? [16, 185, 129, 230] : [255, 184, 92, 230],
      getWidth: (link) => 1.5 + link.capacityRatio * 3.2,
      widthUnits: "meters",
      pickable: false
    });

    const flowLayers: TripsLayer<FlowTrip>[] = [];
    (Object.keys(flowTripsBySpeed) as SpeedGroup[]).forEach((group) => {
      const trips = flowTripsBySpeed[group];
      if (trips.length === 0) return;
      const speedFactor = SPEED_GROUP_FACTOR[group];
      FLOW_OFFSETS.forEach((offset, index) => {
        flowLayers.push(
          new TripsLayer<FlowTrip>({
            id: `transformer-flow-${group}-${index}`,
            data: trips,
            getPath: (d) => d.path,
            getTimestamps: (d) => d.timestamps,
            getColor: (d) => (d.isV2G ? [16, 185, 129, 255] : [255, 184, 92, 255]),
            getWidth: (d) => 2 + d.ratio * 6,
            widthUnits: "meters",
            widthMinPixels: 1,
            opacity: 0.85,
            trailLength: 170,
            currentTime: (currentTime * speedFactor + offset * FLOW_BASE_DURATION) % FLOW_BASE_DURATION,
            jointRounded: true,
            capRounded: true,
            pickable: false
          })
        );
      });
    });

    return [
      // 1. Ground anchor
      new PolygonLayer<Position[]>({
        id: "ground",
        data: LAND_COVER,
        getPolygon: (p) => p,
        stroked: false,
        getFillColor: [0, 0, 0, 0]
      }),

      // 2. 3D Buildings
      new PolygonLayer<Building>({
        id: "buildings",
        data: DATA_URLS.buildings,
        extruded: true,
        wireframe: false,
        opacity: 0.5,
        getPolygon: (d) => d.polygon,
        getElevation: (d) => d.height,
        getFillColor: [74, 80, 87],
        material: { ambient: 0.1, diffuse: 0.6, shininess: 32, specularColor: [60, 64, 70] }
      }),

      // 3. Charging Stations — 3D model or column fallback
      stationModelAvailable
        ? new ScenegraphLayer<ChargingStation>({
          id: "charging-stations-model",
          data: resolvedStations,
          scenegraph: STATION_MODEL_URL,
          getPosition: (d) => [...d.position, 0] as [number, number, number],
          getScale: () => [3, 3, 3],
          getOrientation: (d) => [0, d.heading || 0, 90] as [number, number, number],
          sizeScale: 20,
          sizeMinPixels: 5,
          sizeMaxPixels: 200,
          _lighting: "pbr",
          pickable: true,
          autoHighlight: true
        })
        : new ScenegraphLayer<ChargingStation>({
          id: "charging-stations",
          data: resolvedStations,
          // Minimal fallback sphere — no GLB needed
          scenegraph: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Box/glTF-Binary/Box.glb",
          getPosition: (d) => [...d.position, 0] as [number, number, number],
          getColor: (d) => getStationColor(d),
          getScale: () => [10, 10, 10],
          sizeScale: 5,
          _lighting: "pbr",
          pickable: true,
          autoHighlight: true
        }),

      // 4. Transformers — aggregation points
      transformerLayer,
      connectionLayer,
      ...flowLayers,

      // 5. Active EVs — 3D model or ScatterplotLayer fallback
      evModelAvailable
        ? new ScenegraphLayer<ActiveEV>({
          id: "active-evs-model",
          data: MOCK_EVS,
          scenegraph: EV_MODEL_URL,
          getPosition: (d) => [...d.position, 0] as [number, number, number],
          getScale: () => [0.7, 0.7, 0.7],
          getOrientation: () => [0, 0, 90] as [number, number, number],
          getColor: (d) => (d.isDischarging ? [78, 222, 163, 255] : [34, 211, 238, 255]),
          sizeScale: 10,
          sizeMinPixels: 10,
          sizeMaxPixels: 300,
          _lighting: "pbr",
          pickable: true,
          autoHighlight: true
        })
        : new ScatterplotLayer<ActiveEV>({
          id: "active-evs",
          data: MOCK_EVS,
          getPosition: (d) => d.position,
          getFillColor: (d) => (d.isDischarging ? [78, 222, 163, 255] : [34, 211, 238, 255]),
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 2,
          getRadius: 15,
          radiusUnits: "meters",
          stroked: true,
          pickable: true,
          autoHighlight: true,
          lineWidthMinPixels: 2,
        })
    ];
  }, [
    stationModelAvailable,
    transformerModelAvailable,
    evModelAvailable,
    resolvedStations,
    resolvedTransformers,
    currentTime
  ]);

  // ---------------------------------------------------------------------------
  // Tooltip
  // ---------------------------------------------------------------------------
  const getTooltip = (info: PickingInfo) => {
    if (!info.object) return null;
    if (info.layer?.id?.startsWith("charging-stations")) {
      const s = info.object as ChargingStation;
      return {
        text: `${s.name}\nTotal: ${s.totalStalls} stalls  |  In use: ${s.inUseStalls}  |  Free: ${Math.max(0, s.activeStalls - s.inUseStalls)}`
      };
    }
    if (info.layer?.id?.startsWith("transformer-model") || info.layer?.id === "transformer-fallback") {
      const transformer = info.object as TransformerEntity;
      const loadPct = Math.round(transformer.telemetry.loadFactor * 100);
      const drText = transformer.telemetry.drCapacityReduction > 0
        ? `DR -${transformer.telemetry.drCapacityReduction}%`
        : "DR idle";
      return {
        text: `${transformer.name}\nLoad: ${loadPct}%  |  ${drText}`
      };
    }
    if (info.layer?.id?.startsWith("active-evs")) {
      const ev = info.object as ActiveEV;
      return {
        text: `${ev.id} — ${ev.vehicleType}\n${ev.isDischarging ? "V2G Discharging" : "Smart Charging"}  |  SoC: ${ev.socPercent}%  →  ${ev.targetSocPercent}%`
      };
    }
    return null;
  };

  // ---------------------------------------------------------------------------
  // Click handler
  // ---------------------------------------------------------------------------
  const snapCoordinate = (coord: [number, number]): [number, number] => {
    if (!snapToGrid) return coord;
    const step = gridStep > 0 ? gridStep : 0.00005;
    return [
      Math.round(coord[0] / step) * step,
      Math.round(coord[1] / step) * step
    ];
  };

  const buildMapInfo = (info: PickingInfo): MapClickInfo | null => {
    if (!info.coordinate || info.coordinate.length < 2) return null;
    const coord: [number, number] = [info.coordinate[0], info.coordinate[1]];
    const snapped = snapCoordinate(coord);
    const valid = isPositionValid(snapped, buildingData);
    return { coordinate: snapped, isValidPosition: valid };
  };

  const handleMapClick = (info: PickingInfo) => {
    if (info.object && info.layer?.id?.startsWith("charging-stations")) {
      onSelectEntity?.({ type: "STATION", id: (info.object as ChargingStation).id, data: info.object });
    } else if (info.object && (info.layer?.id?.startsWith("transformer-model") || info.layer?.id === "transformer-fallback")) {
      onSelectEntity?.({ type: "TRANSFORMER", id: (info.object as TransformerEntity).id, data: info.object });
    } else if (info.object && info.layer?.id?.startsWith("active-evs")) {
      onSelectEntity?.({ type: "EV", id: (info.object as ActiveEV).id, data: info.object });
    } else {
      onSelectEntity?.(null);
      if (onMapClick) {
        const mapInfo = buildMapInfo(info);
        if (mapInfo) onMapClick(mapInfo);
      }
    }
  };

  const handleMapHover = (info: PickingInfo) => {
    if (!onMapHover) return;
    const mapInfo = buildMapInfo(info);
    onMapHover(mapInfo);
  };

  return (
    <MapView
      ref={mapRef}
      reuseMaps
      mapStyle={MAP_STYLE}
      maxBounds={MANHATTAN_BOUNDS}
      initialViewState={INITIAL_VIEW_STATE}
      maxZoom={20}
      minZoom={10}
      maxPitch={85}
      onLoad={() => setMapReady(true)}
      onMouseDown={() => handleAutoViewUserInterruption()}
      onTouchStart={() => handleAutoViewUserInterruption()}
      onDragStart={handleAutoViewUserInterruption}
      onZoomStart={handleAutoViewUserInterruption}
      onRotateStart={handleAutoViewUserInterruption}
      onPitchStart={handleAutoViewUserInterruption}
    >
      <DeckGLOverlay
        layers={layers}
        effects={[lightingEffect]}
        getTooltip={getTooltip}
        onClick={handleMapClick}
        onHover={handleMapHover}
      />
    </MapView>
  );
}
