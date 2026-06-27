import os
import shutil
from datetime import datetime

from app.database import SessionLocal

# IMPORTANT: load all models so foreign keys are recognized
from app.models.patient import Patient
from app.models.radiologist import Radiologist
from app.models.exam import Exam
from app.models.mammogram_image import MammogramImage
from app.models.mammogram_embedding import MammogramEmbedding

from app.services.embedding_service import generate_embedding

SOURCE_DIR = r"F:\graduation project\datasets\selected_dataset"
BACKEND_UPLOADS_DIR = r"F:\graduation project\backend\uploads\similarity_dataset"

os.makedirs(BACKEND_UPLOADS_DIR, exist_ok=True)


def import_dataset():
    db = SessionLocal()

    imported = 0

    for label in ["malignant", "benign", "normal"]:
        label_folder = os.path.join(SOURCE_DIR, label)

        for filename in os.listdir(label_folder):
            if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
                continue

            src_path = os.path.join(label_folder, filename)

            new_filename = f"{label}_{filename}"
            dst_path = os.path.join(BACKEND_UPLOADS_DIR, new_filename)

            shutil.copy2(src_path, dst_path)

            # Create exam record
            exam = Exam(
                patient_id=1,
                radiologist_id=1,
                exam_date=datetime.now(),
                exam_type="Mammography",
                status="dataset_imported"
            )

            db.add(exam)
            db.commit()
            db.refresh(exam)

            # Save image record
            image = MammogramImage(
                exam_id=exam.id,
                image_path=dst_path,
                upload_date=datetime.now(),
                file_size=os.path.getsize(dst_path),
                image_type="JPG",
                view_position="UNKNOWN"
            )

            db.add(image)
            db.commit()
            db.refresh(image)

            # Generate real ResNet embedding
            embedding = generate_embedding(dst_path)

            image_embedding = MammogramEmbedding(
                image_id=image.id,
                embedding=embedding
            )

            db.add(image_embedding)
            db.commit()

            imported += 1
            print(f"Imported {imported}: {label} - {filename}")

    db.close()

    print("Done.")
    print("Total imported:", imported)


if __name__ == "__main__":
    import_dataset()