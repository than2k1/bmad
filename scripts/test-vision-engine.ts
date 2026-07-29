import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { analyzeKeyframe, ImageFrameInput, preloadVisionModel } from '../src/utils/visionInferencingEngine';
import { COCO17Keypoints, SubjectBoundingBox } from '../src/types/vision';

/**
 * Decodes ANY JPG, PNG, or BMP image file from disk into raw RGB Uint8Array.
 */
function readImageFileFromDisk(filePath: string): ImageFrameInput {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image file not found at path: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  let width = 0;
  let height = 0;
  let rgbData: Uint8Array;

  if (ext === '.jpg' || ext === '.jpeg') {
    const decoded = jpeg.decode(fileBuffer, { useTArray: true, maxMemoryUsageInMB: 4096 });
    width = decoded.width;
    height = decoded.height;
    rgbData = new Uint8Array(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      rgbData[i * 3] = decoded.data[i * 4]; // R
      rgbData[i * 3 + 1] = decoded.data[i * 4 + 1]; // G
      rgbData[i * 3 + 2] = decoded.data[i * 4 + 2]; // B
    }
  } else if (ext === '.png') {
    const png = PNG.sync.read(fileBuffer);
    width = png.width;
    height = png.height;
    rgbData = new Uint8Array(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      rgbData[i * 3] = png.data[i * 4]; // R
      rgbData[i * 3 + 1] = png.data[i * 4 + 1]; // G
      rgbData[i * 3 + 2] = png.data[i * 4 + 2]; // B
    }
  } else if (ext === '.bmp') {
    if (fileBuffer[0] !== 0x42 || fileBuffer[1] !== 0x4d) {
      throw new Error(`File '${filePath}' is not a valid BMP image.`);
    }
    const pixelOffset = fileBuffer.readUInt32LE(10);
    width = fileBuffer.readInt32LE(18);
    const rawHeight = fileBuffer.readInt32LE(22);
    const isTopDown = rawHeight < 0;
    height = Math.abs(rawHeight);
    const bpp = fileBuffer.readUInt16LE(28);
    const bytesPerPixel = bpp / 8;
    const rowSize = Math.floor((bpp * width + 31) / 32) * 4;

    rgbData = new Uint8Array(width * height * 3);
    for (let y = 0; y < height; y++) {
      const srcY = isTopDown ? y : height - 1 - y;
      const srcRowOffset = pixelOffset + srcY * rowSize;
      const dstRowOffset = y * width * 3;
      for (let x = 0; x < width; x++) {
        const srcPx = srcRowOffset + x * bytesPerPixel;
        const dstPx = dstRowOffset + x * 3;
        rgbData[dstPx] = fileBuffer[srcPx + 2]; // R
        rgbData[dstPx + 1] = fileBuffer[srcPx + 1]; // G
        rgbData[dstPx + 2] = fileBuffer[srcPx]; // B
      }
    }
  } else {
    throw new Error(`Unsupported image format '${ext}'. Please use .jpg, .jpeg, .png, or .bmp.`);
  }

  return {
    data: rgbData,
    width,
    height,
    channels: 3,
    uri: filePath,
  };
}

/**
 * Skeleton connections definitions matching COCO-17
 */
const SKELETON_PAIRS: [keyof COCO17Keypoints, keyof COCO17Keypoints, string][] = [
  // Face (Cyan)
  ['nose', 'left_eye', '#00FFFF'],
  ['nose', 'right_eye', '#00FFFF'],
  ['left_eye', 'left_ear', '#00FFFF'],
  ['right_eye', 'right_ear', '#00FFFF'],
  // Torso (Magenta)
  ['left_shoulder', 'right_shoulder', '#FF00FF'],
  ['left_shoulder', 'left_hip', '#FF00FF'],
  ['right_shoulder', 'right_hip', '#FF00FF'],
  ['left_hip', 'right_hip', '#FF00FF'],
  // Left Arm (Green)
  ['left_shoulder', 'left_elbow', '#00FF00'],
  ['left_elbow', 'left_wrist', '#00FF00'],
  // Right Arm (Cyan/Blue)
  ['right_shoulder', 'right_elbow', '#0088FF'],
  ['right_elbow', 'right_wrist', '#0088FF'],
  // Left Leg (Yellow)
  ['left_hip', 'left_knee', '#FFFF00'],
  ['left_knee', 'left_ankle', '#FFFF00'],
  // Right Leg (Orange)
  ['right_hip', 'right_knee', '#FF8800'],
  ['right_knee', 'right_ankle', '#FF8800'],
];

/**
 * Draws the detected COCO-17 skeleton points & lines onto the image pixel buffer and encodes a JPEG output image.
 */
function drawSkeletonOverlayImage(
  inputFrame: ImageFrameInput,
  keypoints: COCO17Keypoints,
  boundingBox: SubjectBoundingBox | null,
  outputPath: string
): void {
  const { width, height, data } = inputFrame;
  const rgbaData = new Uint8Array(width * height * 4);

  // Copy RGB -> RGBA
  for (let i = 0; i < width * height; i++) {
    rgbaData[i * 4] = data[i * 3]; // R
    rgbaData[i * 4 + 1] = data[i * 3 + 1]; // G
    rgbaData[i * 4 + 2] = data[i * 3 + 2]; // B
    rgbaData[i * 4 + 3] = 255; // Alpha
  }

  const setPixel = (x: number, y: number, r: number, g: number, b: number) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
      rgbaData[idx] = r;
      rgbaData[idx + 1] = g;
      rgbaData[idx + 2] = b;
    }
  };

  const drawCircle = (cx: number, cy: number, radius: number, r: number, g: number, b: number) => {
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= r2) {
          setPixel(cx + dx, cy + dy, r, g, b);
        }
      }
    }
  };

  const drawLine = (x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, thickness: number = 4) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let currX = x0;
    let currY = y0;

    while (true) {
      drawCircle(currX, currY, Math.floor(thickness / 2), r, g, b);
      if (Math.abs(currX - x1) < 2 && Math.abs(currY - y1) < 2) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        currX += sx;
      }
      if (e2 < dx) {
        err += dx;
        currY += sy;
      }
    }
  };

  // Convert hex color to RGB tuple
  const hexToRgb = (hex: string): [number, number, number] => {
    const num = parseInt(hex.replace('#', ''), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const scaleRadius = Math.max(4, Math.round(Math.min(width, height) * 0.012));
  const scaleLineThickness = Math.max(3, Math.round(Math.min(width, height) * 0.006));

  // 1. Draw Skeleton Lines
  SKELETON_PAIRS.forEach(([p1, p2, color]) => {
    const kp1 = keypoints[p1];
    const kp2 = keypoints[p2];
    if (kp1 && kp2 && (kp1.confidence ?? 1) > 0.1 && (kp2.confidence ?? 1) > 0.1) {
      const x1 = Math.round(kp1.x * width);
      const y1 = Math.round(kp1.y * height);
      const x2 = Math.round(kp2.x * width);
      const y2 = Math.round(kp2.y * height);
      const [r, g, b] = hexToRgb(color);
      drawLine(x1, y1, x2, y2, r, g, b, scaleLineThickness);
    }
  });

  // 2. Draw Keypoint Joint Circles
  Object.entries(keypoints).forEach(([name, kp]) => {
    if (kp && (kp.confidence ?? 1) > 0.1) {
      const kx = Math.round(kp.x * width);
      const ky = Math.round(kp.y * height);
      // Bright lime-green joint circles with white inner core
      drawCircle(kx, ky, scaleRadius, 48, 209, 88);
      drawCircle(kx, ky, Math.max(2, Math.round(scaleRadius * 0.4)), 255, 255, 255);
    }
  });

  // 3. Draw Bounding Box (Cyan)
  if (boundingBox) {
    const bx = Math.round(boundingBox.x * width);
    const by = Math.round(boundingBox.y * height);
    const bw = Math.round(boundingBox.width * width);
    const bh = Math.round(boundingBox.height * height);

    drawLine(bx, by, bx + bw, by, 0, 255, 255, scaleLineThickness);
    drawLine(bx + bw, by, bx + bw, by + bh, 0, 255, 255, scaleLineThickness);
    drawLine(bx + bw, by + bh, bx, by + bh, 0, 255, 255, scaleLineThickness);
    drawLine(bx, by + bh, bx, by, 0, 255, 255, scaleLineThickness);
  }

  // Encode back to JPEG file
  const jpegImageData = jpeg.encode({ data: rgbaData, width, height }, 90);
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, jpegImageData.data);
}

/**
 * Generates an interactive HTML preview file embedding the image and responsive SVG skeleton overlay.
 */
function generateSkeletonHTMLPreview(
  imagePath: string,
  keypoints: COCO17Keypoints,
  boundingBox: SubjectBoundingBox | null,
  outputPath: string
): void {
  const imageBase64 = fs.readFileSync(imagePath).toString('base64');
  const ext = path.extname(imagePath).replace('.', '').toLowerCase();
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  // SVG Connections
  const svgLines = SKELETON_PAIRS.map(([p1, p2, color]) => {
    const kp1 = keypoints[p1];
    const kp2 = keypoints[p2];
    if (!kp1 || !kp2) return '';
    return `<line x1="${(kp1.x * 100).toFixed(2)}%" y1="${(kp1.y * 100).toFixed(2)}%" x2="${(kp2.x * 100).toFixed(2)}%" y2="${(kp2.y * 100).toFixed(2)}%" stroke="${color}" stroke-width="4" stroke-linecap="round" />`;
  }).join('\n    ');

  // SVG Circles
  const svgCircles = Object.entries(keypoints).map(([name, kp]) => {
    if (!kp) return '';
    return `<circle cx="${(kp.x * 100).toFixed(2)}%" cy="${(kp.y * 100).toFixed(2)}%" r="7" fill="#30D158" stroke="#FFFFFF" stroke-width="2"><title>${name} (${(kp.x).toFixed(2)}, ${(kp.y).toFixed(2)})</title></circle>`;
  }).join('\n    ');

  // SVG Bounding Box
  const svgBbox = boundingBox
    ? `<rect x="${(boundingBox.x * 100).toFixed(2)}%" y="${(boundingBox.y * 100).toFixed(2)}%" width="${(boundingBox.width * 100).toFixed(2)}%" height="${(boundingBox.height * 100).toFixed(2)}%" fill="none" stroke="#00FFFF" stroke-width="3" stroke-dasharray="6,4" />`
    : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Pose Skeleton Visual Overlay Comparison</title>
  <style>
    body { background-color: #0d1117; color: #f0f6fc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
    h1 { margin-bottom: 8px; color: #58a6ff; }
    p { color: #8b949e; margin-bottom: 20px; }
    .container { position: relative; display: inline-block; max-width: 90vw; max-height: 80vh; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.8); border: 2px solid #30363d; }
    .container img { display: block; max-width: 100%; max-height: 80vh; height: auto; }
    .container svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
    .legend { margin-top: 24px; display: flex; gap: 16px; background: #161b22; padding: 12px 20px; border-radius: 8px; border: 1px solid #30363d; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  </style>
</head>
<body>
  <h1>🦴 AI Pose Skeleton Visual Overlay</h1>
  <p>Compare detected COCO-17 keypoints against your original input photo</p>
  
  <div class="container">
    <img src="${dataUrl}" alt="Original Input Image" />
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      ${svgBbox}
      ${svgLines}
      ${svgCircles}
    </svg>
  </div>

  <div class="legend">
    <div class="legend-item"><span class="dot" style="background:#00FFFF"></span> Face</div>
    <div class="legend-item"><span class="dot" style="background:#FF00FF"></span> Torso</div>
    <div class="legend-item"><span class="dot" style="background:#00FF00"></span> Left Arm</div>
    <div class="legend-item"><span class="dot" style="background:#0088FF"></span> Right Arm</div>
    <div class="legend-item"><span class="dot" style="background:#FFFF00"></span> Left Leg</div>
    <div class="legend-item"><span class="dot" style="background:#FF8800"></span> Right Leg</div>
    <div class="legend-item"><span class="dot" style="background:#30D158"></span> COCO Joint</div>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, htmlContent);
}

/**
 * Static Picture Testing Utility for Vision Inferencing Engine.
 * Run via: npx tsx scripts/test-vision-engine.ts <path-to-your-image.jpg>
 */
async function runStaticImageInferenceTest() {
  console.log('====================================================');
  console.log('🤖 ON-DEVICE LOCAL VISION INFERENCING ENGINE TEST');
  console.log('====================================================\n');

  let imagePath = process.argv[2];

  if (!imagePath) {
    const candidatePaths = [
      path.join(process.cwd(), 'assets', 'test-image.jpg'),
      path.join(process.cwd(), 'assets', 'test-image.jpeg'),
      path.join(process.cwd(), 'assets', 'test-image.png'),
      path.join(process.cwd(), 'assets', 'test-portrait.bmp'),
    ];

    imagePath = candidatePaths.find((p) => fs.existsSync(p)) || '';
  }

  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error('❌ NO IMAGE FILE FOUND!');
    console.error('\nPlease provide an image file path as an argument, for example:');
    console.error('   npx tsx scripts/test-vision-engine.ts C:/path/to/your-photo.jpg');
    console.error('or place your image file at:');
    console.error(`   ${path.join(process.cwd(), 'assets', 'test-image.jpg')}\n`);
    process.exit(1);
  }

  console.log(`📂 Reading user image file from hard drive: ${imagePath}`);
  const inputFrame = readImageFileFromDisk(imagePath);

  const fileStats = fs.statSync(imagePath);
  console.log(`💾 File Size on Disk: ${(fileStats.size / 1024).toFixed(1)} KB`);
  console.log(`📷 Decoded Image Dimensions: ${inputFrame.width}x${inputFrame.height} (${inputFrame.channels} channels)\n`);

  console.log('⚡ Pre-warming ONNX Session & Pre-allocating Tensor Memory...');
  await preloadVisionModel();

  console.log('⚡ Running Real Keyframe Vision Inferencing Engine...\n');

  const outcome = await analyzeKeyframe(inputFrame);
  const { result, latencyMs } = outcome;

  console.log(`⏱️ Inferencing Latency: ${latencyMs} ms (NFR-1.1 Target: <200ms)`);
  console.log(`🎯 Overall Pose Confidence Score: ${(result.confidenceScore * 100).toFixed(1)}%`);
  console.log(`👥 Detected Subject Count: ${result.subjectCount.toUpperCase()}`);
  console.log(`🏞️ Scene Classification: ${result.sceneType.toUpperCase()}`);
  console.log('\n📦 Subject Bounding Box (Normalized):');
  console.log(`   x: ${result.boundingBox?.x.toFixed(3)}, y: ${result.boundingBox?.y.toFixed(3)}, w: ${result.boundingBox?.width.toFixed(3)}, h: ${result.boundingBox?.height.toFixed(3)}`);

  console.log('\n🦴 Detected COCO-17 Body Keypoints:');
  if (result.keypoints) {
    const kps = result.keypoints;
    console.log(`   - Nose:            x=${kps.nose.x.toFixed(3)}, y=${kps.nose.y.toFixed(3)} (conf: ${(kps.nose.confidence! * 100).toFixed(0)}%)`);
    console.log(`   - Left Eye:        x=${kps.left_eye.x.toFixed(3)}, y=${kps.left_eye.y.toFixed(3)}`);
    console.log(`   - Right Eye:       x=${kps.right_eye.x.toFixed(3)}, y=${kps.right_eye.y.toFixed(3)}`);
    console.log(`   - Left Shoulder:   x=${kps.left_shoulder.x.toFixed(3)}, y=${kps.left_shoulder.y.toFixed(3)}`);
    console.log(`   - Right Shoulder:  x=${kps.right_shoulder.x.toFixed(3)}, y=${kps.right_shoulder.y.toFixed(3)}`);
    console.log(`   - Left Elbow:      x=${kps.left_elbow.x.toFixed(3)}, y=${kps.left_elbow.y.toFixed(3)}`);
    console.log(`   - Right Elbow:     x=${kps.right_elbow.x.toFixed(3)}, y=${kps.right_elbow.y.toFixed(3)}`);
    console.log(`   - Left Wrist:      x=${kps.left_wrist.x.toFixed(3)}, y=${kps.left_wrist.y.toFixed(3)}`);
    console.log(`   - Right Wrist:     x=${kps.right_wrist.x.toFixed(3)}, y=${kps.right_wrist.y.toFixed(3)}`);
    console.log(`   - Left Hip:        x=${kps.left_hip.x.toFixed(3)}, y=${kps.left_hip.y.toFixed(3)}`);
    console.log(`   - Right Hip:       x=${kps.right_hip.x.toFixed(3)}, y=${kps.right_hip.y.toFixed(3)}`);
    console.log(`   - Left Knee:       x=${kps.left_knee.x.toFixed(3)}, y=${kps.left_knee.y.toFixed(3)}`);
    console.log(`   - Right Knee:      x=${kps.right_knee.x.toFixed(3)}, y=${kps.right_knee.y.toFixed(3)}`);
    console.log(`   - Left Ankle:      x=${kps.left_ankle.x.toFixed(3)}, y=${kps.left_ankle.y.toFixed(3)}`);
    console.log(`   - Right Ankle:     x=${kps.right_ankle.x.toFixed(3)}, y=${kps.right_ankle.y.toFixed(3)}`);
  }

  // Generate Skeleton Overlay Output Files
  const outputJpgPath = path.join(process.cwd(), 'assets', 'output-skeleton-overlay.jpg');
  const outputHtmlPath = path.join(process.cwd(), 'assets', 'skeleton-overlay-preview.html');

  if (result.keypoints) {
    console.log('\n🎨 Generating Skeleton Mask Overlay Files...');
    drawSkeletonOverlayImage(inputFrame, result.keypoints, result.boundingBox, outputJpgPath);
    generateSkeletonHTMLPreview(imagePath, result.keypoints, result.boundingBox, outputHtmlPath);

    console.log(`🖼️ Output Overlay Image: file:///${outputJpgPath.replace(/\\/g, '/')}`);
    console.log(`🌐 Interactive HTML Preview: file:///${outputHtmlPath.replace(/\\/g, '/')}`);
  }

  console.log('\n====================================================');
  console.log(`✅ SUCCESS: User image analyzed & skeleton overlay generated!`);
  console.log('====================================================');
}

runStaticImageInferenceTest().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
