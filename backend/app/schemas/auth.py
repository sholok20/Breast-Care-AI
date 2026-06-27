from pydantic import BaseModel, EmailStr
from typing import Optional


class PatientRegisterRequest(BaseModel):
    email: EmailStr
    password: str

    name: str
    national_id: str

    date_of_birth: str
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None


class HospitalRegisterRequest(BaseModel):
    email: EmailStr
    password: str

    hospital_name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"