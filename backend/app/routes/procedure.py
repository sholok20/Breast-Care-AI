from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.procedure import Procedure
from app.models.visit import Visit
from app.schemas.procedure import ProcedureCreate

router = APIRouter()


@router.post("/")
def create_procedure(data: ProcedureCreate, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == data.visit_id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    procedure = Procedure(
        visit_id=data.visit_id,
        procedure_type=data.procedure_type,
        description=data.description
    )

    db.add(procedure)
    db.commit()
    db.refresh(procedure)

    return procedure


@router.get("/visit/{visit_id}")
def get_visit_procedures(visit_id: int, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    return db.query(Procedure).filter(Procedure.visit_id == visit_id).all()