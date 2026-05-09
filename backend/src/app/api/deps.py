from __future__ import annotations

from app.core.config import Settings, get_settings
from app.domains.entities.repository import MongoEntityRepository
from app.domains.entities.service import EntityService
from app.services.simulation_service import SimulationService
from app.websocket.manager import ConnectionManager

settings = get_settings()

entity_repository = MongoEntityRepository(settings.mongodb_uri, settings.db_name)
entity_service = EntityService(entity_repository)
simulation_service = SimulationService()
websocket_manager = ConnectionManager()


def get_entity_service() -> EntityService:
  return entity_service


def get_simulation_service() -> SimulationService:
  return simulation_service


async def close_entity_repository() -> None:
  await entity_repository.close()


async def close_runtime_resources() -> None:
  await close_entity_repository()
