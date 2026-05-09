from __future__ import annotations

from collections.abc import Sequence
from app.schemas.entity import EntityPayload


class EntityService:
  def __init__(self, repository) -> None:
    self._repository = repository

  async def list_entities(self) -> Sequence[EntityPayload]:
    return await self._repository.list()

  async def get_entity(self, entity_id: str) -> EntityPayload | None:
    return await self._repository.get(entity_id)

  async def create_entity(self, entity: EntityPayload) -> EntityPayload:
    created = await self._repository.create(entity)

    # TODO: Implement Digital Twin logic with MongoDB.

    return created
