# Epic 5 Context: Background Object Layout & Composition Guidance Engine

<!-- Generated from spec-background-layout-guidance.md -->

## Goal

Identify background object layouts (lines, structural frames, horizons, balance) and guide photographers using mode-specific classic composition rule cascades (Symmetry, Leading Lines, Frame-in-Frame, Rule of Thirds).

## Stories

- **Story 5.1**: Background Line & Bounding Box Spatial Layout Extractor
- **Story 5.2**: Mode-Driven Composition Rule Evaluator Engine (`compositionRuleEngine`)
- **Story 5.3**: Viewfinder Directional Cues & Target Visual Overlay HUD Renderer

## Requirements & Constraints

- **Rule Priorities**:
  - **Landscape Mode**: Symmetry (4) > Leading Lines (3) > Frame-in-Frame (1) > Rule of Thirds (2)
  - **Person Mode**: Frame-in-Frame (1) > Leading Lines (3) > Symmetry (4) > Rule of Thirds (2)
- **Performance Budget**: Dual-Tier Keyframe Pipeline (<200ms latency budget).
- **Rule Activation**: Guidance triggers only when spatial alignment confidence $\ge 70\%$; fallback to Rule of Thirds grid.

## Technical Decisions

- Modular `compositionRuleEngine.ts` taking mode-specific priority cascades from `compositionStrategy.ts`.
- Spatial centroid and line segment alignment math operating on Tier 2 background object keyframes.
- HUD renderer presenting non-intrusive directional arrows and target markers on `CameraViewfinder.tsx`.

## Cross-Story Dependencies

- Depends on `useCameraStore` keyframe vision result (Story 2.2) and mode selection (Story 1.3).
- Extends visual guidance overlays established in Epic 3 & 4.
