from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExamCreate(BaseModel):
    patient_id: int
    radiologist_id: int
    exam_date: datetime
    exam_type: str
    status: str
    notes: Optional[str] = None


class ExamResponse(ExamCreate):
    id: int

    class Config:
        from_attributes = True