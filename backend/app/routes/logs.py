from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.log import Log

router = APIRouter()


@router.get("/")
def get_logs(db: Session = Depends(get_db)):
    return db.query(Log).all()


@router.post("/")
def create_log(
    user_id: int | None = None,
    action: str = "UNKNOWN_ACTION",
    details: str | None = None,
    ip_address: str | None = None,
    db: Session = Depends(get_db)
):
    log = Log(
        user_id=user_id,
        action=action,
        timestamp=datetime.now(),
        details=details,
        ip_address=ip_address
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log