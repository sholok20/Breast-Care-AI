from pathlib import Path
import time

import cv2
from ultralytics import YOLO

from app.services.classification_service import classify_breast_image


BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR.parent

MODEL_PATH = BASE_DIR / "ai_models" / "best.pt"

UPLOADS_DIR = BACKEND_DIR / "uploads"
ANNOTATED_DIR = UPLOADS_DIR / "annotated"
ANNOTATED_DIR.mkdir(parents=True, exist_ok=True)

model = YOLO(str(MODEL_PATH))


def run_ai_pipeline(image_path: str):
    start_time = time.perf_counter()

    results = model.predict(
        source=image_path,
        conf=0.25,
        verbose=False,
    )

    end_time = time.perf_counter()
    inference_time_ms = round((end_time - start_time) * 1000, 2)

    detections = []
    highest_confidence = 0.0
    best_yolo_label = "normal"
    best_box = None

    image = cv2.imread(image_path)

    if image is None:
        return {
            "findings": "Image could not be read by OpenCV",
            "confidence_score": 0.0,
            "inference_time_ms": inference_time_ms,
            "anomaly_detected": False,
            "details": {
                "detection": {
                    "boxes": [],
                    "annotated_image_path": None,
                    "annotated_image_url": None,
                },
                "classification": {
                    "label": "unknown",
                    "final_label": "unknown",
                    "yolo_label": "unknown",
                    "classifier_label": "unknown",
                    "probability": 0.0,
                    "confidence_score": 0.0,
                    "classifier_probability": 0.0,
                    "class_probabilities": {
                        "benign": 0.0,
                        "malignant": 0.0,
                        "normal": 0.0,
                    },
                },
            },
        }

    for result in results:
        names = result.names

        for box in result.boxes:
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            yolo_label = str(names[class_id]).lower()

            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

            current_box = {
                "label": yolo_label,
                "confidence_score": round(confidence * 100, 2),
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
            }

            detections.append(current_box)

            if confidence > highest_confidence:
                highest_confidence = confidence
                best_yolo_label = yolo_label
                best_box = current_box

            if yolo_label == "malignant":
                box_color = (0, 0, 255)
            elif yolo_label == "benign":
                box_color = (0, 255, 255)
            else:
                box_color = (0, 255, 0)

            cv2.rectangle(image, (x1, y1), (x2, y2), box_color, 3)

            label_text = f"{yolo_label} confidence score {confidence * 100:.1f}%"

            cv2.putText(
                image,
                label_text,
                (x1, max(y1 - 10, 25)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                box_color,
                2,
            )

    confidence_score = round(highest_confidence * 100, 2)

    if best_box is not None:
        classifier_result = classify_breast_image(image_path, best_box)
    else:
        classifier_result = classify_breast_image(image_path, None)

    classifier_label = classifier_result.get("label", "unknown")
    classifier_probability = classifier_result.get("probability", 0.0)
    class_probabilities = classifier_result.get(
        "class_probabilities",
        {
            "benign": 0.0,
            "malignant": 0.0,
            "normal": 0.0,
        },
    )

    has_malignant_detection = any(
        detection["label"] == "malignant" for detection in detections
    )

    has_benign_detection = any(
        detection["label"] == "benign" for detection in detections
    )

    if has_malignant_detection:
        best_label = "malignant"
        anomaly_detected = True
        findings = "Malignant tumor detected"

    elif classifier_label == "malignant":
        best_label = "malignant"
        anomaly_detected = True
        findings = "Malignant tumor detected"

    elif has_benign_detection:
        best_label = "benign"
        anomaly_detected = False
        findings = "Benign tumor detected"

    elif classifier_label == "benign":
        best_label = "benign"
        anomaly_detected = False
        findings = "Benign tumor detected"

    elif classifier_label == "normal":
        best_label = "normal"
        anomaly_detected = False
        findings = "No abnormality detected"

    else:
        best_label = "normal"
        anomaly_detected = False
        findings = "No abnormality detected"

    original_name = Path(image_path).name
    annotated_name = f"annotated_{original_name}"
    annotated_file = ANNOTATED_DIR / annotated_name

    cv2.imwrite(str(annotated_file), image)

    annotated_path = f"uploads/annotated/{annotated_name}"
    annotated_url = (
        f"http://127.0.0.1:8000/uploaded-files/annotated/{annotated_name}"
    )

    print("YOLO inference time:", inference_time_ms, "ms")
    print("YOLO best label:", best_yolo_label)
    print("YOLO confidence score:", confidence_score)
    print("Classifier label:", classifier_label)
    print("Classifier probability:", classifier_probability)
    print("Final label:", best_label)
    print("Class probabilities:", class_probabilities)

    return {
        "findings": findings,
        "confidence_score": confidence_score,
        "inference_time_ms": inference_time_ms,
        "anomaly_detected": anomaly_detected,
        "details": {
            "detection": {
                "boxes": detections,
                "annotated_image_path": annotated_path,
                "annotated_image_url": annotated_url,
            },
            "classification": {
                "label": best_label,
                "final_label": best_label,
                "yolo_label": best_yolo_label,
                "classifier_label": classifier_label,
                "confidence_score": confidence_score,
                "classifier_probability": classifier_probability,
                "class_probabilities": class_probabilities,
            },
        },
    }