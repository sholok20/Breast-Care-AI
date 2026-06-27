from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ai_report import AIReport

router = APIRouter()


class DoctorReviewRequest(BaseModel):
    doctor_name: Optional[str] = None
    final_diagnosis: Optional[str] = None
    doctor_report: Optional[str] = None
    recommendation: Optional[str] = None


@router.get("/")
def get_ai_reports(db: Session = Depends(get_db)):
    return db.query(AIReport).all()


@router.get("/{report_id}")
def get_ai_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(AIReport).filter(AIReport.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="AI report not found")

    return report


@router.post("/")
def create_ai_report(
    exam_id: int,
    findings: str | None = None,
    confidence_score: float | None = None,
    anomaly_detected: bool = False,
    db: Session = Depends(get_db),
):
    report = AIReport(
        exam_id=exam_id,
        report_date=datetime.now(),
        findings=findings,
        confidence_score=confidence_score,
        anomaly_detected=anomaly_detected,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


@router.put("/{report_id}/doctor-review")
def save_doctor_review(
    report_id: int,
    payload: DoctorReviewRequest,
    db: Session = Depends(get_db),
):
    report = db.query(AIReport).filter(AIReport.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="AI report not found")

    report.doctor_name = payload.doctor_name
    report.final_diagnosis = payload.final_diagnosis
    report.doctor_report = payload.doctor_report
    report.recommendation = payload.recommendation
    report.reviewed_at = datetime.now()

    db.commit()
    db.refresh(report)

    return report