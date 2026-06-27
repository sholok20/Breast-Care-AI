import os
import uuid
from fastapi import UploadFile


UPLOAD_DIR = "uploads/mammograms"


async def save_uploaded_file(file: UploadFile) -> tuple[str, int, str]:
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_extension = file.filename.split(".")[-1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    file_size = len(file_content)

    return file_path, file_size, file_extension