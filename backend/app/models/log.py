from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    action = Column(String(255), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)
    details = Column(Text)
    ip_address = Column(String(100))