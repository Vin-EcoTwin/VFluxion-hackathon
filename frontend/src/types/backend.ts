export type BackendEntityType = "EV" | "CHARGER" | "GRID_SEGMENT" | "BUILDING";

export type BackendGeoPoint = {
  lng: number;
  lat: number;
};

type BackendBaseEntity = {
  id: string;
  name: string;
  type: BackendEntityType;
};

type BackendBaseInput = {
  id?: string;
  name: string;
  type: BackendEntityType;
};

export type BackendEVEntity = BackendBaseEntity & {
  type: "EV";
  location: BackendGeoPoint;
  soc: number;
  speed_kmh: number;
};

export type BackendChargerEntity = BackendBaseEntity & {
  type: "CHARGER";
  location: BackendGeoPoint;
  max_kw: number;
  occupancy_ratio: number;
};

export type BackendGridSegmentEntity = BackendBaseEntity & {
  type: "GRID_SEGMENT";
  load_ratio: number;
  start: BackendGeoPoint;
  end: BackendGeoPoint;
};

export type BackendBuildingEntity = BackendBaseEntity & {
  type: "BUILDING";
  location: BackendGeoPoint;
  district: string;
};

export type BackendEntityPayload =
  | BackendEVEntity
  | BackendChargerEntity
  | BackendGridSegmentEntity
  | BackendBuildingEntity;

export type CreateBackendEVPayload = BackendBaseInput & {
  type: "EV";
  location: BackendGeoPoint;
  soc: number;
  speed_kmh: number;
};

export type CreateBackendChargerPayload = BackendBaseInput & {
  type: "CHARGER";
  location: BackendGeoPoint;
  max_kw: number;
  occupancy_ratio: number;
};

export type CreateBackendGridSegmentPayload = BackendBaseInput & {
  type: "GRID_SEGMENT";
  load_ratio: number;
  start: BackendGeoPoint;
  end: BackendGeoPoint;
};

export type CreateBackendBuildingPayload = BackendBaseInput & {
  type: "BUILDING";
  location: BackendGeoPoint;
  district: string;
};

export type CreateBackendEntityPayload =
  | CreateBackendEVPayload
  | CreateBackendChargerPayload
  | CreateBackendGridSegmentPayload
  | CreateBackendBuildingPayload;
