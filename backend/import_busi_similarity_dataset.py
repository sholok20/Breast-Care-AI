import os
import shutil
from pathlib import Path
from datetime import datetime

from app.database import SessionLocal
from app.models.patient import Patient
from app.models.radiologist import Radiologist
from app.models.exam import Exam
from app.models.hospital import Hospital
from app.models.mammogram_image import MammogramImage
from app.models.mammogram_embedding import MammogramEmbedding
from app.services.embedding_service import generate_embedding
from app.models.user import User
from app.models.ai_report import AIReport
from app.models.log import Log


DATASET_DIR = Path(r"F:\graduation project\Dataset_BUSI_with_GT")
UPLOAD_DIR = Path(r"F:\graduation project\backend\uploads\similarity_dataset_busi")

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

db = SessionLocal()


def get_or_create_patient():
    patient = (
        db.query(Patient)
        .filter(Patient.national_id == "99999999999999")
        .first()
    )

    if patient:
        return patient

    patient = Patient(
        name="BUSI DATASET PATIENT",
        national_id="99999999999999",
        date_of_birth="2000-01-01",
        gender="Female",
        contact_number="00000000000",
        email="busi_dataset_patient@test.com",
        address="Dataset Import",
        user_id=None,
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


def get_or_create_radiologist():
    radiologist = (
        db.query(Radiologist)
        .filter(Radiologist.license_number == "BUSI-DATASET-RAD-001")
        .first()
    )

    if radiologist:
        return radiologist

    radiologist = Radiologist(
        name="BUSI DATASET RADIOLOGIST",
        specialization="Breast Ultrasound Dataset Import",
        license_number="BUSI-DATASET-RAD-001",
        hospital_id=1,
        phone="00000000000",
        user_id=None
    )

    db.add(radiologist)
    db.commit()
    db.refresh(radiologist)

    return radiologist


def import_dataset():
    patient = get_or_create_patient()
    radiologist = get_or_create_radiologist()

    total_imported = 0
    skipped = 0

    for class_name in ["benign", "malignant", "normal"]:
        class_dir = DATASET_DIR / class_name

        if not class_dir.exists():
            print(f"Folder not found: {class_dir}")
            continue

        for image_path in class_dir.glob("*.png"):
            if "_mask" in image_path.name.lower():
                skipped += 1
                continue

            new_name = f"busi_{class_name}_{image_path.name}"
            destination = UPLOAD_DIR / new_name

            shutil.copy2(image_path, destination)

            exam = Exam(
                patient_id=patient.id,
                radiologist_id=radiologist.id,
                exam_date=datetime.now(),
                exam_type=f"BUSI Ultrasound - {class_name}",
                status="completed",
                notes=f"Imported from BUSI dataset class: {class_name}",
            )

            db.add(exam)
            db.commit()
            db.refresh(exam)

            mammogram_image = MammogramImage(
                exam_id=exam.id,
                image_path=str(destination),
                upload_date=datetime.now(),
                file_size=destination.stat().st_size,
                image_type="png",
                view_position="US",
            )

            db.add(mammogram_image)
            db.commit()
            db.refresh(mammogram_image)

            embedding = generate_embedding(str(destination))

            mammogram_embedding = MammogramEmbedding(
                image_id=mammogram_image.id,
                embedding=embedding,
            )

            db.add(mammogram_embedding)
            db.commit()

            total_imported += 1
            print(f"Imported {total_imported}: {new_name}")

    print("DONE")
    print("Imported:", total_imported)
    print("Skipped masks:", skipped)


if __name__ == "__main__":
    import_dataset()
    db.close()