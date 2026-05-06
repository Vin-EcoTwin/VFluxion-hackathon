from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_simulation_service
from app.schemas.simulation import ScenarioRequest, ScenarioResponse, SimulationTick
from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.post("/run", response_model=ScenarioResponse)
async def run_scenario(
  payload: ScenarioRequest,
  service: SimulationService = Depends(get_simulation_service),
):
  return await service.run(payload)


@router.get("/tick", response_model=SimulationTick)
async def get_latest_tick(service: SimulationService = Depends(get_simulation_service)):
  return service.next_tick()
