# Fine-Tuning Guide: Custom AI Pose Estimation Models for Mobile

This guide provides a step-by-step workflow for fine-tuning a custom **YOLOv8-Pose** or **MoveNet / MediaPipe Pose** model on custom datasets, exporting to **ONNX / CoreML / TFLite**, and integrating the trained weights into the app's local vision engine.

---

## 1. Dataset Preparation (COCO-17 Format)

Your pose dataset must be annotated with 17 keypoint pairs per person matching COCO-17:
- **Keypoints List (17 joints):**
  1. `nose`, 2. `left_eye`, 3. `right_eye`, 4. `left_ear`, 5. `right_ear`,
  6. `left_shoulder`, 7. `right_shoulder`, 8. `left_elbow`, 9. `right_elbow`,
  10. `left_wrist`, 11. `right_wrist`, 12. `left_hip`, 13. `right_hip`,
  14. `left_knee`, 15. `right_knee`, 16. `left_ankle`, 17. `right_ankle`

### Dataset Directory Structure (`dataset/`)
```
dataset/
├── images/
│   ├── train/
│   └── val/
├── labels/
│   ├── train/
│   └── val/
└── custom_pose.yaml
```

### `custom_pose.yaml` Config File:
```yaml
path: ./dataset # dataset root dir
train: images/train
val: images/val

# Keypoints specification
kpt_shape: [17, 3] # [num_keypoints, (x, y, visibility)]

# Classes
names:
  0: person
```

---

## 2. Fine-Tuning YOLOv8-Pose in PyTorch

Install Ultralytics:
```bash
pip install ultralytics torch torchvision
```

Create a training script `train_pose.py`:
```python
from ultralytics import YOLO

# Load pre-trained nano YOLOv8-Pose model (optimized for mobile latency)
model = YOLO('yolov8n-pose.pt')

# Train on custom dataset
results = model.train(
    data='custom_pose.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    device=0, # GPU index or 'cpu'
    name='custom_pose_model',
    workers=4
)

print("Fine-tuning completed. Best weights saved at:", results.save_dir + "/weights/best.pt")
```

Run training:
```bash
python train_pose.py
```

---

## 3. Exporting Model to Mobile Formats (ONNX / CoreML / TFLite)

Export the fine-tuned model (`best.pt`) to ONNX for cross-platform local inferencing:

```python
from ultralytics import YOLO

model = YOLO('runs/pose/custom_pose_model/weights/best.pt')

# Export to ONNX (dynamic batching, opset 12)
model.export(
    format='onnx',
    imgsz=[640, 640],
    dynamic=False,
    simplify=True,
    opset=12
)

# Optional: Export to CoreML for iOS Hardware Acceleration (Apple Neural Engine)
model.export(format='coreml', imgsz=640, nms=True)

# Optional: Export to TFLite for Android Hardware Acceleration (NNAPI / GPU Delegate)
model.export(format='tflite', imgsz=640, int8=True)
```

This outputs `best.onnx` (size ~6.5MB for `yolov8n-pose`).

---

## 4. Deploying the Fine-Tuned Model into the Engine

1. Copy your exported `best.onnx` file to the project's assets directory:
   ```bash
   cp best.onnx assets/models/yolov8n-pose.onnx
   ```

2. The Vision Inferencing Engine ([visionInferencingEngine.ts](file:///o:/New%20folder/bmad-test/bmad/src/utils/visionInferencingEngine.ts)) will automatically load `assets/models/yolov8n-pose.onnx`, run the image tensor preprocessing ($1 \times 3 \times 640 \times 640$), and parse detected pose keypoints!

3. Test your custom model with any static image:
   ```bash
   npx tsx scripts/test-vision-engine.ts
   ```

---

## 5. Mobile Hardware Acceleration Summary

| Platform | Format | Hardware Target | Latency |
|----------|--------|-----------------|---------|
| **Cross-Platform / Web** | `.onnx` | ONNX Runtime / WebGL | ~15–35 ms |
| **iOS (iPhone)** | `.mlmodel` / CoreML | Apple Neural Engine (ANE) | ~8–12 ms |
| **Android** | `.tflite` (INT8/FP16) | NNAPI / GPU Delegate | ~12–25 ms |
