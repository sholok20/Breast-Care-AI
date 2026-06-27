from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.exam import Exam

router = APIRouter()


@router.get("/")
def get_exams(db: Session = Depends(get_db)):
    return db.query(Exam).all()


@router.get("/{exam_id}")
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()

    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    return exam


@router.post("/")
def create_exam(
    patient_id: int,
    radiologist_id: int,
    exam_type: str = "Mammography",
    status: str = "pending",
    notes: str | None = None,
    db: Session = Depends(get_db)
):
    exam = Exam(
        patient_id=patient_id,
        radiologist_id=radiologist_id,
        exam_date=datetime.now(),
        exam_type=exam_type,
        status=status,
        notes=notes
    )

    db.add(exam)
    db.commit()
    db.refresh(exam)

    return exam