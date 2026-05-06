from __future__ import annotations

from collections.abc import Sequence
from typing import Protocol

from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from pydantic import TypeAdapter

from app.schemas.entity import EntityPayload


_entity_adapter = TypeAdapter(EntityPayload)


class EntityRepository(Protocol):
  async def list(self) -> Sequence[EntityPayload]:
    ...

  async def get(self, entity_id: str) -> EntityPayload | None:
    ...

  async def create(self, entity: EntityPayload) -> EntityPayload:
    ...


class InMemoryEntityRepository:
  def __init__(self) -> None:
    self._data: dict[str, EntityPayload] = {}

  async def list(self) -> Sequence[EntityPayload]:
    return list(self._data.values())

  async def get(self, entity_id: str) -> EntityPayload | None:
    return self._data.get(entity_id)

  async def create(self, entity: EntityPayload) -> EntityPayload:
    self._data[entity.id] = entity
    return entity


class MongoEntityRepository:
  def __init__(
    self,
    mongo_uri: str,
    database_name: str = "digital_twin",
    collection_name: str = "entities",
  ) -> None:
    self._client = AsyncIOMotorClient(mongo_uri)
    self._collection: AsyncIOMotorCollection = self._client[database_name][collection_name]

  @staticmethod
  def _deserialize(document: dict) -> EntityPayload:
    normalized = {**document}
    if "_id" in normalized and "id" not in normalized:
      normalized["id"] = str(normalized["_id"])
    normalized.pop("_id", None)
    return _entity_adapter.validate_python(normalized)

  async def list(self) -> Sequence[EntityPayload]:
    cursor = self._collection.find({}, projection={"_id": 0}).sort("name", 1)
    documents = await cursor.to_list(length=None)
    return [self._deserialize(document) for document in documents]

  async def get(self, entity_id: str) -> EntityPayload | None:
    document = await self._collection.find_one({"_id": entity_id})
    if document is None:
      document = await self._collection.find_one({"id": entity_id})
    if document is None:
      return None
    return self._deserialize(document)

  async def create(self, entity: EntityPayload) -> EntityPayload:
    document = entity.model_dump(mode="json")
    document["_id"] = entity.id
    await self._collection.replace_one({"_id": entity.id}, document, upsert=True)
    return self._deserialize(document)

  async def close(self) -> None:
    self._client.close()


class FailoverEntityRepository:
  def __init__(self, primary: MongoEntityRepository, fallback: InMemoryEntityRepository) -> None:
    self._primary = primary
    self._fallback = fallback

  async def list(self) -> Sequence[EntityPayload]:
    try:
      return await self._primary.list()
    except Exception as exc:  # noqa: BLE001
      logger.warning("Mongo list failed, using in-memory fallback: {}", exc)
      return await self._fallback.list()

  async def get(self, entity_id: str) -> EntityPayload | None:
    try:
      entity = await self._primary.get(entity_id)
      if entity is not None:
        return entity
    except Exception as exc:  # noqa: BLE001
      logger.warning("Mongo get failed, using in-memory fallback: {}", exc)
    return await self._fallback.get(entity_id)

  async def create(self, entity: EntityPayload) -> EntityPayload:
    try:
      created = await self._primary.create(entity)
      # Mirror to fallback to preserve continuity if DB is temporarily unavailable.
      await self._fallback.create(created)
      return created
    except Exception as exc:  # noqa: BLE001
      logger.warning("Mongo create failed, using in-memory fallback: {}", exc)
      return await self._fallback.create(entity)

  async def close(self) -> None:
    await self._primary.close()
