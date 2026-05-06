import type { BuildingEntity } from "@/types/entities";

export type BuildingGroup = {
  id: string;
  name: string;
  buildings: BuildingEntity[];
};
