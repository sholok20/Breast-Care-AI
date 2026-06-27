from pydantic import BaseModel


class Settings(BaseModel):
    DATABASE_URL: str = "postgresql://postgres:12345@localhost:5432/graduation_project"
    SECRET_KEY: str = "super_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


settings = Settings()