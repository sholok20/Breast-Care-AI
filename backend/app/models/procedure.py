from sqlalchemy import Column, Integer, String, Text, ForeignKey

from app.database import Base


class Procedure(Base):
    __tablename__ = "procedure"

    id = Column(Integer, primary_key=True, index=True)

    visit_id = Column(
        Integer,
        ForeignKey("visit.id", ondelete="CASCADE"),
        nullable=False
    )

    procedure_type = Column(String(100), nullable=False)

    description = Column(Text)

    status = Column(String(50), default="completed")