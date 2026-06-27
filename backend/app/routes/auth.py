from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.hospital import Hospital

from app.schemas.auth import (
    PatientRegisterRequest,
    HospitalRegisterRequest,
    LoginRequest,
    TokenResponse,
)

from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter()


def make_token(user: User):
    return create_access_token(
        {
            "sub": user.email,
            "role": user.role,
            "user_id": user.id,
        }
    )


@router.post("/register/patient", response_model=TokenResponse)
def register_patient(
    payload: PatientRegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == payload.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    existing_patient = (
        db.query(Patient)
        .filter(Patient.national_id == payload.national_id)
        .first()
    )

    if existing_patient:
        raise HTTPException(
            status_code=400,
            detail="National ID already exists",
        )

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="patient",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    patient = Patient(
        name=payload.name,
        national_id=payload.national_id,
        date_of_birth=date.fromisoformat(payload.date_of_birth),
        gender=payload.gender,
        contact_number=payload.contact_number,
        email=payload.email,
        address=payload.address,
        user_id=user.id,
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    token = make_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.post("/register/hospital", response_model=TokenResponse)
def register_hospital(
    payload: HospitalRegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == payload.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    existing_hospital = (
        db.query(Hospital)
        .filter(Hospital.email == payload.email)
        .first()
    )

    if existing_hospital:
        raise HTTPException(
            status_code=400,
            detail="Hospital email already exists",
        )

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="hospital",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    hospital = Hospital(
        name=payload.hospital_name,
        address=payload.address,
        phone=payload.phone,
        email=payload.email,
    )

    db.add(hospital)
    db.commit()
    db.refresh(hospital)

    token = make_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role not in ["patient", "hospital", "admin"]:
        raise HTTPException(status_code=403, detail="Invalid user role")

    token = make_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
    }