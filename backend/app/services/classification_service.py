from pathlib import Path

import cv2
import numpy as np
from keras.models import load_model


BASE_DIR = Path(__file__).resolve().parent.parent
CLASSIFIER_PATH = BASE_DIR / "ai_models" / "breast_classifier.keras"

IMG_SIZE = (224, 224)
CLASS_NAMES = ["benign", "malignant", "normal"]

classifier_model = load_model(str(CLASSIFIER_PATH))


def preprocess_image(image_path: str, box: dict | None = None):
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Image could not be read by OpenCV")

    if box is not None:
        x1 = max(int(box["x1"]), 0)
        y1 = max(int(box["y1"]), 0)
        x2 = max(int(box["x2"]), 0)
        y2 = max(int(box["y2"]), 0)

        cropped = image[y1:y2, x1:x2]

        if cropped.size != 0:
            image = cropped

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, IMG_SIZE)

    image = image.astype("float32")

    image = np.expand_dims(image, axis=0)

    return image


def classify_breast_image(image_path: str, box: dict | None = None):
    try:
        processed_image = preprocess_image(image_path, box)

        predictions = classifier_model.predict(
            processed_image,
            verbose=0
        )[0]

        predictions = np.array(predictions, dtype=float)

        if predictions.sum() > 1.5 or predictions.sum() <= 0:
            exp_values = np.exp(predictions - np.max(predictions))
            probabilities = exp_values / exp_values.sum()
        else:
            probabilities = predictions / predictions.sum()

        class_probabilities = {
            CLASS_NAMES[i]: round(float(probabilities[i]) * 100, 2)
            for i in range(len(CLASS_NAMES))
        }

        best_index = int(np.argmax(probabilities))
        best_label = CLASS_NAMES[best_index]
        best_probability = round(float(probabilities[best_index]) * 100, 2)

        return {
            "label": best_label,
            "probability": best_probability,
            "class_probabilities": class_probabilities,
        }

    except Exception as error:
        print("CLASSIFICATION ERROR:", error)

        return {
            "label": "unknown",
            "probability": 0.0,
            "class_probabilities": {
                "benign": 0.0,
                "malignant": 0.0,
                "normal": 0.0,
            },
        }