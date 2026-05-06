import type { GridSegmentEntity } from "@/types/entities";

export type GridZone = {
  id: string;
  district: string;
  segments: GridSegmentEntity[];
};
