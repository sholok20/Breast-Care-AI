from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AIReportCreate(BaseModel):
    exam_id: int
    findings: Optional[str] = None
    confidence_score: Optional[float] = None
    anomaly_detected: bool


class AIReportResponse(AIReportCreate):
    id: int
    report_date: datetime

    class Config:
        from_attributes = True