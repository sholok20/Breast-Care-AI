from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MammogramImageResponse(BaseModel):
    id: int
    exam_id: int
    image_path: str
    upload_date: datetime
    file_size: Optional[int]
    image_type: Optional[str]
    view_position: Optional[str]

    class Config:
        from_attributes = True