from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, DateTime
from app.database import Base


class Patient(Base):
    __tablename__ = "patient"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(20))
    contact_number = Column(String(50))
    email = Column(String(255))
    address = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), unique=True)
    national_id = Column(String(14), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.now)