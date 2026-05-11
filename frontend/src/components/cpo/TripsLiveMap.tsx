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
import { PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import type { ChargingStation, ActiveEV, Stall, EVFinancialHorizon } from "@/types/cpo";
import { CHARGING_STATIONS, MOCK_EVS } from "@/store/cpo-data";

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
export function TripsLiveMap({ onSelectEntity }: { onSelectEntity?: (entity: any) => void }) {
  const STATION_MODEL_URL = "/models/charge_point.glb";
  // Tạm thời trỏ ev-model sang charge_point để chứng minh layer code đã hoạt động chuẩn
  const EV_MODEL_URL = "/models/ev-model.glb"; // TODO: Đổi lại "/models/ev-model.glb" sau khi bạn fix file model

  const [stationModelAvailable, setStationModelAvailable] = useState(false);
  const [evModelAvailable, setEvModelAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch(STATION_MODEL_URL, { method: "HEAD" }),
      fetch(EV_MODEL_URL, { method: "HEAD" })
    ]).then(([sr, er]) => {
      if (mounted) {
        setStationModelAvailable(sr.ok);
        // Temporarily disable the EV model because parse-gltf crashes on the current ev-model.glb
        setEvModelAvailable(er.ok);
      }
    }).catch(() => { });
    return () => { mounted = false; };
  }, []);

  const layers = useMemo(() => {
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
          data: CHARGING_STATIONS,
          scenegraph: STATION_MODEL_URL,
          getPosition: (d) => [...d.position, 0] as [number, number, number],
          getScale: () => [3, 3, 3],
          getOrientation: () => [0, 0, 90] as [number, number, number],
          sizeScale: 20,
          sizeMinPixels: 5,
          sizeMaxPixels: 200,
          _lighting: "pbr",
          pickable: true,
          autoHighlight: true
        })
        : new ScenegraphLayer<ChargingStation>({
          id: "charging-stations",
          data: CHARGING_STATIONS,
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

      // 4. Active EVs — 3D model or ScatterplotLayer fallback
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
  }, [stationModelAvailable, evModelAvailable]);

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
  const handleMapClick = (info: PickingInfo) => {
    if (info.object && info.layer?.id?.startsWith("charging-stations")) {
      onSelectEntity?.({ type: "STATION", id: (info.object as ChargingStation).id, data: info.object });
    } else if (info.object && info.layer?.id?.startsWith("active-evs")) {
      onSelectEntity?.({ type: "EV", id: (info.object as ActiveEV).id, data: info.object });
    } else {
      onSelectEntity?.(null);
    }
  };

  return (
    <Map
      reuseMaps
      mapStyle={MAP_STYLE}
      maxBounds={MANHATTAN_BOUNDS}
      initialViewState={INITIAL_VIEW_STATE}
      maxZoom={20}
      minZoom={10}
      maxPitch={85}
    >
      <DeckGLOverlay
        layers={layers}
        effects={[lightingEffect]}
        getTooltip={getTooltip}
        onClick={handleMapClick}
      />
    </Map>
  );
}
