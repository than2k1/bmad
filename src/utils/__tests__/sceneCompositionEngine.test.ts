import assert from 'node:assert';
import {
  calculateRuleOfThirdsLines,
  calculateGoldenRatioLines,
  evaluateSceneGuidanceBadge,
} from '../sceneCompositionEngine';

function testRuleOfThirds() {
  const width = 300;
  const height = 600;
  const result = calculateRuleOfThirdsLines(width, height);

  assert.strictEqual(Math.round(result.verticalLines[0]), 100);
  assert.strictEqual(Math.round(result.verticalLines[1]), 200);
  assert.strictEqual(Math.round(result.horizontalLines[0]), 200);
  assert.strictEqual(Math.round(result.horizontalLines[1]), 400);

  assert.strictEqual(result.powerPoints.length, 4);
  assert.strictEqual(Math.round(result.powerPoints[0].x), 100);
  assert.strictEqual(Math.round(result.powerPoints[0].y), 200);
  assert.strictEqual(Math.round(result.powerPoints[1].x), 100);
  assert.strictEqual(Math.round(result.powerPoints[1].y), 400);
  assert.strictEqual(Math.round(result.powerPoints[2].x), 200);
  assert.strictEqual(Math.round(result.powerPoints[2].y), 200);
  assert.strictEqual(Math.round(result.powerPoints[3].x), 200);
  assert.strictEqual(Math.round(result.powerPoints[3].y), 400);

  const fallback = calculateRuleOfThirdsLines(0, 0);
  assert.deepStrictEqual(fallback.verticalLines, [0, 0]);
  assert.deepStrictEqual(fallback.horizontalLines, [0, 0]);
  assert.strictEqual(fallback.powerPoints.length, 4);
  console.log('✓ calculateRuleOfThirdsLines passed');
}

function testGoldenRatio() {
  const width = 1000;
  const height = 1000;
  const result = calculateGoldenRatioLines(width, height);

  assert.strictEqual(Math.round(result.verticalLines[0]), 382);
  assert.strictEqual(Math.round(result.verticalLines[1]), 618);
  assert.strictEqual(Math.round(result.horizontalLines[0]), 382);
  assert.strictEqual(Math.round(result.horizontalLines[1]), 618);

  assert.strictEqual(result.powerPoints.length, 4);
  assert.strictEqual(Math.round(result.powerPoints[0].x), 382);
  assert.strictEqual(Math.round(result.powerPoints[0].y), 382);
  console.log('✓ calculateGoldenRatioLines passed');
}

function testEvaluateSceneGuidanceBadge() {
  const landscape = evaluateSceneGuidanceBadge('landscape');
  assert.ok(landscape.text.includes('Landscape Detected'));
  assert.ok(landscape.text.includes('Keep Horizon Level'), `Expected level message, got: ${landscape.text}`);
  assert.strictEqual(landscape.accentColor, '#00e5ff');

  // Dynamic horizon: angle > 3° should show tilt warning
  const landscapeTilted = evaluateSceneGuidanceBadge('landscape', 12);
  assert.ok(landscapeTilted.text.includes('Horizon Tilted 12°'), `Expected tilt message, got: ${landscapeTilted.text}`);

  // Horizon within tolerance (≤ 3°) should use standard message
  const landscapeLevel = evaluateSceneGuidanceBadge('landscape', 2);
  assert.ok(landscapeLevel.text.includes('Keep Horizon Level'), `Expected level message for small angle, got: ${landscapeLevel.text}`);

  const architecture = evaluateSceneGuidanceBadge('architecture');
  assert.ok(architecture.text.includes('Architecture Detected'));

  const sunset = evaluateSceneGuidanceBadge('sunset');
  assert.ok(sunset.text.includes('Sunset Detected'));

  const food = evaluateSceneGuidanceBadge('food');
  assert.ok(food.text.includes('Food Detected'));

  const interior = evaluateSceneGuidanceBadge('interior');
  assert.ok(interior.text.includes('Interior Detected'));

  const fallback = evaluateSceneGuidanceBadge('unknown');
  assert.ok(fallback.text.includes('Scene Detected'));
  assert.ok(fallback.accentColor);
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
