from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Hospital(Base):
    __tablename__ = "hospital"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    phone = Column(String(50))
    email = Column(String(255))