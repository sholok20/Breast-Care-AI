# 🩺 BreastCare AI

### Intelligent Breast Cancer Detection, Classification, and Similarity Retrieval System

BreastCare AI is an AI-powered web-based platform designed to assist healthcare professionals in analyzing breast medical images. The system combines **deep learning, object detection, image classification, similarity retrieval, and a centralized medical database** into an integrated platform.

The system analyzes uploaded breast images, detects suspicious regions, classifies the case, displays confidence and class probabilities, retrieves visually similar historical cases, and generates a structured medical analysis report.

> **Important:** BreastCare AI is designed as a clinical decision-support and research system. It does not replace qualified medical professionals or provide autonomous medical diagnosis.

---

## 📌 Project Overview

Breast cancer diagnosis and screening can require the analysis of a large number of medical images. BreastCare AI aims to support this workflow by providing an integrated platform for:

* Breast image upload and management
* AI-based abnormality detection
* Breast lesion classification
* Classification probability visualization
* Detection confidence visualization
* Annotated image generation
* Similarity search against historical cases
* Top-5 visually similar cases
* Medical report generation
* Patient and examination management
* Doctor/radiologist review
* Role-based access control
* Administrative monitoring and audit logging

The system combines multiple AI components rather than relying on a single model.

---

# 🎯 Objectives

The main objectives of BreastCare AI are to:

1. Detect suspicious regions in breast medical images.
2. Classify detected cases into:

   * Normal
   * Benign
   * Malignant
3. Provide confidence and probability information to support interpretation.
4. Retrieve visually similar historical cases using deep image embeddings.
5. Provide healthcare professionals with an organized analysis workflow.
6. Maintain patient, examination, and AI-report information in a centralized database.
7. Generate structured medical reports.
8. Provide secure role-based access to system functionality.
9. Maintain audit information for important system activities.
10. Provide a foundation that can be extended toward future clinical integration.

---

# 🏗️ System Architecture

BreastCare AI follows a full-stack architecture consisting of:

```text
┌──────────────────────────────────────────────┐
│                 Frontend                     │
│        React + TypeScript + Vite             │
└──────────────────────┬───────────────────────┘
                       │ HTTP / REST API
                       ▼
┌──────────────────────────────────────────────┐
│                  Backend                     │
│             FastAPI + Python                 │
└───────────────┬──────────────┬───────────────┘
                │              │
                ▼              ▼
       ┌──────────────┐   ┌─────────────────┐
       │ PostgreSQL   │   │   AI Pipeline   │
       │   Database   │   │                 │
       └──────────────┘   │ YOLOv8          │
                          │ Classification   │
                          │ ResNet18         │
                          └─────────────────┘
```

### Main workflow

```text
Medical Image
     │
     ▼
Upload
     │
     ▼
FastAPI Backend
     │
     ├──────────────► PostgreSQL
     │
     ▼
AI Pipeline
     │
     ├──► YOLOv8 Detection
     │
     ├──► Breast Classification
     │
     └──► ResNet18 Embedding
              │
              ▼
       Similarity Search
              │
              ▼
       Top-5 Similar Cases
              │
              ▼
       AI Analysis Report
              │
              ▼
       Doctor Review
```

---

# 🤖 AI Components

## 1. YOLOv8 Detection

YOLOv8 is used to locate suspicious regions within the input image.

The detector provides:

* Bounding boxes
* Detection confidence
* Detected regions
* Annotated images

The detection confidence represents the model's confidence that a detected object/region corresponds to a relevant detection.

---

## 2. Breast Image Classification

A separate deep-learning classifier is used to classify the case into three classes:

```text
Normal
Benign
Malignant
```

The classifier produces a probability distribution across the three classes.

Example:

```text
Normal      5.2%
Benign     12.7%
Malignant  82.1%
```

The class with the highest probability is selected as the model's predicted class.

### Important distinction

BreastCare AI separates:

**Detection Confidence**

from

**Classification Probability**

Detection confidence answers:

> How confident is the detection model that this region is a relevant detected object?

Classification probability answers:

> How probable does the classifier consider each diagnostic class?

---

# 🔎 Similarity Retrieval

BreastCare AI includes a content-based image retrieval component.

A **ResNet18** model is used to generate a numerical representation, or embedding, of the analyzed image.

The embedding can then be compared with embeddings of historical cases.

```text
Input Image
     │
     ▼
ResNet18
     │
     ▼
Feature Embedding
     │
     ▼
Similarity Search
     │
     ▼
Top-5 Similar Cases
```

The retrieved cases can provide additional contextual information for the healthcare professional.

Similarity retrieval is intended as a supporting feature and does not establish diagnostic equivalence between cases.

---

# 🗄️ Database

The backend uses **PostgreSQL** as the primary relational database.

The database manages information such as:

* Users
* Patients
* Medical examinations
* Uploaded images
* AI reports
* Detection results
* Classification results
* Similarity results
* Doctor reviews
* System activities
* Audit information

A relational database provides structured relationships between patients, examinations, reports, users, and AI results.

---

# 🔐 Authentication and Authorization

BreastCare AI provides role-based access control.

### Patient

Patients can access functionality related to their own medical information and reports.

### Hospital / Radiologist

Healthcare professionals can:

* Manage examinations
* Upload medical images
* Run AI analysis
* Review AI results
* Examine similar cases
* Review generated reports

### Administrator

Administrators can manage and monitor the system, including:

* Users
* System activity
* Audit logs
* Administrative information

Access to protected functionality is controlled according to the user's role.

---

# 📊 AI Analysis Results

After processing an image, the system can provide:

### Detection

* Detected regions
* Bounding boxes
* Detection confidence
* Annotated image

### Classification

* Final predicted class
* Normal probability
* Benign probability
* Malignant probability

### Similarity

* Top-5 similar historical cases
* Similarity information

### Performance

* AI inference time

---

# 📄 Medical Reports

The system provides a structured report containing relevant analysis information.

A report can include:

* Patient information
* Examination information
* Uploaded image
* AI prediction
* Classification probabilities
* Detection confidence
* Annotated image
* Similarity results
* Doctor review information

The generated AI analysis is intended to support professional review.

---

# 🖥️ Frontend

The frontend is implemented using:

* React
* TypeScript
* Vite
* CSS / utility-based styling

The frontend provides interfaces for:

* Authentication
* Patient management
* Hospital/radiologist dashboard
* Patient dashboard
* Image upload
* AI analysis
* Similarity results
* Medical reports
* Administration

---

# ⚙️ Backend

The backend is implemented using:

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL

FastAPI provides REST API endpoints connecting the frontend with the database and AI pipeline.

The backend is responsible for:

```text
Authentication
      ↓
Authorization
      ↓
Patient Management
      ↓
Examination Management
      ↓
Image Upload
      ↓
AI Processing
      ↓
Database Storage
      ↓
Similarity Retrieval
      ↓
Report Generation
```

---

# 📁 Project Structure

A simplified structure is:

```text
BreastCare-AI/
│
├── backend/
│   ├── app/
│   │   ├── ai_models/
│   │   │   └── best.pt
│   │   │
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── models/
│   └── classification/
│
├── uploads/
│
├── README.md
└── ...
```

> The exact directory structure may differ depending on the current implementation.

---

# 🛠️ Technologies

| Component            | Technology            |
| -------------------- | --------------------- |
| Frontend             | React                 |
| Frontend Language    | TypeScript            |
| Frontend Build Tool  | Vite                  |
| Backend              | FastAPI               |
| Backend Language     | Python                |
| ORM                  | SQLAlchemy            |
| Database             | PostgreSQL            |
| Object Detection     | YOLOv8                |
| Image Classification | TensorFlow / Keras    |
| Feature Extraction   | ResNet18              |
| Similarity Retrieval | Deep Image Embeddings |
| API                  | REST                  |
| Version Control      | Git / GitHub          |

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/BreastCare-AI.git
cd BreastCare-AI
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

---

# 🗄️ PostgreSQL Configuration

Create a PostgreSQL database.

Example:

```text
Database: graduation_project
```

Configure the database connection in your environment variables.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/graduation_project
```

Do not commit real passwords or secrets to GitHub.

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/graduation_project

SECRET_KEY=your-secret-key

UPLOAD_DIR=uploaded-files
```

Add `.env` to `.gitignore`:

```gitignore
.env
.venv/
__pycache__/
node_modules/
uploaded-files/
```

---

# ▶️ Run the Backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

The complete application workflow is:

```text
1. User Login
       ↓
2. Select Patient
       ↓
3. Create Examination
       ↓
4. Upload Breast Image
       ↓
5. AI Processing
       ↓
6. YOLOv8 Detection
       ↓
7. Image Classification
       ↓
8. Generate Classification Probabilities
       ↓
9. Generate ResNet18 Embedding
       ↓
10. Similarity Search
       ↓
11. Retrieve Top-5 Similar Cases
       ↓
12. Display AI Results
       ↓
13. Doctor Review
       ↓
14. Generate Medical Report
```

---

# 📈 Evaluation

The AI components can be evaluated using appropriate metrics.

### Classification

* Accuracy
* Precision
* Recall
* F1-score
* ROC-AUC
* Confusion Matrix

### Object Detection

* mAP@50
* mAP@50–95
* Precision
* Recall

### Similarity Retrieval

Similarity retrieval can be evaluated using retrieval-oriented measures and qualitative examination of retrieved cases.

---

# 🧪 Testing

The system can be tested at multiple levels:

### Unit Testing

Testing individual backend services and components.

### Integration Testing

Testing communication between:

```text
Frontend
   ↕
FastAPI
   ↕
PostgreSQL
   ↕
AI Pipeline
```

### System Testing

Testing the complete workflow from login to report generation.

### Security Testing

Testing:

* Authentication
* Authorization
* Role restrictions
* Protected endpoints
* Input validation
* Database access

### Performance Testing

Testing:

* API response time
* Image upload time
* AI inference time
* Database queries
* Similarity retrieval time

---

# 🔒 Security and Privacy

Because the platform handles medical information, security and privacy are important design considerations.

The system incorporates mechanisms such as:

* Authentication
* Role-based access control
* Protected API endpoints
* Database access control
* Audit logging
* Controlled file access
* Environment-based secret management

Real clinical deployment would require additional organizational, legal, security, privacy, and regulatory controls.

---

