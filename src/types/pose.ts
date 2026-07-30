import { AppMode } from './camera';
import { SubjectCount } from './vision';

export type FramingCrop = 'headshot' | 'half_body' | 'full_body';

export interface PoseKeypointsMap {
  nose: [number, number];
  left_eye?: [number, number];
  right_eye?: [number, number];
  left_ear?: [number, number];
  right_ear?: [number, number];
  left_shoulder: [number, number];
  right_shoulder: [number, number];
  left_elbow?: [number, number];
  right_elbow?: [number, number];
  left_wrist?: [number, number];
  right_wrist?: [number, number];
  left_hip: [number, number];
  right_hip: [number, number];
  left_knee?: [number, number];
  right_knee?: [number, number];
  left_ankle?: [number, number];
  right_ankle?: [number, number];
}

export interface PoseTemplate {
  id: string;
  title: string;
  category: AppMode;
  framing: FramingCrop;
  subject_count?: number; // 1 for solo, 2 for couple, >=3 for group
  subjectCountTag?: SubjectCount;
  tags: string[];
  keypoints: PoseKeypointsMap;
  skeleton_connections?: [string, string][];
}
