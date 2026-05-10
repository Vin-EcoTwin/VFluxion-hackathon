import { TWIN_NAMESPACE, MODEL_URLS, TERRAIN_ELEVATION_URL, TERRAIN_TEXTURE_URL } from "@/config/appConfig";
import type { LngLatAlt } from "@/features/digitalTwin/types/twin";

export const HANOI_CENTER: LngLatAlt = [105.85, 21.028, 0];

export const HANOI_BOUNDS: [number, number, number, number] = [105.8425, 21.0205, 105.8575, 21.0355];

export { MODEL_URLS, TERRAIN_ELEVATION_URL, TERRAIN_TEXTURE_URL, TWIN_NAMESPACE };

export const DEFAULT_EV_COUNT = 90;
export const DEFAULT_STATION_COUNT = 12;
export const DEFAULT_SUBSTATION_COUNT = 4;
