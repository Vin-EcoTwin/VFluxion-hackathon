from fastapi import APIRouter

from app.api.v1.endpoints import entities, health, simulation

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(entities.router)
api_router.include_router(simulation.router)
