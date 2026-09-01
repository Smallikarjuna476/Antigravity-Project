import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriSense AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev_secret_key_123456789_32bytes_long")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./agrisense.db"
    
    # External APIs
    DATA_GOV_IN_API_KEY: str = ""
    WEATHER_API_KEY: str = ""
    AI_API_KEY: str = ""
    
    DEMO_MODE: bool = False
    
    # Static & Storage Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STATIC_DIR: str = os.path.join(BASE_DIR, "static")
    UPLOADS_DIR: str = os.path.join(STATIC_DIR, "uploads")
    HEATMAPS_DIR: str = os.path.join(STATIC_DIR, "heatmaps")
    REPORTS_DIR: str = os.path.join(STATIC_DIR, "reports")
    SAMPLES_DIR: str = os.path.join(STATIC_DIR, "samples")
    
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    
    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", env_file_encoding="utf-8")

settings = Settings()

# Ensure directories exist
for path in [settings.STATIC_DIR, settings.UPLOADS_DIR, settings.HEATMAPS_DIR, settings.REPORTS_DIR, settings.SAMPLES_DIR]:
    os.makedirs(path, exist_ok=True)
