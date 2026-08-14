// Main constellation hub layout - 6 nodes orbiting center

import type { MainNodeLayout, BranchPath } from "@/src/types/constellation";

// World space constants (viewport percentage units)
const CENTER_X = 50;
const CENTER_Y = 50;
const CENTER_NODE_RADIUS = 3; // visual radius of center rune
const MAIN_NODE_RADIUS = 1.5; // visual radius of main nodes
const SAFE_GAP = 4; // minimum gap between nodes
const ORBIT_RADIUS = CENTER_NODE_RADIUS + MAIN_NODE_RADIUS + SAFE_GAP + 12; // total distance from center

/**
 * Calculate main constellation layout using polar coordinates
 * Ensures no overlap with center node
 */
export function calculateMainNodesLayout(
  categories: Array<{ title: string; color: string; delay: number }>
): MainNodeLayout[] {
  const angleStep = 360 / categories.length;
  const startAngle = -90; // Start at top

  return categories.map((category, index) => {
    const angle = startAngle + index * angleStep;
    const radians = (angle * Math.PI) / 180;

    const x = CENTER_X + ORBIT_RADIUS * Math.cos(radians);
    const y = CENTER_Y + ORBIT_RADIUS * Math.sin(radians);

    return {
      id: category.title,
      title: category.title,
      color: category.color,
      x,
      y,
      angle,
      radius: ORBIT_RADIUS,
      delay: category.delay,
    };
  });
}

/**
 * Generate branch from center to main node
 * Connects edge-to-edge, not center-to-center
 */
export function generateMainBranch(
  nodeLayout: MainNodeLayout
): BranchPath {
  const dx = nodeLayout.x - CENTER_X;
  const dy = nodeLayout.y - CENTER_Y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Unit vector
  const unitX = dx / length;
  const unitY = dy / length;

  // Start at edge of center node
  const startX = CENTER_X + unitX * CENTER_NODE_RADIUS;
  const startY = CENTER_Y + unitY * CENTER_NODE_RADIUS;

  // End at edge of main node
  const endX = nodeLayout.x - unitX * MAIN_NODE_RADIUS;
  const endY = nodeLayout.y - unitY * MAIN_NODE_RADIUS;

  // Simple straight line for main constellation
  const d = `M ${startX} ${startY} L ${endX} ${endY}`;

  return {
    id: `main-branch-${nodeLayout.id}`,
    d,
    fromX: startX,
    fromY: startY,
    toX: endX,
    toY: endY,
  };
}

/**
 * Get center node coordinates
 */
export function getCenterNodePosition() {
  return { x: CENTER_X, y: CENTER_Y };
}
