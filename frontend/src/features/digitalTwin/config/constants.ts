import type { LngLatAlt } from "@/features/digitalTwin/types/twin";

export const HANOI_CENTER: LngLatAlt = [105.85, 21.028, 0];

export const HANOI_BOUNDS: [number, number, number, number] = [105.8425, 21.0205, 105.8575, 21.0355];

export const DITTO_NAMESPACE = "digitaltwin.hanoi";

export const DITTO_PROXY_BASE_URL =
  process.env.NEXT_PUBLIC_DITTO_PROXY_BASE_URL ?? "http://localhost:8000/api/v1/ditto";

export const DITTO_WS_URL = process.env.NEXT_PUBLIC_DITTO_WS_URL ?? "ws://localhost:8080/ws/2";

// Placeholder GLB model URLs. Replace with your hosted models (S3, Cloudflare R2, Vercel Blob, etc.).
// Good free sources: Poly Pizza, Sketchfab (CC), Kenney, and Khronos glTF Sample Models.
export const MODEL_URLS = {
  electricCar: process.env.NEXT_PUBLIC_MODEL_EV_URL ?? "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/scenegraph-layer/airplane.glb",
  chargingStation:
    process.env.NEXT_PUBLIC_MODEL_STATION_URL ??
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
  substation:
    process.env.NEXT_PUBLIC_MODEL_SUBSTATION_URL ??
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb"
};

// For Tile3DLayer with Cesium OSM 3D Tiles:
// 1) Create a Cesium Ion account and get token.
// 2) Set NEXT_PUBLIC_CESIUM_ION_TOKEN in frontend env.
// 3) Optionally replace asset id if you use your own tileset.
export const CESIUM_ION_OSM_ASSET_ID = Number(process.env.NEXT_PUBLIC_CESIUM_ION_ASSET_ID ?? 96188);
export const CESIUM_ION_TOKEN = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN ?? "";

export const TERRAIN_ELEVATION_URL =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

export const TERRAIN_TEXTURE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const DEFAULT_EV_COUNT = 90;
export const DEFAULT_STATION_COUNT = 12;
export const DEFAULT_SUBSTATION_COUNT = 4;
