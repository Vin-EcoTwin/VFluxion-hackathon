from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_entity_service
from app.domains.entities.service import EntityService
from app.schemas.entity import EntityPayload

router = APIRouter(prefix="/entities", tags=["entities"])


@router.get("", response_model=list[EntityPayload])
async def list_entities(service: EntityService = Depends(get_entity_service)):
  return await service.list_entities()


@router.post("", response_model=EntityPayload, status_code=status.HTTP_201_CREATED)
async def create_entity(payload: EntityPayload, service: EntityService = Depends(get_entity_service)):
  return await service.create_entity(payload)


@router.get("/{entity_id}", response_model=EntityPayload)
async def get_entity(entity_id: str, service: EntityService = Depends(get_entity_service)):
  entity = await service.get_entity(entity_id)
  if entity is None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found")
  return entity
