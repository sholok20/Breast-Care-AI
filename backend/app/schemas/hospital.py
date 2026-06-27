from pydantic import BaseModel
from typing import Optional


class HospitalCreate(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class HospitalResponse(HospitalCreate):
    id: int

    class Config:
        from_attributes = True