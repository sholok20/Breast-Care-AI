from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Radiologist(Base):
    __tablename__ = "radiologist"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    specialization = Column(String(255))
    license_number = Column(String(100), unique=True, nullable=False)
    hospital_id = Column(Integer, ForeignKey("hospital.id", ondelete="CASCADE"), nullable=False)
    phone = Column(String(50))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)