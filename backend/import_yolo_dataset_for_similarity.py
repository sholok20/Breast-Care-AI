import os
import shutil
from pathlib import Path
from datetime import datetime, date

from app.database import SessionLocal

from app.models.user import User
from app.models.hospital import Hospital
from app.models.patient import Patient
from app.models.radiologist import Radiologist
from app.models.exam import Exam
from app.models.mammogram_image import MammogramImage
from app.models.mammogram_embedding import MammogramEmbedding

from app.services.embedding_service import generate_embedding


DATASET_DIR = Path(r"F:\graduation project\datasets\Breast cancer Yolov8")
OUTPUT_DIR = Path(r"F:\graduation project\backend\uploads\similarity_dataset_yolo")

IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]


def get_or_create_dataset_patient(db):
    patient = (
        db.query(Patient)
        .filter(Patient.national_id == "99999999999999")
        .first()
    )

    if patient:
        return patient

    patient = Patient(
        national_id="99999999999999",
        name="YOLO DATASET PATIENT",
        date_of_birth=date(2000, 1, 1),
        gender="Unknown",
        contact_number="0000000000",
        email="yolo_dataset_patient@test.com",
        address="Dataset Import"
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


def get_or_create_dataset_radiologist(db):
    radiologist = (
        db.query(Radiologist)
        .filter(Radiologist.email == "yolo_dataset_radiologist@test.com")
        .first()
    )

    if radiologist:
        return radiologist

    radiologist = Radiologist(
        name="YOLO DATASET RADIOLOGIST",
        email="yolo_dataset_radiologist@test.com",
        specialization="Dataset Import"
    )

    db.add(radiologist)
    db.commit()
    db.refresh(radiologist)

    return radiologist


def find_images():
    all_images = []

    for split in ["train", "valid", "test"]:
        image_dir = DATASET_DIR / split / "images"

        if not image_dir.exists():
            print(f"Missing folder: {image_dir}")
            continue

        for image_path in image_dir.rglob("*"):
            if image_path.suffix.lower() in IMAGE_EXTENSIONS:
                all_images.append((split, image_path))

    return all_images


def import_dataset():
    db = SessionLocal()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    dataset_patient = get_or_create_dataset_patient(db)
    dataset_radiologist = get_or_create_dataset_radiologist(db)

    images = find_images()

    print(f"Found {len(images)} images")

    imported = 0

    for split, image_path in images:
        try:
            new_name = f"yolo_{split}_{image_path.name}"
            destination = OUTPUT_DIR / new_name

            if destination.exists():
                print(f"Skipped existing file: {new_name}")
                continue

            shutil.copy2(image_path, destination)

            exam = Exam(
                patient_id=dataset_patient.id,
                radiologist_id=dataset_radiologist.id,
                exam_date=datetime.now(),
                exam_type="Mammogram",
                status="dataset_imported",
                notes=f"Imported from YOLOv8 dataset split: {split}"
            )

            db.add(exam)
            db.commit()
            db.refresh(exam)

            mammogram_image = MammogramImage(
                exam_id=exam.id,
                image_path=str(destination),
                upload_date=datetime.now(),
                file_size=os.path.getsize(destination),
                image_type=image_path.suffix.replace(".", "").upper(),
                view_position="UNKNOWN"
            )

            db.add(mammogram_image)
            db.commit()
            db.refresh(mammogram_image)

            embedding = generate_embedding(str(destination))

            mammogram_embedding = MammogramEmbedding(
                image_id=mammogram_image.id,
                embedding=embedding
            )

            db.add(mammogram_embedding)
            db.commit()

            imported += 1
            print(f"Imported {imported}: {new_name}")

        except Exception as e:
            db.rollback()
            print(f"Failed: {image_path}")
            print(e)

    db.close()

    print("Done.")
    print(f"Total imported: {imported}")


if __name__ == "__main__":
    import_dataset()