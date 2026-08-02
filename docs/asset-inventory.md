# Asset Inventory — PoseCam (bmad-camera-app)

## Overview

This inventory catalogs all static graphic assets, AI vision model files, test media, and preview resources used in PoseCam.

---

## Asset Catalog

| Asset Path | Type | File Format | Size | Purpose & Description |
|---|---|---|---|---|
| `assets/models/yolov8n-pose.onnx` | Model | ONNX | 13.48 MB | Offline YOLOv8n-Pose neural network model weights for on-device 17-keypoint human pose estimation. |
| `assets/output-skeleton-overlay.jpg` | Media | JPEG | 4.41 MB | Generated visual test output demonstrating COCO-17 skeleton rendering over portrait subject. |
| `assets/skeleton-overlay-preview.html` | Preview | HTML | 4.75 MB | Standalone web preview canvas for testing vector pose overlay rendering algorithms. |
| `assets/test-image.jpg` | Test Data | JPEG | 3.56 MB | Test image frame for local AI inferencing and spatial line extraction validation. |
| `assets/test-portrait.bmp` | Test Data | BMP | 1.23 MB | Uncompressed bitmap test frame for raw RGBA pixel tensor conversion testing. |

---

## Application Icons & Splash Assets (Expo manifest `app.json`)

| Asset Name | Config Reference | Format | Dimensions | Purpose |
|---|---|---|---|---|
| `icon.png` | `expo.icon` | PNG | 1024x1024 | Primary application launcher icon. |
| `splash.png` | `expo.splash.image` | PNG | 1242x2436 | Application launch splash screen image (contain mode, black background `#000000`). |
| `adaptive-icon.png` | `expo.android.adaptiveIcon.foregroundImage` | PNG | 1024x1024 | Android adaptive launcher icon foreground. |
