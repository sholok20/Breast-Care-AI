from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from app.database import Base


class MammogramImage(Base):
    __tablename__ = "mammogram_images"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exam.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(String(500), nullable=False)
    upload_date = Column(TIMESTAMP, nullable=False)
    file_size = Column(Integer)
    image_type = Column(String(100))
    view_position = Column(String(100))
    