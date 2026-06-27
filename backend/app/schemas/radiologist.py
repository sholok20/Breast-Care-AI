from pydantic import BaseModel
from typing import Optional


class RadiologistCreate(BaseModel):
    name: str
    specialization: Optional[str] = None
    license_number: str
    hospital_id: int
    phone: Optional[str] = None


class RadiologistResponse(RadiologistCreate):
    id: int

    class Config:
        from_attributes = True