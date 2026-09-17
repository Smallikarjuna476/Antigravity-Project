from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import os
import json
import logging
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Configuration
BATCH_SIZE = 32
TARGET_SIZE = (224, 224)
EPOCHS_FROZEN = 5
EPOCHS_UNFROZEN = 5

def build_model(num_classes):
    print("Loading MobileNetV2 pretrained on ImageNet...")
    # Load base model without classification head
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Add new classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    return model, base_model

def train():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    dataset_dir = os.path.join(base_dir, 'backend', 'dataset')
    train_dir = os.path.join(dataset_dir, 'train')
    val_dir = os.path.join(dataset_dir, 'val')
    models_dir = os.path.join(base_dir, 'backend', 'ml', 'models')
    
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        print("==================================================")
        print("ERROR: DATASET NOT FOUND")
        print("==================================================")
        print("Please download a dataset (e.g., PlantVillage) and place it in:")
        print(f"  {train_dir}")
        print(f"  {val_dir}")
        print("The folder structure should be:")
        print("  dataset/train/Class_Name_1/image1.jpg")
        print("  dataset/train/Class_Name_2/image1.jpg")
        print("Cannot train the MobileNetV2 model without real images.")
        return

    print("Discovered dataset. Preparing augmentations...")
    # 1. Dataset Preprocessing & Augmentation
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    val_datagen = ImageDataGenerator(
         preprocessing_function=preprocess_input
    )
    
    train_gen = train_datagen.flow_from_directory(
        train_dir,
        target_size=TARGET_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    val_gen = val_datagen.flow_from_directory(
        val_dir,
        target_size=TARGET_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )
    
    class_map = {v: k for k, v in train_gen.class_indices.items()}
    class_mapping_path = os.path.join(models_dir, 'class_names.json')
    with open(class_mapping_path, 'w') as f:
        json.dump(class_map, f)
    
    num_classes = len(class_map)
    print(f"Automatically detected {num_classes} classes from the dataset.")
    
    # 2. Build MobileNetV2 model
    model, base_model = build_model(num_classes)
    
    model_save_path = os.path.join(models_dir, 'plant_disease_mobilenetv2.keras')
    checkpoint = ModelCheckpoint(model_save_path, monitor='val_accuracy', save_best_only=True, verbose=1)
    early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
    
    # Stage 1: Train just the dense head
    print("--- STAGE 1: Training Classification Head ---")
    model.compile(optimizer=Adam(learning_rate=1e-3), loss='categorical_crossentropy', metrics=['accuracy'])
    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_FROZEN,
        callbacks=[checkpoint, early_stop]
    )
    
    # Stage 2: Fine-Tuning Top Layers
    print("--- STAGE 2: Fine-tuning MobileNetV2 Top Layers ---")
    base_model.trainable = True
    # Freeze lower layers
    for layer in base_model.layers[:100]:
        layer.trainable = False
        
    model.compile(optimizer=Adam(learning_rate=1e-5), loss='categorical_crossentropy', metrics=['accuracy'])
    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS_UNFROZEN,
        callbacks=[checkpoint, early_stop]
    )
    
    # Final Report
    val_acc = max(history2.history.get('val_accuracy', history1.history.get('val_accuracy')))
    print(f"\n==================================================")
    print(f"TRAINING COMPLETE.")
    print(f"Actual Validation Accuracy: {val_acc*100:.2f}%")
    print(f"Trained Model saved to: {model_save_path}")
    print(f"Class map saved to: {class_mapping_path}")
    print(f"==================================================")

if __name__ == '__main__':
    train()
