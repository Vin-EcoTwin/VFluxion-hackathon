from __future__ import annotations

import asyncio

import websockets


class DittoWSClient:
  """Simple websocket client stub for Ditto event consumption."""

  def __init__(self, url: str, auth_token: str) -> None:
    self.url = url
    self.auth_token = auth_token

  async def listen_once(self) -> str | None:
    headers = {"Authorization": self.auth_token}
    async with websockets.connect(self.url, additional_headers=headers) as websocket:
      try:
        return await asyncio.wait_for(websocket.recv(), timeout=1.5)
      except TimeoutError:
        return None
