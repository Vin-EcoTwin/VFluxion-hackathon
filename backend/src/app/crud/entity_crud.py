from __future__ import annotations

from collections.abc import Sequence

from app.domains.entities.repository import InMemoryEntityRepository
from app.schemas.entity import EntityPayload


async def create_entity(repository: InMemoryEntityRepository, payload: EntityPayload) -> EntityPayload:
  return await repository.create(payload)


async def list_entities(repository: InMemoryEntityRepository) -> Sequence[EntityPayload]:
  return await repository.list()
