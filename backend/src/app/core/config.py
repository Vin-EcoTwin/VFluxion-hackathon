from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  app_name: str = "EcoTwin Backend"
  api_v1_prefix: str = "/api/v1"

  backend_host: str = "0.0.0.0"
  backend_port: int = 8000
  backend_log_level: str = "INFO"

  mongodb_uri: str = Field(
    default="mongodb://localhost:27017",
    validation_alias=AliasChoices("MONGODB_URI", "MONGO_URI"),
  )
  db_name: str = Field(default="digital_twin", validation_alias=AliasChoices("DB_NAME", "MONGODB_DB_NAME"))

  simulation_tick_seconds: float = 1.0
  cors_allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

  @property
  def cors_origin_list(self) -> list[str]:
    raw = self.cors_allowed_origins.strip()
    if raw == "*":
      return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]

  model_config = SettingsConfigDict(env_file=str(Path(__file__).resolve().parents[3] / ".env"), extra="ignore")


@lru_cache
def get_settings() -> Settings:
  return Settings()
