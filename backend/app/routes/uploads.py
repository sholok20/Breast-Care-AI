from datetime import datetime
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.exam import Exam
from app.models.mammogram_image import MammogramImage
from app.models.ai_report import AIReport
from app.models.mammogram_embedding import MammogramEmbedding

from app.services.upload_service import save_uploaded_file
from app.services.ai_service import run_ai_pipeline
from app.services.embedding_service import generate_embedding

router = APIRouter()


@router.post("/mammogram/{exam_id}")
async def upload_mammogram(
    exam_id: int,
    view_position: str = "CC",
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()

    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    allowed_extensions = ["png", "jpg", "jpeg", "dcm"]

    file_extension = file.filename.split(".")[-1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Allowed: PNG, JPG, JPEG, DCM"
        )

    file_path, file_size, image_type = await save_uploaded_file(file)

    mammogram_image = MammogramImage(
        exam_id=exam_id,
        image_path=file_path,
        upload_date=datetime.now(),
        file_size=file_size,
        image_type=image_type.upper(),
        view_position=view_position
    )

    db.add(mammogram_image)
    db.commit()
    db.refresh(mammogram_image)

    print("UPLOAD ROUTE REACHED")

    ai_result = run_ai_pipeline(file_path)

    print("AI RESULT FROM ROUTE:", ai_result)

    inference_time_ms = ai_result.get("inference_time_ms")

    ai_report = AIReport(
        exam_id=exam_id,
        report_date=datetime.now(),
        findings=ai_result["findings"],
        confidence_score=ai_result["confidence_score"],
        inference_time_ms=inference_time_ms,
        anomaly_detected=ai_result["anomaly_detected"]
    )

    db.add(ai_report)
    db.commit()
    db.refresh(ai_report)

    embedding = generate_embedding(file_path)

    mammogram_embedding = MammogramEmbedding(
        image_id=mammogram_image.id,
        embedding=embedding
    )

    db.add(mammogram_embedding)
    db.commit()
    db.refresh(mammogram_embedding)

    exam.status = "analyzed"
    db.commit()

    detection_details = ai_result["details"]["detection"]

    ai_details = ai_result["details"]
    ai_details["inference_time_ms"] = inference_time_ms

    return {
        "message": "Mammogram uploaded and analyzed successfully",
        "exam_id": exam_id,
        "inference_time_ms": inference_time_ms,
        "image": {
            "image_id": mammogram_image.id,
            "image_path": mammogram_image.image_path,
            "image_type": mammogram_image.image_type,
            "view_position": mammogram_image.view_position
        },
        "ai_report": {
            "report_id": ai_report.id,
            "findings": ai_report.findings,
            "confidence_score": float(ai_report.confidence_score),
            "inference_time_ms": ai_report.inference_time_ms,
            "anomaly_detected": ai_report.anomaly_detected,
            "annotated_image_path": detection_details.get("annotated_image_path"),
            "boxes": detection_details.get("boxes", [])
        },
        "embedding_saved": True,
        "ai_details": ai_details
    }