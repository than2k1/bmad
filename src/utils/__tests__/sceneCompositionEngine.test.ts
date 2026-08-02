function assert(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message || 'Condition failed'}`);
  }
}

import {
  calculateRuleOfThirdsLines,
  calculateGoldenRatioLines,
  evaluateSceneGuidanceBadge,
} from '../sceneCompositionEngine';
import { SceneType } from '../../types/vision';

function testRuleOfThirds() {
  const width = 300;
  const height = 600;
  const result = calculateRuleOfThirdsLines(width, height);

  assert(Math.abs(result.verticalLines[0] - 100) < 0.05, `Expected verticalLines[0] ~ 100, got ${result.verticalLines[0]}`);
  assert(Math.abs(result.verticalLines[1] - 200) < 0.05, `Expected verticalLines[1] ~ 200, got ${result.verticalLines[1]}`);
  assert(Math.abs(result.horizontalLines[0] - 200) < 0.05, `Expected horizontalLines[0] ~ 200, got ${result.horizontalLines[0]}`);
  assert(Math.abs(result.horizontalLines[1] - 400) < 0.05, `Expected horizontalLines[1] ~ 400, got ${result.horizontalLines[1]}`);

  assert(result.powerPoints.length === 4, 'Expected 4 power points');
  assert(Math.abs(result.powerPoints[0].x - 100) < 0.05 && Math.abs(result.powerPoints[0].y - 200) < 0.05);
  assert(Math.abs(result.powerPoints[1].x - 100) < 0.05 && Math.abs(result.powerPoints[1].y - 400) < 0.05);
  assert(Math.abs(result.powerPoints[2].x - 200) < 0.05 && Math.abs(result.powerPoints[2].y - 200) < 0.05);
  assert(Math.abs(result.powerPoints[3].x - 200) < 0.05 && Math.abs(result.powerPoints[3].y - 400) < 0.05);

  const fallback = calculateRuleOfThirdsLines(0, 0);
  assert(fallback.verticalLines[0] === 0 && fallback.verticalLines[1] === 0);
  assert(fallback.horizontalLines[0] === 0 && fallback.horizontalLines[1] === 0);
  assert(fallback.powerPoints.length === 4);
  console.log('✓ calculateRuleOfThirdsLines passed');
}

function testGoldenRatio() {
  const width = 1000;
  const height = 1000;
  const result = calculateGoldenRatioLines(width, height);

  assert(Math.abs(result.verticalLines[0] - 382) < 0.05, `Expected verticalLines[0] ~ 382, got ${result.verticalLines[0]}`);
  assert(Math.abs(result.verticalLines[1] - 618) < 0.05, `Expected verticalLines[1] ~ 618, got ${result.verticalLines[1]}`);
  assert(Math.abs(result.horizontalLines[0] - 382) < 0.05, `Expected horizontalLines[0] ~ 382, got ${result.horizontalLines[0]}`);
  assert(Math.abs(result.horizontalLines[1] - 618) < 0.05, `Expected horizontalLines[1] ~ 618, got ${result.horizontalLines[1]}`);

  assert(result.powerPoints.length === 4, 'Expected 4 golden ratio power points');
  assert(Math.abs(result.powerPoints[0].x - 382) < 0.05 && Math.abs(result.powerPoints[0].y - 382) < 0.05);
  console.log('✓ calculateGoldenRatioLines passed');
}

function testEvaluateSceneGuidanceBadge() {
  const landscape = evaluateSceneGuidanceBadge('landscape');
  assert(landscape.text.includes('Landscape Detected'));
  assert(landscape.text.includes('Keep Horizon Level'), `Expected level message, got: ${landscape.text}`);
  assert(landscape.accentColor === '#00e5ff', `Expected #00e5ff, got ${landscape.accentColor}`);

  // Dynamic horizon: angle > 3° should show tilt warning
  const landscapeTilted = evaluateSceneGuidanceBadge('landscape', 12);
  assert(landscapeTilted.text.includes('Horizon Tilted 12°'), `Expected tilt message, got: ${landscapeTilted.text}`);

  // Horizon within tolerance (≤ 3°) should use standard message
  const landscapeLevel = evaluateSceneGuidanceBadge('landscape', 2);
  assert(landscapeLevel.text.includes('Keep Horizon Level'), `Expected level message for small angle, got: ${landscapeLevel.text}`);

  const architecture = evaluateSceneGuidanceBadge('architecture');
  assert(architecture.text.includes('Architecture Detected'));

  const sunset = evaluateSceneGuidanceBadge('sunset');
  assert(sunset.text.includes('Sunset Detected'));

  const food = evaluateSceneGuidanceBadge('food');
  assert(food.text.includes('Food Detected'));

  const interior = evaluateSceneGuidanceBadge('interior');
  assert(interior.text.includes('Interior Detected'));

  const fallback = evaluateSceneGuidanceBadge('unknown' as SceneType);
  assert(fallback.text.includes('Scene Detected'));
  assert(Boolean(fallback.accentColor));
  console.log('✓ evaluateSceneGuidanceBadge passed');
}

function runAllTests() {
  console.log('Running sceneCompositionEngine unit tests...');
  testRuleOfThirds();
  testGoldenRatio();
  testEvaluateSceneGuidanceBadge();
  console.log('All sceneCompositionEngine unit tests passed successfully!');
}

runAllTests();
