from __future__ import annotations

from app.core.config import Settings, get_settings
from app.ditto_integration.client import DittoClient
from app.domains.entities.repository import (
  FailoverEntityRepository,
  InMemoryEntityRepository,
  MongoEntityRepository,
)
from app.domains.entities.service import EntityService
from app.services.simulation_service import SimulationService
from app.websocket.manager import ConnectionManager

settings = get_settings()

in_memory_entity_repository = InMemoryEntityRepository()
mongo_entity_repository = MongoEntityRepository(settings.mongo_uri)
entity_repository = FailoverEntityRepository(
  primary=mongo_entity_repository,
  fallback=in_memory_entity_repository,
)
ditto_client = DittoClient(
  base_url=settings.ditto_http_url,
  username=settings.ditto_username,
  password=settings.ditto_password,
  pre_auth_subject=settings.ditto_pre_auth_subject,
)
entity_service = EntityService(entity_repository, ditto_client)
simulation_service = SimulationService()
websocket_manager = ConnectionManager()


def get_entity_service() -> EntityService:
  return entity_service


def get_simulation_service() -> SimulationService:
  return simulation_service


def get_ditto_client() -> DittoClient:
  return ditto_client


async def close_ditto_client() -> None:
  await ditto_client.close()


async def close_entity_repository() -> None:
  await entity_repository.close()


async def close_runtime_resources() -> None:
  await close_ditto_client()
  await close_entity_repository()
