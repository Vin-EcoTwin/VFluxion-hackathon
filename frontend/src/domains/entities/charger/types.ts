import type { ChargerEntity } from "@/types/entities";

export type ChargerCluster = {
  id: string;
  name: string;
  chargers: ChargerEntity[];
};
