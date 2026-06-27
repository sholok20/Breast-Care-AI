from pydantic import BaseModel
from typing import Optional


class ProcedureCreate(BaseModel):
    visit_id: int
    procedure_type: str
    description: Optional[str] = None


class ProcedureOut(BaseModel):
    id: int
    visit_id: int
    procedure_type: str
    description: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True