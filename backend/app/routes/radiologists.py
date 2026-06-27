from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.radiologist import Radiologist

router = APIRouter()


@router.get("/")
def get_radiologists(db: Session = Depends(get_db)):
    return db.query(Radiologist).all()


@router.get("/{radiologist_id}")
def get_radiologist(radiologist_id: int, db: Session = Depends(get_db)):
    radiologist = db.query(Radiologist).filter(Radiologist.id == radiologist_id).first()

    if not radiologist:
        raise HTTPException(status_code=404, detail="Radiologist not found")

    return radiologist


@router.post("/")
def create_radiologist(
    name: str,
    license_number: str,
    hospital_id: int,
    specialization: str | None = None,
    phone: str | None = None,
    user_id: int | None = None,
    db: Session = Depends(get_db)
):
    radiologist = Radiologist(
        name=name,
        specialization=specialization,
        license_number=license_number,
        hospital_id=hospital_id,
        phone=phone,
        user_id=user_id
    )

    db.add(radiologist)
    db.commit()
    db.refresh(radiologist)

    return radiologist