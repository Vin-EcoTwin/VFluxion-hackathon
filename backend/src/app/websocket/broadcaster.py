from __future__ import annotations

from app.schemas.common import MessageEnvelope
from app.schemas.simulation import SimulationTick
from app.websocket.manager import ConnectionManager


async def broadcast_tick(manager: ConnectionManager, tick: SimulationTick) -> None:
  envelope = MessageEnvelope(channel="simulation.tick", payload=tick.model_dump(mode="json"))
  await manager.broadcast_json(envelope.model_dump(mode="json"))
