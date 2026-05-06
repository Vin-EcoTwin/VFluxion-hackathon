from __future__ import annotations

import asyncio

from app.services.simulation_service import SimulationService
from app.websocket.broadcaster import broadcast_tick
from app.websocket.manager import ConnectionManager


async def simulation_tick_worker(
  manager: ConnectionManager,
  simulation_service: SimulationService,
  tick_seconds: float,
) -> None:
  while True:
    tick = simulation_service.next_tick()
    await broadcast_tick(manager, tick)
    await asyncio.sleep(tick_seconds)
