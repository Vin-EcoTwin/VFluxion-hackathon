from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class DittoThingPayload(BaseModel):
  attributes: dict[str, Any] = Field(default_factory=dict)
  features: dict[str, Any] = Field(default_factory=dict)
