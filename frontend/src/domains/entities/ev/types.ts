import type { EVEntity } from "@/types/entities";

export type EVRoutePoint = {
  lng: number;
  lat: number;
  etaSeconds: number;
};

export type EVWithRoute = EVEntity & {
  route: EVRoutePoint[];
};
