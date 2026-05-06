import type { BaseEntity } from "@/types/entities";

export function isEntityValid(entity: BaseEntity): boolean {
  return Boolean(entity.id && entity.name && entity.type);
}
