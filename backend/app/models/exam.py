from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.database import Base


class Exam(Base):
    __tablename__ = "exam"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.id", ondelete="CASCADE"), nullable=False)
    radiologist_id = Column(Integer, ForeignKey("radiologist.id", ondelete="CASCADE"), nullable=False)
    exam_date = Column(TIMESTAMP, nullable=False)
    exam_type = Column(String(100), nullable=False)
    status = Column(String(100), nullable=False)
    notes = Column(Text)