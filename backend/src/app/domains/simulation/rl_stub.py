from __future__ import annotations

import random


class RLCoordinatorStub:
  """Stub for future multi-agent RL policy integration."""

  def __init__(self) -> None:
    self._rng = random.Random()

  def choose_action(self) -> str:
    return self._rng.choice(["balance", "charge-priority", "feed-grid"])
