from __future__ import annotations


def estimate_load_shift(active_evs: int, connected_chargers: int) -> float:
  shift = (active_evs * 0.12) - (connected_chargers * 0.04)
  return round(shift, 2)
