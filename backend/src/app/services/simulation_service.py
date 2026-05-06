from __future__ import annotations

import random
from uuid import uuid4

from app.domains.simulation.engine import estimate_load_shift
from app.domains.simulation.rl_stub import RLCoordinatorStub
from app.schemas.simulation import ScenarioRequest, ScenarioResponse, SimulationTick


class SimulationService:
  def __init__(self) -> None:
    self._scenario: ScenarioRequest | None = None
    self._tick = 0
    self._rng = random.Random()
    self._rl_stub = RLCoordinatorStub()

  async def run(self, payload: ScenarioRequest) -> ScenarioResponse:
    self._scenario = payload
    self._tick = 0

    active_evs = self._rng.randint(80, 180)
    chargers = self._rng.randint(20, 90)

    return ScenarioResponse(
      scenario_id=str(uuid4()),
      status="started",
      estimated_load_shift=estimate_load_shift(active_evs, chargers),
    )

  def next_tick(self) -> SimulationTick:
    self._tick += 1

    active_evs = self._rng.randint(90, 200)
    connected_chargers = self._rng.randint(20, 95)
    base_load = self._rng.uniform(0.25, 0.85)
    action = self._rl_stub.choose_action()

    action_bias = {
      "balance": 0.0,
      "charge-priority": 0.07,
      "feed-grid": -0.06,
    }[action]

    grid_load_ratio = max(0, min(1, base_load + action_bias))

    return SimulationTick(
      tick=self._tick,
      grid_load_ratio=round(grid_load_ratio, 3),
      active_evs=active_evs,
      connected_chargers=connected_chargers,
    )
