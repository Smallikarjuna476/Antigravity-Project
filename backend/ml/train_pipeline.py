import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2, ResNet50, EfficientNetB0, EfficientNetB3
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Conv2D, MaxPooling2D, Flatten, Input
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support
import seaborn as sns

# Constants
BATCH_SIZE = 32
IMAGE_SIZE = (224, 224)
EPOCHS_STAGE1 = 10
EPOCHS_STAGE2 = 15

# Set your dataset paths
# Assuming structure: dataset/train, dataset/val, dataset/test
DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'dataset'))
TRAIN_DIR = os.path.join(DATASET_DIR, 'train')
VAL_DIR = os.path.join(DATASET_DIR, 'val')
TEST_DIR = os.path.join(DATASET_DIR, 'test')
SAVE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'models'))

os.makedirs(SAVE_DIR, exist_ok=True)

def build_data_generators():
    # 4. IMAGE PREPROCESSING AND AUGMENTATION
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    # Do NOT augment validation or test data!
    val_test_datagen = ImageDataGenerator(rescale=1./255)
    
    if os.path.exists(TRAIN_DIR):
        train_generator = train_datagen.flow_from_directory(TRAIN_DIR, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE, class_mode='categorical')
        val_generator = val_test_datagen.flow_from_directory(VAL_DIR, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE, class_mode='categorical', shuffle=False)
        test_generator = val_test_datagen.flow_from_directory(TEST_DIR, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE, class_mode='categorical', shuffle=False)
        return train_generator, val_generator, test_generator
    return None, None, None

def get_custom_cnn(num_classes):
    model = Sequential([
        Input(shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3)),
        Conv2D(32, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])
    return model, "Custom_CNN"

def get_transfer_model(base_model_func, num_classes, model_name):
    base_model = base_model_func(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))
    base_model.trainable = False # Freeze backbone initially
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=predictions)
    return model, model_name, base_model

def train_and_fine_tune(model, model_name, train_gen, val_gen, base_model=None):
    print(f"\n--- Training {model_name} (Stage 1) ---")
    model.compile(optimizer=Adam(learning_rate=1e-3), loss='categorical_crossentropy', metrics=['accuracy'])
    
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2)
    ]
    
    history1 = model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS_STAGE1, callbacks=callbacks)
    
    if base_model:
        print(f"\n--- Fine-tuning {model_name} (Stage 2) ---")
        base_model.trainable = True
        # Freeze lower layers, unfreeze top ones
        for layer in base_model.layers[:len(base_model.layers)//2]:
            layer.trainable = False
        
        model.compile(optimizer=Adam(learning_rate=1e-5), loss='categorical_crossentropy', metrics=['accuracy'])
        history2 = model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS_STAGE2, callbacks=callbacks)
        
        # Merge histories
        for k in history1.history.keys():
            history1.history[k].extend(history2.history[k])
            
    return history1

def evaluate_model(model, model_name, test_gen):
    print(f"\n--- Evaluating {model_name} on UNSEEN Test Set ---")
    test_gen.reset()
    loss, accuracy = model.evaluate(test_gen)
    
    y_true = test_gen.classes
    y_pred_probs = model.predict(test_gen)
    y_pred = np.argmax(y_pred_probs, axis=1)
    
    report = classification_report(y_true, y_pred, target_names=test_gen.class_indices.keys(), output_dict=True)
    
    print(f"Accuracy: {accuracy:.4f}")
    return accuracy, report, y_true, y_pred

def main():
    train_gen, val_gen, test_gen = build_data_generators()
    
    if not train_gen:
        print("Dataset directory not found. Please place PlantVillage dataset in 'dataset/train', 'dataset/val', 'dataset/test'.")
        # Generate a dummy model for the backend to use as a placeholder
        print("Generating a tiny DUMMY model just to satisfy backend integration until real training is run...")
        num_classes = 38 # Default for PlantVillage
        model, _ = get_custom_cnn(num_classes)
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        model_path = os.path.join(SAVE_DIR, 'best_crop_disease_model.h5')
        model.save(model_path)
        class_names = [f"Class_{i}" for i in range(num_classes)]
        with open(os.path.join(SAVE_DIR, 'class_names.json'), 'w') as f:
            json.dump({k: i for i, k in enumerate(class_names)}, f)
        print(f"Saved dummy model to {model_path}.")
        return

    num_classes = len(train_gen.class_indices)
    
    # Save class mapping
    class_map = {v: k for k, v in train_gen.class_indices.items()}
    with open(os.path.join(SAVE_DIR, 'class_names.json'), 'w') as f:
        json.dump(class_map, f)
        
    models_to_train = [
        get_custom_cnn(num_classes),
        get_transfer_model(MobileNetV2, num_classes, "MobileNetV2"),
        get_transfer_model(ResNet50, num_classes, "ResNet50"),
        get_transfer_model(EfficientNetB0, num_classes, "EfficientNetB0")
    ]
    
    results = {}
    best_acc = 0
    best_model_name = ""
    
    for item in models_to_train:
        if len(item) == 2:
            model, name = item
            base = None
        else:
            model, name, base = item
            
        train_and_fine_tune(model, name, train_gen, val_gen, base)
        acc, report, y_true, y_pred = evaluate_model(model, name, test_gen)
        
        # Macro & Weighted calculations are in `report`
        results[name] = {
            'accuracy': acc,
            'macro_f1': report['macro avg']['f1-score'],
            'weighted_f1': report['weighted avg']['f1-score']
        }
        
        # Save best
        if acc > best_acc:
            best_acc = acc
            best_model_name = name
            model_path = os.path.join(SAVE_DIR, 'best_crop_disease_model.h5')
            model.save(model_path)
            
            # Confusion Matrix Plot
            cm = confusion_matrix(y_true, y_pred)
            plt.figure(figsize=(10,8))
            sns.heatmap(cm, cmap='Blues')
            plt.title(f"Confusion Matrix - {name}")
            plt.ylabel('True')
            plt.xlabel('Predicted')
            plt.savefig(os.path.join(SAVE_DIR, f'confusion_matrix_{name}.png'))
            plt.close()

    print("\n--- FINAL COMPARISON ---")
    print(f"{'Model':<15} | {'Accuracy':<10} | {'Macro F1':<10}")
    for k, v in results.items():
        print(f"{k:<15} | {v['accuracy']:.4f}     | {v['macro_f1']:.4f}")
    
    print(f"\nBest Model: {best_model_name} saved to {os.path.join(SAVE_DIR, 'best_crop_disease_model.h5')}")

if __name__ == "__main__":
    main()
