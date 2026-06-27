from pydantic import BaseModel
from typing import Optional
from datetime import date


class PatientCreate(BaseModel):
    name: str
    date_of_birth: date
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class PatientResponse(PatientCreate):
    id: int

    class Config:
        from_attributes = True