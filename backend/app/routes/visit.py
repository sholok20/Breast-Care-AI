from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.visit import Visit
from app.schemas.visit import VisitCreate

router = APIRouter()
@router.post("/")
def create_visit(data: VisitCreate, db: Session = Depends(get_db)):
    visit = Visit(
        patient_id=data.patient_id,
        doctor_name=data.doctor_name,
        notes=data.notes
    )

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit


@router.get("/patient/{patient_id}")
def get_patient_visits(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Visit).filter(Visit.patient_id == patient_id).all()