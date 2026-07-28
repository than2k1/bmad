import { LensPreset } from '../types/camera';

/**
 * Maps a LensPreset to its numerical zoom multiplier.
 */
export function getNumericZoom(lens: LensPreset): number {
  switch (lens) {
    case '0.5x':
      return 0.5;
    case '1x':
      return 1.0;
    case '3x':
      return 3.0;
    default:
      return 1.0;
  }
}

/**
 * Returns the human-readable display label for a LensPreset chip.
 */
export function getLensChipLabel(lens: LensPreset): string {
  switch (lens) {
    case '0.5x':
      return '0.5x';
    case '1x':
      return '1x';
    case '3x':
      return '3x Portrait';
    default:
      return `${lens}`;
  }
}

/**
 * Safely clamps the target zoom value within device hardware boundaries.
 */
export function clampZoom(targetZoom: number, minZoom?: number, maxZoom?: number): number {
  let zoom = typeof targetZoom === 'number' && !isNaN(targetZoom) && Number.isFinite(targetZoom)
    ? targetZoom
    : 1.0;

  if (typeof minZoom === 'number' && !isNaN(minZoom) && Number.isFinite(minZoom)) {
    zoom = Math.max(zoom, minZoom);
  }

  if (typeof maxZoom === 'number' && !isNaN(maxZoom) && Number.isFinite(maxZoom)) {
    zoom = Math.min(zoom, maxZoom);
  }

  return zoom;
}
