from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


class EntityType(str, Enum):
  EV = "EV"
  CHARGER = "CHARGER"
  GRID_SEGMENT = "GRID_SEGMENT"
  BUILDING = "BUILDING"


class GeoPoint(BaseModel):
  lng: float = Field(ge=-180, le=180)
  lat: float = Field(ge=-90, le=90)


class BaseEntity(BaseModel):
  id: str = Field(default_factory=lambda: str(uuid4()))
  name: str
  type: EntityType


class EVEntity(BaseEntity):
  type: Literal[EntityType.EV] = EntityType.EV
  location: GeoPoint
  soc: float = Field(default=50, ge=0, le=100)
  speed_kmh: float = Field(default=0, ge=0)


class ChargerEntity(BaseEntity):
  type: Literal[EntityType.CHARGER] = EntityType.CHARGER
  location: GeoPoint
  max_kw: float = Field(default=150, ge=1)
  occupancy_ratio: float = Field(default=0, ge=0, le=1)


class GridSegmentEntity(BaseEntity):
  type: Literal[EntityType.GRID_SEGMENT] = EntityType.GRID_SEGMENT
  load_ratio: float = Field(default=0.4, ge=0, le=1)
  start: GeoPoint
  end: GeoPoint


class BuildingEntity(BaseEntity):
  type: Literal[EntityType.BUILDING] = EntityType.BUILDING
  location: GeoPoint
  district: str


EntityPayload = Annotated[
  EVEntity | ChargerEntity | GridSegmentEntity | BuildingEntity,
  Field(discriminator="type"),
]
