from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient


class MongoRepository:
  """Shared mongo connector for future persistence layers."""

  def __init__(self, mongo_uri: str, database_name: str = "digital_twin") -> None:
    self.client = AsyncIOMotorClient(mongo_uri)
    self.db = self.client[database_name]
