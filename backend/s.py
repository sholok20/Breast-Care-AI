from keras.models import load_model

model = load_model("app/ai_models/breast_classifier.keras")

print(model.summary())