from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    HF_MODEL: str = "deepseek-ai/deepseek-coder-6.7b-instruct-awq"
    HF_TOKEN: Optional[str] = None
    DEVICE: str = "cuda"
    QUANTIZATION: str = "4bit"
    MAX_LENGTH: int = 2048
    TEMPERATURE: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
