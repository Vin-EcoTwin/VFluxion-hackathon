from __future__ import annotations

from collections.abc import Sequence

from loguru import logger

from app.ditto_integration.mapper import entity_to_ditto_thing
from app.schemas.entity import EntityPayload


class EntityService:
  def __init__(self, repository, ditto_client) -> None:
    self._repository = repository
    self._ditto_client = ditto_client

  async def list_entities(self) -> Sequence[EntityPayload]:
    return await self._repository.list()

  async def get_entity(self, entity_id: str) -> EntityPayload | None:
    return await self._repository.get(entity_id)

  async def create_entity(self, entity: EntityPayload) -> EntityPayload:
    created = await self._repository.create(entity)

    # Keep Ditto synchronized as digital twin source of truth.
    thing_id, payload = entity_to_ditto_thing(created)
    try:
      await self._ditto_client.upsert_thing(thing_id, payload)
    except Exception as exc:  # noqa: BLE001
      logger.warning("Ditto sync failed for entity {}: {}", created.id, exc)

    return created
