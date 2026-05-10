"use client";

import { useEffect, useMemo, useState } from "react";
import { Map, useControl } from "react-map-gl/maplibre";
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
import { ColumnLayer, PolygonLayer } from "@deck.gl/layers";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";

const DATA_URLS = {
  buildings: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json",
  trips: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json"
};

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

const LOOP_LENGTH = 1800;
const TRAIL_LENGTH = 180;
const ANIMATION_SPEED = 1;

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const LAND_COVER: Position[][] = [
  [
    [-74.0, 40.7],
    [-74.02, 40.7],
    [-74.02, 40.72],
    [-74.0, 40.72]
  ]
];

type Trip = {
  vendor: number;
  path: Position[];
  timestamps: number[];
};

type Building = {
  polygon: Position[];
  height: number;
};

type ChargingStation = {
  id: string;
  name: string;
  position: [number, number];
  totalStalls: number;
  activeStalls: number;
  inUseStalls: number;
};

const CHARGING_STATIONS: ChargingStation[] = [
  {
    id: "station-01",
    name: "Times Sq Hub",
    position: [-73.9855, 40.758],
    totalStalls: 7,
    activeStalls: 7,
    inUseStalls: 5
  },
  {
    id: "station-02",
    name: "Penn Station",
    position: [-73.994, 40.7506],
    totalStalls: 7,
    activeStalls: 6,
    inUseStalls: 4
  },
  {
    id: "station-03",
    name: "Grand Central",
    position: [-73.9772, 40.7527],
    totalStalls: 7,
    activeStalls: 7,
    inUseStalls: 6
  },
  {
    id: "station-04",
    name: "Union Square",
    position: [-73.991, 40.7359],
    totalStalls: 7,
    activeStalls: 6,
    inUseStalls: 3
  },
  {
    id: "station-05",
    name: "Wall Street",
    position: [-74.009, 40.706],
    totalStalls: 7,
    activeStalls: 5,
    inUseStalls: 2
  },
  {
    id: "station-06",
    name: "Central Park S",
    position: [-73.9817, 40.7681],
    totalStalls: 7,
    activeStalls: 7,
    inUseStalls: 4
  },
  {
    id: "station-07",
    name: "Chinatown",
    position: [-73.9967, 40.7158],
    totalStalls: 7,
    activeStalls: 6,
    inUseStalls: 6
  }
];

function mixChannel(start: number, end: number, t: number) {
  return Math.round(start + (end - start) * t);
}

function getStationColor(station: ChargingStation): [number, number, number, number] {
  const safeActive = Math.max(1, station.activeStalls);
  const ratio = station.inUseStalls / safeActive;
  const low: [number, number, number] = [78, 222, 163];
  const high: [number, number, number] = [255, 178, 102];
  return [
    mixChannel(low[0], high[0], ratio),
    mixChannel(low[1], high[1], ratio),
    mixChannel(low[2], high[2], ratio),
    230
  ];
}

function useTripTime(loopLength: number, animationSpeed: number) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const duration = (loopLength * 60) / animationSpeed;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) % duration;
      const nextTime = (elapsed / duration) * loopLength;
      setTime(nextTime);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [animationSpeed, loopLength]);

  return time;
}

/* ------------------------------------------------------------------ */
/*  DeckGL overlay rendered inside MapLibre via useControl             */
/*  This ensures layers share the same WebGL context & camera as the  */
/*  basemap, so they stay perfectly anchored.                         */
/* ------------------------------------------------------------------ */
function DeckGLOverlay(
  props: MapboxOverlayProps & { interleaved?: boolean }
) {
  const overlay = useControl<MapboxOverlay>(
    () => new MapboxOverlay(props)
  );
  overlay.setProps(props);
  return null;
}

export function TripsLiveMap() {
  const time = useTripTime(LOOP_LENGTH, ANIMATION_SPEED);
  const MODEL_URL = "/models/charge_point.glb";
  const [modelAvailable, setModelAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(MODEL_URL, { method: "HEAD" })
      .then((res) => {
        if (mounted) setModelAvailable(res.ok);
      })
      .catch(() => {
        if (mounted) setModelAvailable(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const layers = useMemo(() => {
    return [
      new PolygonLayer<Position[]>({
        id: "ground",
        data: LAND_COVER,
        getPolygon: (polygon) => polygon,
        stroked: false,
        getFillColor: [0, 0, 0, 0]
      }),
      new TripsLayer<Trip>({
        id: "trips",
        data: DATA_URLS.trips,
        getPath: (d) => d.path,
        getTimestamps: (d) => d.timestamps,
        getColor: (d) => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        widthMinPixels: 2,
        jointRounded: true,
        capRounded: true,
        trailLength: TRAIL_LENGTH,
        currentTime: time,
        shadowEnabled: false
      }),
      new PolygonLayer<Building>({
        id: "buildings",
        data: DATA_URLS.buildings,
        extruded: true,
        wireframe: false,
        opacity: 0.5,
        getPolygon: (d) => d.polygon,
        getElevation: (d) => d.height,
        getFillColor: [74, 80, 87],
        material: {
          ambient: 0.1,
          diffuse: 0.6,
          shininess: 32,
          specularColor: [60, 64, 70]
        }
      }),
      // Render 3D model if available, otherwise fall back to ColumnLayer
      (modelAvailable
        ? new ScenegraphLayer<ChargingStation>({
            id: "charging-stations-model",
            data: CHARGING_STATIONS,
            scenegraph: MODEL_URL,
            getPosition: (d) => [...d.position, 0] as [number, number, number],
            getScale: () => [3, 3, 3],
            getOrientation: () => [0, 0, 90] as [number, number, number],
            sizeScale: 30,
            sizeMinPixels: 12,
            sizeMaxPixels: 500,
            _lighting: "pbr",
            pickable: true,
            autoHighlight: true
          })
        : new ColumnLayer<ChargingStation>({
            id: "charging-stations",
            data: CHARGING_STATIONS,
            extruded: true,
            diskResolution: 4,
            radius: 20,
            radiusUnits: "meters",
            getPosition: (d) => d.position,
            getElevation: (d) => 24 + d.inUseStalls * 8 + d.activeStalls * 3,
            getFillColor: (d) => getStationColor(d),
            getLineColor: [245, 250, 255, 220],
            lineWidthUnits: "pixels",
            lineWidthMinPixels: 1,
            material: {
              ambient: 0.35,
              diffuse: 0.7,
              shininess: 48,
              specularColor: [255, 255, 255]
            },
            pickable: true,
            autoHighlight: true
          }))
    ];
  }, [time, modelAvailable]);

  const getTooltip = (info: PickingInfo) => {
    if (!info.object || !info.layer?.id?.startsWith("charging-stations")) {
      return null;
    }

    const station = info.object as ChargingStation;
    const free = Math.max(0, station.activeStalls - station.inUseStalls);

    return {
      text: `${station.name}\nTotal stalls: ${station.totalStalls}\nOperational (available): ${station.activeStalls}\nFree stalls: ${free}\nIn use: ${station.inUseStalls}`
    };
  };

  return (
    <Map
      reuseMaps
      mapStyle={MAP_STYLE}
      maxBounds={MANHATTAN_BOUNDS}
      initialViewState={INITIAL_VIEW_STATE}
      maxZoom={16}
      minZoom={11.5}
      maxPitch={60}
    >
      <DeckGLOverlay
        layers={layers}
        effects={[lightingEffect]}
        getTooltip={getTooltip}
      />
    </Map>
  );
}
