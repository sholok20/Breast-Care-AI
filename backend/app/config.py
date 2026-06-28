import os
from pydantic import BaseModel


class Settings(BaseModel):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:12345@localhost:5432/graduation_project"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )


settings = Settings()