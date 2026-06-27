import os
from app.services.embedding_service import generate_embedding

folder = r"F:\graduation project\datasets\selected_dataset\malignant"

first_image = os.path.join(
    folder,
    os.listdir(folder)[0]
)

print("Testing:", first_image)

embedding = generate_embedding(first_image)

print("Embedding length:", len(embedding))
print("First 5 values:", embedding[:5])