from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.hospital import Hospital

router = APIRouter()


@router.get("/")
def get_hospitals(db: Session = Depends(get_db)):
    return db.query(Hospital).all()


@router.get("/{hospital_id}")
def get_hospital(hospital_id: int, db: Session = Depends(get_db)):
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()

    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    return hospital


@router.post("/")
def create_hospital(
    name: str,
    address: str | None = None,
    phone: str | None = None,
    email: str | None = None,
    db: Session = Depends(get_db)
):
    hospital = Hospital(
        name=name,
        address=address,
        phone=phone,
        email=email
    )

    db.add(hospital)
    db.commit()
    db.refresh(hospital)

    return hospital