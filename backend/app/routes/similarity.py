from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mammogram_embedding import MammogramEmbedding
from app.models.mammogram_image import MammogramImage
from app.services.embedding_service import generate_embedding
from app.services.similarity_service import cosine_similarity

router = APIRouter()


def build_image_url(image_path: str):
    fixed_path = image_path.replace("\\", "/")
    filename = Path(fixed_path).name

    if "similarity_dataset_busi" in fixed_path:
        return f"http://127.0.0.1:8000/uploaded-files/similarity_dataset_busi/{filename}"

    if "similarity_dataset" in fixed_path:
        return f"http://127.0.0.1:8000/uploaded-files/similarity_dataset/{filename}"

    if "annotated" in fixed_path:
        return f"http://127.0.0.1:8000/uploaded-files/annotated/{filename}"

    return f"http://127.0.0.1:8000/uploaded-files/{filename}"


@router.get("/similar/{image_id}")
def find_similar_mammograms(
    image_id: int,
    limit: int = 5,
    db: Session = Depends(get_db),
):
    query_image = (
        db.query(MammogramImage)
        .filter(MammogramImage.id == image_id)
        .first()
    )

    if not query_image:
        raise HTTPException(status_code=404, detail="Image not found")

    query_embedding_record = (
        db.query(MammogramEmbedding)
        .filter(MammogramEmbedding.image_id == image_id)
        .first()
    )

    if query_embedding_record:
        query_embedding = query_embedding_record.embedding
    else:
        query_embedding = generate_embedding(query_image.image_path)

        new_embedding = MammogramEmbedding(
            image_id=image_id,
            embedding=query_embedding,
        )

        db.add(new_embedding)
        db.commit()

    all_embeddings = (
        db.query(MammogramEmbedding)
        .filter(MammogramEmbedding.image_id != image_id)
        .all()
    )

    results = []

    for item in all_embeddings:
        score = cosine_similarity(query_embedding, item.embedding)

        if score is None:
            continue

        image = (
            db.query(MammogramImage)
            .filter(MammogramImage.id == item.image_id)
            .first()
        )

        if not image:
            continue

        results.append(
            {
                "image_id": item.image_id,
                "exam_id": image.exam_id,
                "image_path": image.image_path,
                "image_url": build_image_url(image.image_path),
                "similarity_score": round(score, 4),
            }
        )

    results.sort(key=lambda x: x["similarity_score"], reverse=True)

    return {
        "query_image_id": image_id,
        "top_matches": results[:limit],
    }