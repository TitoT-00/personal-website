// Tree expansion layout engine

import type { TreeLayout, SubNodeLayout, CardLayout, BranchPath } from "@/src/types/constellation";

// Layout constants (viewport percentage units)
const CARD_WIDTH = 22;
const CARD_MIN_HEIGHT = 12;
const NODE_CARD_GAP = 2;
const PROGRESSION_START_X = 14; // horizontal distance from root to first item
const PROGRESSION_START_Y = 12; // vertical distance from root to first item
const PROGRESSION_STEP_X = 7; // horizontal stagger between items (visual diagonal)
const PROGRESSION_STEP_Y = 16; // vertical stagger between items (> card height, guarantees zero overlap)
const RADIAL_RADIUS = 22; // base distance from root to each fan node
const RADIAL_RING_OFFSET = 10; // alternating ring stagger so adjacent cards never overlap
const RADIAL_MIN_ARC = 90; // minimum fan spread in degrees
const RADIAL_ARC_PER_ITEM = 22; // additional spread per item beyond 3

/**
 * Generate smooth cubic Bezier curve
 */
function createBezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Control points at 35% and 65% for smooth S-curve
  const control1X = x1 + dx * 0.35;
  const control1Y = y1;
  const control2X = x1 + dx * 0.65;
  const control2Y = y2;

  return `M ${x1} ${y1} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${x2} ${y2}`;
}

/**
 * Extract year from year string for sorting
 */
function extractStartYear(yearString: string): number {
  const match = yearString.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Calculate progression tree layout (Career, Education, Side Projects)
 * Sequential path with guaranteed vertical spacing
 * MOST RECENT items closest to root, oldest farthest away
 */
export function calculateProgressionTree(
  rootX: number,
  rootY: number,
  items: any[],
  outwardAngle: number // angle from center to root
): TreeLayout {
  const nodes: SubNodeLayout[] = [];
  const cards: CardLayout[] = [];
  const branches: BranchPath[] = [];

  // Sort items NEWEST to OLDEST (most recent first)
  const sortedItems = [...items].sort((a, b) => {
    const yearA = extractStartYear(a.year);
    const yearB = extractStartYear(b.year);
    return yearB - yearA; // descending order
  });

  // Determine expansion quadrant from the outward angle (direction from
  // center THROUGH the root node - e.g. top-left for Career, top-right for Skills)
  const radians = (outwardAngle * Math.PI) / 180;
  const dirX = Math.cos(radians);
  const dirY = Math.sin(radians);

  // Sign of each axis locks the staircase into the SAME quadrant as the main
  // node (e.g. Career top-left -> signX=-1, signY=-1 -> subnodes go up-left)
  const signX = dirX >= 0 ? 1 : -1;
  const signY = dirY >= 0 ? 1 : -1;

  // Cards sit on whichever side matches the outward horizontal direction
  const isRight = signX >= 0;

  sortedItems.forEach((item, index) => {
    // Staircase outward: both axes grow every step by a fixed amount that
    // exceeds card dimensions, so overlap is mathematically impossible
    const nodeX = rootX + signX * (PROGRESSION_START_X + index * PROGRESSION_STEP_X);
    const nodeY = rootY + signY * (PROGRESSION_START_Y + index * PROGRESSION_STEP_Y);

    nodes.push({
      id: item.id,
      x: nodeX,
      y: nodeY,
      data: item,
    });

    // Card placed on the side matching the outward direction
    const cardX = isRight
      ? nodeX + NODE_CARD_GAP
      : nodeX - NODE_CARD_GAP - CARD_WIDTH;

    cards.push({
      nodeId: item.id,
      x: cardX,
      y: nodeY - CARD_MIN_HEIGHT / 2,
      width: CARD_WIDTH,
      height: CARD_MIN_HEIGHT,
      isRight,
    });

    // Create branch from previous node (or root)
    const fromX = index === 0 ? rootX : nodes[index - 1].x;
    const fromY = index === 0 ? rootY : nodes[index - 1].y;

    branches.push({
      id: `branch-${item.id}`,
      d: createBezierPath(fromX, fromY, nodeX, nodeY),
      fromX,
      fromY,
      toX: nodeX,
      toY: nodeY,
    });
  });

  return {
    type: 'progression',
    rootX,
    rootY,
    nodes,
    cards,
    branches,
  };
}

/**
 * Calculate radial tree layout (Skills, Hobbies, Contact)
 * Fan spread around root
 */
export function calculateRadialTree(
  rootX: number,
  rootY: number,
  items: any[],
  outwardAngle: number
): TreeLayout {
  const nodes: SubNodeLayout[] = [];
  const cards: CardLayout[] = [];
  const branches: BranchPath[] = [];

  // Arc spread grows with item count so nodes never crowd together
  const arcDegrees = RADIAL_MIN_ARC + Math.max(0, items.length - 3) * RADIAL_ARC_PER_ITEM;
  const startAngle = outwardAngle - arcDegrees / 2;

  items.forEach((item, index) => {
    const angle = startAngle + (index / Math.max(items.length - 1, 1)) * arcDegrees;
    const radians = (angle * Math.PI) / 180;

    // Alternate between two concentric rings - guarantees adjacent fan
    // nodes (and their cards) are separated both angularly AND radially,
    // eliminating overlap even when the arc is tightly packed
    const ringRadius = RADIAL_RADIUS + (index % 2 === 1 ? RADIAL_RING_OFFSET : 0);

    const nodeX = rootX + Math.cos(radians) * ringRadius;
    const nodeY = rootY + Math.sin(radians) * ringRadius;

    nodes.push({
      id: item.id,
      x: nodeX,
      y: nodeY,
      data: item,
    });

    // Position card based on angle
    const isRight = Math.cos(radians) > 0;
    const cardX = isRight
      ? nodeX + NODE_CARD_GAP
      : nodeX - NODE_CARD_GAP - CARD_WIDTH;

    cards.push({
      nodeId: item.id,
      x: cardX,
      y: nodeY - CARD_MIN_HEIGHT / 2,
      width: CARD_WIDTH,
      height: CARD_MIN_HEIGHT,
      isRight,
    });

    // Branch from root to node
    branches.push({
      id: `branch-${item.id}`,
      d: createBezierPath(rootX, rootY, nodeX, nodeY),
      fromX: rootX,
      fromY: rootY,
      toX: nodeX,
      toY: nodeY,
    });
  });

  return {
    type: 'radial',
    rootX,
    rootY,
    nodes,
    cards,
    branches,
  };
}

/**
 * Calculate camera position to focus on selected tree.
 * The root is repositioned to the OPPOSITE side of its expansion direction,
 * so the quadrant the subnodes grow into (e.g. top-left for Career) is left
 * open with maximum space. Direction-agnostic: works for any of the 6 nodes.
 */
export function calculateTreeCamera(
  rootX: number,
  rootY: number,
  outwardAngle: number,
  layoutBounds?: { minX: number; maxX: number; minY: number; maxY: number }
): { x: number; y: number; scale: number } {
  const VIEWPORT_PADDING = 6; // % padding, guarantees nothing touches the edge

  const radians = (outwardAngle * Math.PI) / 180;
  const dirX = Math.cos(radians);
  const dirY = Math.sin(radians);

  // Move root toward the side OPPOSITE its expansion direction so the
  // expansion quadrant has room to breathe (e.g. Career expands top-left,
  // so root lands bottom-right of viewport center)
  const targetX = 50 - dirX * 24;
  const targetY = 50 - dirY * 20;

  // Zoom out if the tree's bounding box is larger than the available viewport
  let scale = 1.0;
  if (layoutBounds) {
    const availableWidth = 100 - VIEWPORT_PADDING * 2;
    const availableHeight = 100 - VIEWPORT_PADDING * 2;
    const contentWidth = layoutBounds.maxX - layoutBounds.minX;
    const contentHeight = layoutBounds.maxY - layoutBounds.minY;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    scale = Math.min(scaleX, scaleY, 1.0);
  }

  // The world container's transform-origin is fixed at (0%, 0%), meaning the
  // CSS transform composes as: screenPos = localPos * scale + translate.
  // Solve for translate so the root lands exactly on target AFTER scaling.
  let tx = targetX - rootX * scale;
  let ty = targetY - rootY * scale;

  // Clamp so the ENTIRE tree bounding box always stays inside the padded
  // viewport - if the root-centric translate would clip content, shift it.
  if (layoutBounds) {
    const screenMinX = layoutBounds.minX * scale + tx;
    const screenMaxX = layoutBounds.maxX * scale + tx;
    const screenMinY = layoutBounds.minY * scale + ty;
    const screenMaxY = layoutBounds.maxY * scale + ty;

    if (screenMinX < VIEWPORT_PADDING) {
      tx += VIEWPORT_PADDING - screenMinX;
    } else if (screenMaxX > 100 - VIEWPORT_PADDING) {
      tx -= screenMaxX - (100 - VIEWPORT_PADDING);
    }

    if (screenMinY < VIEWPORT_PADDING) {
      ty += VIEWPORT_PADDING - screenMinY;
    } else if (screenMaxY > 100 - VIEWPORT_PADDING) {
      ty -= screenMaxY - (100 - VIEWPORT_PADDING);
    }
  }

  return {
    x: tx,
    y: ty,
    scale,
  };
}
