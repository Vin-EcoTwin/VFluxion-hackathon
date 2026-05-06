from __future__ import annotations

from pydantic import BaseModel, Field


class ScenarioRequest(BaseModel):
  scenario_name: str
  duration_minutes: int = Field(ge=1, le=480)
  target_district: str


class ScenarioResponse(BaseModel):
  scenario_id: str
  status: str
  estimated_load_shift: float


class SimulationTick(BaseModel):
  tick: int
  grid_load_ratio: float = Field(ge=0, le=1)
  active_evs: int = Field(ge=0)
  connected_chargers: int = Field(ge=0)
