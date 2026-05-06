from __future__ import annotations

from fastapi import WebSocket


class ConnectionManager:
  def __init__(self) -> None:
    self.active_connections: set[WebSocket] = set()

  async def connect(self, websocket: WebSocket) -> None:
    await websocket.accept()
    self.active_connections.add(websocket)

  def disconnect(self, websocket: WebSocket) -> None:
    self.active_connections.discard(websocket)

  async def send_json(self, websocket: WebSocket, payload: dict) -> None:
    await websocket.send_json(payload)

  async def broadcast_json(self, payload: dict) -> None:
    stale: list[WebSocket] = []
    for connection in self.active_connections:
      try:
        await connection.send_json(payload)
      except Exception:  # noqa: BLE001
        stale.append(connection)

    for connection in stale:
      self.disconnect(connection)
