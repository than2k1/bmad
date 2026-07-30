import * as fs from 'fs';
import * as path from 'path';
import { PoseTemplate, FramingCrop, PoseKeypointsMap } from '../src/types/pose';
import { SubjectCount } from '../src/types/vision';

interface ExtractPoseOptions {
  id: string;
  title: string;
  framing: FramingCrop;
  subjectCountTag: SubjectCount;
  tags: string[];
  rawKeypoints: Partial<PoseKeypointsMap>;
  bounds?: { xMin: number; yMin: number; xMax: number; yMax: number };
}

/**
 * Normalizes raw pixel or unscaled keypoint coordinates into a 0..1 bounding box space.
 */
export function normalizeKeypoints(
  keypoints: Partial<PoseKeypointsMap>,
  bounds?: { xMin: number; yMin: number; xMax: number; yMax: number }
): PoseKeypointsMap {
  if (!bounds) {
    // If bounds are omitted, calculate bounding box dynamically from non-null keypoints
    let xMin = 1, yMin = 1, xMax = 0, yMax = 0;
    let hasPoints = false;

    Object.values(keypoints).forEach((pt) => {
      if (pt && Array.isArray(pt) && pt.length === 2) {
        hasPoints = true;
        if (pt[0] < xMin) xMin = pt[0];
        if (pt[0] > xMax) xMax = pt[0];
        if (pt[1] < yMin) yMin = pt[1];
        if (pt[1] > yMax) yMax = pt[1];
      }
    });

    if (!hasPoints || xMax <= xMin || yMax <= yMin) {
      bounds = { xMin: 0, yMin: 0, xMax: 1, yMax: 1 };
    } else {
      // Add 5% padding
      const xPad = (xMax - xMin) * 0.05;
      const yPad = (yMax - yMin) * 0.05;
      bounds = {
        xMin: Math.max(0, xMin - xPad),
        xMax: Math.min(1, xMax + xPad),
        yMin: Math.max(0, yMin - yPad),
        yMax: Math.min(1, yMax + yPad),
      };
    }
  }

  const width = bounds.xMax - bounds.xMin || 1;
  const height = bounds.yMax - bounds.yMin || 1;

  const normalized: Partial<PoseKeypointsMap> = {};
  for (const [joint, pt] of Object.entries(keypoints)) {
    if (pt && Array.isArray(pt) && pt.length === 2) {
      const normX = Number(((pt[0] - bounds.xMin) / width).toFixed(2));
      const normY = Number(((pt[1] - bounds.yMin) / height).toFixed(2));
      (normalized as any)[joint] = [
        Math.max(0, Math.min(1, normX)),
        Math.max(0, Math.min(1, normY)),
      ];
    }
  }

  return normalized as PoseKeypointsMap;
}

/**
 * Creates a formatted PoseTemplate object.
 */
export function createPoseTemplate(options: ExtractPoseOptions): PoseTemplate {
  const normalizedKeypoints = normalizeKeypoints(options.rawKeypoints, options.bounds);

  const subjectCountNum =
    options.subjectCountTag === 'solo' ? 1 : options.subjectCountTag === 'couple' ? 2 : 3;

  return {
    id: options.id,
    title: options.title,
    category: 'person',
    framing: options.framing,
    subject_count: subjectCountNum,
    subjectCountTag: options.subjectCountTag,
    tags: Array.from(new Set([options.subjectCountTag, options.framing, ...options.tags])),
    keypoints: normalizedKeypoints,
    skeleton_connections: [
      ['nose', 'left_eye'],
      ['nose', 'right_eye'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle'],
    ],
  };
}

// CLI Execution Helper
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.length === 0) {
    console.log(`
AI Pose Extraction & Normalization CLI Tool
===========================================
Usage:
  npx tsx scripts/extract-pose.ts --id <id> --title "<title>" --framing <headshot|half_body|full_body> --tag <solo|couple|group> --keypoints '<json_string>'

Example:
  npx tsx scripts/extract-pose.ts --id "headshot-tilt-34" --title "3/4 Turn Headshot" --framing headshot --tag solo --keypoints '{"nose":[0.5,0.3],"left_shoulder":[0.3,0.6],"right_shoulder":[0.7,0.6]}'
`);
    process.exit(0);
  }

  let id = 'custom-pose-' + Date.now();
  let title = 'Custom Pose';
  let framing: FramingCrop = 'half_body';
  let subjectCountTag: SubjectCount = 'solo';
  let tags: string[] = [];
  let rawKeypoints: Partial<PoseKeypointsMap> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) id = args[++i];
    if (args[i] === '--title' && args[i + 1]) title = args[++i];
    if (args[i] === '--framing' && args[i + 1]) framing = args[++i] as FramingCrop;
    if (args[i] === '--tag' && args[i + 1]) subjectCountTag = args[++i] as SubjectCount;
    if (args[i] === '--tags' && args[i + 1]) tags = args[++i].split(',');
    if (args[i] === '--keypoints' && args[i + 1]) {
      try {
        rawKeypoints = JSON.parse(args[++i]);
      } catch (e) {
        console.error('Invalid JSON provided for --keypoints');
        process.exit(1);
      }
    }
  }

  const template = createPoseTemplate({
    id,
    title,
    framing,
    subjectCountTag,
    tags,
    rawKeypoints,
  });

  console.log('\n--- Generated PoseTemplate ---');
  console.log(JSON.stringify(template, null, 2));
}
