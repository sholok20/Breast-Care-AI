from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

# Import models so SQLAlchemy knows all tables and foreign keys
from app.models.user import User
from app.models.hospital import Hospital
from app.models.patient import Patient
from app.models.radiologist import Radiologist
from app.models.exam import Exam
from app.models.mammogram_image import MammogramImage
from app.models.ai_report import AIReport
from app.models.mammogram_embedding import MammogramEmbedding
from app.models.visit import Visit
from app.models.procedure import Procedure

# Import routers
from app.routes.auth import router as auth_router
from app.routes.admin import router as admin_router
from app.routes.users import router as users_router
from app.routes.hospitals import router as hospitals_router
from app.routes.patients import router as patients_router
from app.routes.radiologists import router as radiologists_router
from app.routes.exams import router as exams_router
from app.routes.ai_reports import router as ai_reports_router
from app.routes.logs import router as logs_router
from app.routes.uploads import router as uploads_router
from app.routes.similarity import router as similarity_router
from app.routes.visit import router as visits_router
from app.routes.procedure import router as procedures_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mammography AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(hospitals_router, prefix="/hospitals", tags=["Hospitals"])
app.include_router(patients_router, prefix="/patients", tags=["Patients"])
app.include_router(radiologists_router, prefix="/radiologists", tags=["Radiologists"])
app.include_router(exams_router, prefix="/exams", tags=["Exams"])
app.include_router(ai_reports_router, prefix="/ai-reports", tags=["AI Reports"])
app.include_router(logs_router, prefix="/logs", tags=["Logs"])
app.include_router(uploads_router, prefix="/uploads", tags=["Uploads"])
app.include_router(similarity_router, prefix="/similarity", tags=["Similarity Search"])
app.include_router(visits_router, prefix="/visits", tags=["Visits"])
app.include_router(procedures_router, prefix="/procedures", tags=["Procedures"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

# Static files must not use /uploads because /uploads is an API route
app.mount(
    "/uploaded-files",
    StaticFiles(directory="uploads"),
    name="uploaded-files"
)


@app.get("/")
def root():
    return {"message": "Backend is running"}