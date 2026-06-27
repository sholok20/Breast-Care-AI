from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey, String
from sqlalchemy.sql import func
from app.database import Base


class Visit(Base):
    __tablename__ = "visit"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.id", ondelete="CASCADE"), nullable=False)
    visit_date = Column(DateTime, server_default=func.now())
    doctor_name = Column(String(150))
    notes = Column(Text)