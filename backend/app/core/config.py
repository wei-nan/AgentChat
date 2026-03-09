from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgentChat PoC"
    # Provide a default SQLite alternative if needed, or stick to PostgreSQL
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/agentchat.db"
    SECRET_KEY: str = "super_secret_key" # In production, this should be secure
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
