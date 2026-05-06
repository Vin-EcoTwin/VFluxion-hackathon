from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_ditto_client
from app.ditto_integration.client import DittoClient
from app.schemas.ditto import DittoThingPayload

router = APIRouter(prefix="/ditto", tags=["ditto"])


@router.get("/things")
async def list_things(client: DittoClient = Depends(get_ditto_client)):
  return await client.list_things()


@router.get("/things/{thing_id}")
async def get_thing(thing_id: str, client: DittoClient = Depends(get_ditto_client)):
  result = await client.get_thing(thing_id)
  if result is None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thing not found")
  return result


@router.put("/things/{thing_id}")
async def upsert_thing(
  thing_id: str,
  payload: DittoThingPayload,
  client: DittoClient = Depends(get_ditto_client),
):
  return await client.upsert_thing(thing_id, payload.model_dump())
