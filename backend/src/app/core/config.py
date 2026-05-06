from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  app_name: str = "EcoTwin Backend"
  api_v1_prefix: str = "/api/v1"

  backend_host: str = "0.0.0.0"
  backend_port: int = 8000
  backend_log_level: str = "INFO"

  mongo_uri: str = Field(
    default="mongodb://localhost:27017/digital_twin",
    validation_alias=AliasChoices("MONGO_URI", "MONGODB_ATLAS_URI"),
  )

  ditto_http_url: str = "http://localhost:8080"
  ditto_ws_url: str = "ws://localhost:8080/ws/2"
  ditto_username: str = "ditto"
  ditto_password: str = "ditto"
  ditto_pre_auth_subject: str = "pre:ecotwin-backend"

  simulation_tick_seconds: float = 1.0
  cors_allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

  @property
  def cors_origin_list(self) -> list[str]:
    raw = self.cors_allowed_origins.strip()
    if raw == "*":
      return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]

  model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
  return Settings()
