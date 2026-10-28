import os
import json
import numpy as np
import tensorflow as tf

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# --------------------------------------------------
# Configuration
# --------------------------------------------------

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

DATASET_DIR = os.path.join(BASE_DIR, "backend", "dataset")
VAL_DIR = os.path.join(DATASET_DIR, "val")

MODEL_PATH = os.path.join(
    BASE_DIR,
    "backend",
    "ml",
    "models",
    "plant_disease_mobilenetv2.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "backend",
    "ml",
    "models",
    "class_names.json"
)


IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32


# --------------------------------------------------
# Check required files
# --------------------------------------------------

if not os.path.exists(MODEL_PATH):
    print("ERROR: Trained MobileNetV2 model not found.")
    print(MODEL_PATH)
    print("\nTrain the model first using:")
    print("python backend/ml/train_mobilenet.py")
    exit()

if not os.path.exists(VAL_DIR):
    print("ERROR: Validation dataset not found.")
    print(VAL_DIR)
    exit()


# --------------------------------------------------
# Load model
# --------------------------------------------------

print("\nLoading MobileNetV2 model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")


# --------------------------------------------------
# Validation data
# --------------------------------------------------

datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

validation_generator = datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)


# --------------------------------------------------
# Class names
# --------------------------------------------------

class_indices = validation_generator.class_indices

class_names = [
    name for name, index in sorted(
        class_indices.items(),
        key=lambda x: x[1]
    )
]

print("\nNumber of classes:", len(class_names))

print("\nClasses:")
for i, name in enumerate(class_names):
    print(i, ":", name)


# --------------------------------------------------
# Predictions
# --------------------------------------------------

print("\nRunning model evaluation...")

predictions = model.predict(
    validation_generator,
    verbose=1
)

y_pred = np.argmax(predictions, axis=1)
y_true = validation_generator.classes


# --------------------------------------------------
# Metrics
# --------------------------------------------------

accuracy = accuracy_score(y_true, y_pred)

precision = precision_score(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0
)

recall = recall_score(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0
)

f1 = f1_score(
    y_true,
    y_pred,
    average="weighted",
    zero_division=0
)


# --------------------------------------------------
# Display final results
# --------------------------------------------------

print("\n")
print("=" * 60)
print("AGRISENSE AI - MODEL PERFORMANCE")
print("=" * 60)

print(f"Accuracy  : {accuracy * 100:.2f}%")
print(f"Precision : {precision * 100:.2f}%")
print(f"Recall    : {recall * 100:.2f}%")
print(f"F1-Score  : {f1 * 100:.2f}%")

print("=" * 60)


# --------------------------------------------------
# Classification report
# --------------------------------------------------

print("\nClassification Report:")
print(
    classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        zero_division=0
    )
)


# --------------------------------------------------
# Confusion matrix
# --------------------------------------------------

cm = confusion_matrix(y_true, y_pred)

print("\nConfusion Matrix:")
print(cm)


# --------------------------------------------------
# Save results
# --------------------------------------------------

results = {
    "model": "MobileNetV2",
    "dataset": "Validation Dataset",
    "number_of_classes": len(class_names),
    "accuracy": round(accuracy * 100, 2),
    "precision": round(precision * 100, 2),
    "recall": round(recall * 100, 2),
    "f1_score": round(f1 * 100, 2)
}

results_path = os.path.join(
    BASE_DIR,
    "backend",
    "ml",
    "models",
    "evaluation_results.json"
)

with open(results_path, "w") as f:
    json.dump(results, f, indent=4)


# Save confusion matrix

cm_path = os.path.join(
    BASE_DIR,
    "backend",
    "ml",
    "models",
    "confusion_matrix.npy"
)

np.save(cm_path, cm)


print("\nResults saved to:")
print(results_path)

print("\nConfusion matrix saved to:")
print(cm_path)

print("\nEvaluation completed successfully.")
