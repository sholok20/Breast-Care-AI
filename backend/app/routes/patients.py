from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient


router = APIRouter()


class PatientCreate(BaseModel):
    national_id: str
    name: str
    date_of_birth: date
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    user_id: Optional[int] = None


@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()


@router.get("/national/{national_id}")
def get_patient_by_national_id(
    national_id: str,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.national_id == national_id)
        .first()
    )

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


@router.get("/{patient_id}")
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


@router.post("/")
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db)
):
    existing_patient = (
        db.query(Patient)
        .filter(Patient.national_id == data.national_id)
        .first()
    )

    if existing_patient:
        raise HTTPException(
            status_code=400,
            detail="Patient with this National ID already exists"
        )

    patient = Patient(
        national_id=data.national_id,
        name=data.name,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        contact_number=data.contact_number,
        email=data.email,
        address=data.address,
        user_id=data.user_id
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient