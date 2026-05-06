from __future__ import annotations

from app.schemas.entity import EntityPayload


def entity_to_ditto_thing(entity: EntityPayload) -> tuple[str, dict]:
  namespace = "ecotwin.hanoi"
  thing_id = f"{namespace}:{entity.type.value.lower()}-{entity.id}"

  payload = {
    "attributes": {
      "name": entity.name,
      "entityType": entity.type.value,
    },
    "features": {
      "state": {
        "properties": entity.model_dump(mode="json"),
      }
    },
  }
  return thing_id, payload
