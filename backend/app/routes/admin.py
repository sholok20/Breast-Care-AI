from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.log import Log
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.models.ai_report import AIReport

router = APIRouter()


@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()


@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    return db.query(Log).order_by(Log.id.desc()).all()


@router.get("/patients")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.id.desc()).all()


@router.get("/hospitals")
def get_hospitals(db: Session = Depends(get_db)):
    return db.query(Hospital).order_by(Hospital.id.desc()).all()


@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(AIReport).order_by(AIReport.id.desc()).all()


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin user")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}