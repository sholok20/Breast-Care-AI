from PIL import Image
import torch
from torchvision import models, transforms


device = torch.device("cpu")

weights = models.ResNet18_Weights.DEFAULT
resnet = models.resnet18(weights=weights)

# Remove final classification layer
resnet = torch.nn.Sequential(*list(resnet.children())[:-1])

resnet.eval()
resnet.to(device)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def generate_embedding(image_path: str):
    image = Image.open(image_path).convert("L")

    tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        features = resnet(tensor)

    embedding = features.squeeze().cpu().numpy()

    return embedding.tolist()