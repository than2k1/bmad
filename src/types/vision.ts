export interface Point2D {
  x: number;
  y: number;
  confidence?: number;
}

export interface COCO17Keypoints {
  nose: Point2D;
  left_eye: Point2D;
  right_eye: Point2D;
  left_ear?: Point2D;
  right_ear?: Point2D;
  left_shoulder: Point2D;
  right_shoulder: Point2D;
  left_elbow: Point2D;
  right_elbow: Point2D;
  left_wrist: Point2D;
  right_wrist: Point2D;
  left_hip: Point2D;
  right_hip: Point2D;
  left_knee: Point2D;
  right_knee: Point2D;
  left_ankle: Point2D;
  right_ankle: Point2D;
}

export interface SubjectBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SubjectCount = 'solo' | 'couple' | 'group';

export type SceneType = 'landscape' | 'architecture' | 'food' | 'interior' | 'sunset';

export interface SubjectDetection {
  keypoints: COCO17Keypoints;
  boundingBox: SubjectBoundingBox;
  confidence: number;
}

export type LineType = 'horizon' | 'vertical' | 'diagonal';

export type StructuralLabel = 'doorway' | 'window' | 'arch' | 'frame' | 'structure';

export interface LineSegment {
  start: Point2D;
  end: Point2D;
  angleDeg: number;
  length: number;
  confidence: number;
  type: LineType;
}

export interface BackgroundBoundingBox {
  id: string;
  label: StructuralLabel;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface SpatialLayoutResult {
  lines: LineSegment[];
  boundingBoxes: BackgroundBoundingBox[];
  horizonLine?: LineSegment;
  vanishingPoint?: Point2D;
  extractionLatencyMs: number;
}

export interface KeyframeVisionResult {
  timestamp: number;
  subjectCount: SubjectCount;
  sceneType: SceneType;
  subjects: SubjectDetection[];
  /** Max subject confidence; 0 when no subjects detected. */
  confidenceScore: number;
  /** Lighting quality score [0–1]: 0 = dark/unusable, 1 = well-lit. Distinct from
   *  confidenceScore (vision inference confidence). Used by exposure guidance logic. */
  lightingConfidence?: number;
  /** Background structural lines, horizon, vanishing point, and openings (Story 5.1). */
  spatialLayout?: SpatialLayoutResult;
}
