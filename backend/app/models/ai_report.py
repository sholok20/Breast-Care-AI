from sqlalchemy import Column, Float, Integer, Text, TIMESTAMP, DECIMAL, Boolean, ForeignKey, String , Float 
from app.database import Base


class AIReport(Base):
    __tablename__ = "ai_report"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exam.id", ondelete="CASCADE"), nullable=False)
    report_date = Column(TIMESTAMP, nullable=False)
    findings = Column(Text)
    confidence_score = Column(DECIMAL(5, 2))
    anomaly_detected = Column(Boolean, nullable=False)

    doctor_report = Column(Text)
    doctor_name = Column(String(150))
    final_diagnosis = Column(String(255))
    recommendation = Column(Text)
    reviewed_at = Column(TIMESTAMP)
    inference_time_ms = Column(Float)