from __future__ import annotations

import asyncio
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

SRC_DIR = Path(__file__).resolve().parent
if str(SRC_DIR) not in sys.path:
  sys.path.insert(0, str(SRC_DIR))

from app.api.deps import close_runtime_resources, get_settings, simulation_service, websocket_manager
from app.api.v1.router import api_router
from app.core.logging import setup_logging
from app.schemas.common import MessageEnvelope
from app.workers.tasks import simulation_tick_worker

settings = get_settings()
setup_logging(settings.backend_log_level)


@asynccontextmanager
async def lifespan(_: FastAPI):
  logger.info("Starting EcoTwin backend")
  task = asyncio.create_task(
    simulation_tick_worker(
      manager=websocket_manager,
      simulation_service=simulation_service,
      tick_seconds=settings.simulation_tick_seconds,
    )
  )

  try:
    yield
  finally:
    task.cancel()
    try:
      await task
    except asyncio.CancelledError:
      logger.info("Simulation worker cancelled")

    await close_runtime_resources()
    logger.info("EcoTwin backend stopped")


app = FastAPI(
  title="EcoTwin Backend",
  description="Digital Twin V2G backend for Hanoi smart-grid simulation",
  version="0.1.0",
  lifespan=lifespan,
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.cors_origin_list,
  allow_credentials=False,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.websocket("/ws/realtime")
async def realtime_socket(websocket: WebSocket):
  await websocket_manager.connect(websocket)
  try:
    await websocket_manager.send_json(
      websocket,
      MessageEnvelope(
        channel="system.connected",
        payload={"message": "Connected to EcoTwin realtime stream"},
      ).model_dump(mode="json"),
    )

    while True:
      data = await websocket.receive_text()
      await websocket_manager.send_json(
        websocket,
        MessageEnvelope(
          channel="system.echo",
          payload={"content": data},
        ).model_dump(mode="json"),
      )
  except WebSocketDisconnect:
    websocket_manager.disconnect(websocket)
    logger.info("Realtime websocket disconnected")
