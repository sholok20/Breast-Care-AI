from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, text
from sqlalchemy.dialects.postgresql import ARRAY, DOUBLE_PRECISION
from app.database import Base


class MammogramEmbedding(Base):
    __tablename__ = "mammogram_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(
        Integer,
        ForeignKey("mammogram_images.id", ondelete="CASCADE"),
        nullable=False
    )
    embedding = Column(ARRAY(DOUBLE_PRECISION), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))