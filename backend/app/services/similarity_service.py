import numpy as np


def cosine_similarity(vector_a, vector_b):
    a = np.array(vector_a, dtype=float)
    b = np.array(vector_b, dtype=float)

    # Skip old fake embeddings or corrupted embeddings
    if a.shape != b.shape:
        return None

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return None

    return float(np.dot(a, b) / (norm_a * norm_b))