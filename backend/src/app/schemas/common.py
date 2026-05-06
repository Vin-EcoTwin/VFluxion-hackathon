from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field


class MessageEnvelope(BaseModel):
  channel: str
  timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
  payload: dict[str, Any]
