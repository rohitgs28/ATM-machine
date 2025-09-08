# Application configuration using Pydantic.

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = Field(default="dev", alias="APP_ENV")
    database_url: str = Field(..., alias="DATABASE_URL")
    cors_origin: str = Field(default="http://localhost:3000", alias="CORS_ORIGIN")
    session_ttl_min: int = Field(default=15, alias="SESSION_TTL_MIN")
    rate_limit_window_sec: int = Field(default=900, alias="RATE_LIMIT_WINDOW_SEC")
    rate_limit_max_attempts: int = Field(default=5, alias="RATE_LIMIT_MAX_ATTEMPTS")

    # Pydantic v2 config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
