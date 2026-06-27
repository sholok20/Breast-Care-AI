from ultralytics import YOLO

model = YOLO("app/ai_models/best.pt")

print(model.names)