from __future__ import annotations

from dataclasses import dataclass


@dataclass
class EntityTwinRef:
  thing_id: str
  policy_id: str
