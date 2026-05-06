from __future__ import annotations

from typing import Any

import httpx
from loguru import logger


class DittoClient:
  def __init__(self, base_url: str, username: str, password: str, pre_auth_subject: str) -> None:
    self._base_url = base_url.rstrip("/")
    self._pre_auth_subject = pre_auth_subject
    self._client = httpx.AsyncClient(
      base_url=self._base_url,
      auth=(username, password),
      timeout=10.0,
    )

  def _headers(self) -> dict[str, str]:
    return {
      "x-ditto-pre-authenticated": self._pre_auth_subject,
      "content-type": "application/json",
    }

  async def get_thing(self, thing_id: str) -> dict[str, Any] | None:
    response = await self._client.get(f"/api/2/things/{thing_id}", headers=self._headers())
    if response.status_code == 404:
      return None

    response.raise_for_status()
    return response.json()

  async def upsert_thing(self, thing_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    response = await self._client.put(
      f"/api/2/things/{thing_id}",
      json=payload,
      headers=self._headers(),
    )
    response.raise_for_status()
    return {
      "thing_id": thing_id,
      "status": response.status_code,
    }

  async def list_things(self) -> list[dict[str, Any]]:
    response = await self._client.get("/api/2/things", headers=self._headers())
    response.raise_for_status()
    payload = response.json()
    if isinstance(payload, list):
      return payload
    return []

  async def close(self) -> None:
    try:
      await self._client.aclose()
    except Exception as exc:  # noqa: BLE001
      logger.warning("Error closing Ditto client: {}", exc)
