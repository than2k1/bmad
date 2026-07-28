import {
  getNumericZoom,
  getLensChipLabel,
  clampZoom,
} from '../lensCalculator';
import { LensPreset } from '../../types/camera';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runLensCalculatorTests() {
  // Test getNumericZoom
  assert(getNumericZoom('0.5x') === 0.5, '0.5x preset maps to 0.5 zoom');
  assert(getNumericZoom('1x') === 1.0, '1x preset maps to 1.0 zoom');
  assert(getNumericZoom('3x') === 3.0, '3x preset maps to 3.0 zoom');

  // Test getLensChipLabel
  assert(getLensChipLabel('0.5x') === '0.5x', '0.5x preset chip label is 0.5x');
  assert(getLensChipLabel('1x') === '1x', '1x preset chip label is 1x');
  assert(getLensChipLabel('3x') === '3x Portrait', '3x preset chip label is 3x Portrait');

  // Test clampZoom with explicit minZoom and maxZoom
  assert(clampZoom(0.5, 1.0, 5.0) === 1.0, 'Clamps 0.5 zoom to minZoom 1.0');
  assert(clampZoom(3.0, 1.0, 5.0) === 3.0, 'Allows 3.0 zoom within bounds [1.0, 5.0]');
  assert(clampZoom(6.0, 1.0, 5.0) === 5.0, 'Clamps 6.0 zoom to maxZoom 5.0');

  // Test clampZoom with undefined or missing bounds
  assert(clampZoom(0.5) === 0.5, 'Returns target zoom when min/max undefined');
  assert(clampZoom(0.5, 1.0) === 1.0, 'Clamps with only minZoom provided');
  assert(clampZoom(3.0, undefined, 2.0) === 2.0, 'Clamps with only maxZoom provided');

  // Test clampZoom with invalid targetZoom (NaN, Infinity)
  assert(clampZoom(NaN, 1.0, 5.0) === 1.0, 'Fallback to 1.0 when targetZoom is NaN');
  assert(clampZoom(Infinity, 1.0, 5.0) === 1.0, 'Fallback to 1.0 when targetZoom is Infinity');

  console.log('All lensCalculator unit tests passed successfully!');
}

if (require.main === module) {
  runLensCalculatorTests();
}
