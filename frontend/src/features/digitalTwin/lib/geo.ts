import { HANOI_BOUNDS, HANOI_CENTER } from "@/features/digitalTwin/config/constants";
import type { LngLatAlt, RoutePoint } from "@/features/digitalTwin/types/twin";

const [MIN_LNG, MIN_LAT, MAX_LNG, MAX_LAT] = HANOI_BOUNDS;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomLngLatAlt(alt = 0): LngLatAlt {
  return [randomInRange(MIN_LNG, MAX_LNG), randomInRange(MIN_LAT, MAX_LAT), alt];
}

export function headingFrom(a: LngLatAlt, b: LngLatAlt): number {
  const y = Math.sin(b[0] - a[0]) * Math.cos(b[1]);
  const x =
    Math.cos(a[1]) * Math.sin(b[1]) -
    Math.sin(a[1]) * Math.cos(b[1]) * Math.cos(b[0] - a[0]);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

export function createLoopRoute(start: LngLatAlt, pointCount = 24): RoutePoint[] {
  const route: RoutePoint[] = [];
  const lngRadius = randomInRange(0.0008, 0.0024);
  const latRadius = randomInRange(0.0007, 0.0019);

  for (let i = 0; i < pointCount; i += 1) {
    const t = (i / pointCount) * Math.PI * 2;
    const lng = clamp(start[0] + Math.cos(t) * lngRadius + (Math.random() - 0.5) * 0.0003, MIN_LNG, MAX_LNG);
    const lat = clamp(start[1] + Math.sin(t * 1.05) * latRadius + (Math.random() - 0.5) * 0.00025, MIN_LAT, MAX_LAT);
    route.push({
      position: [lng, lat, 1.2],
      timestamp: i
    });
  }

  route.push({
    position: [route[0].position[0], route[0].position[1], 1.2],
    timestamp: pointCount
  });

  return route;
}

export function moveAroundCenter(step: number, index: number): LngLatAlt {
  const angle = step * 0.07 + index * 0.53;
  const lng = clamp(HANOI_CENTER[0] + Math.cos(angle) * (0.0016 + (index % 8) * 0.00017), MIN_LNG, MAX_LNG);
  const lat = clamp(HANOI_CENTER[1] + Math.sin(angle * 1.12) * (0.0013 + (index % 8) * 0.00014), MIN_LAT, MAX_LAT);
  return [lng, lat, 1.2];
}
