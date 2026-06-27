from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VisitCreate(BaseModel):
    patient_id: int
    doctor_name: Optional[str] = None
    notes: Optional[str] = None


class VisitOut(BaseModel):
    id: int
    patient_id: int
    visit_date: datetime
    doctor_name: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True