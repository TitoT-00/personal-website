export type SpatialLabelInput = {
  id: string;
  /** Desired label center in viewport pixels, including any offset from its sphere. */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SpatialLabelPosition = { x: number; y: number };
type Rectangle = { left: number; top: number; right: number; bottom: number };

const EDGE_PADDING = 12;
const LABEL_GAP = 8;
const HORIZONTAL_OFFSETS = [0, 40, -40, 80, -80];
const VERTICAL_OFFSETS = [0, 32, -32, 64, -64, 96, -96, 128, -128, 160, -160, 192, -192, 200, -200];

function clampCenter(value: number, size: number, viewportSize: number) {
  const minimum = EDGE_PADDING + size / 2;
  const maximum = viewportSize - EDGE_PADDING - size / 2;
  // Oversized labels still stay centered when the viewport cannot contain them.
  return maximum < minimum ? viewportSize / 2 : Math.max(minimum, Math.min(maximum, value));
}

function rectangle(center: SpatialLabelPosition, label: SpatialLabelInput): Rectangle {
  const halfWidth = (label.width + LABEL_GAP) / 2;
  const halfHeight = (label.height + LABEL_GAP) / 2;
  return { left: center.x - halfWidth, right: center.x + halfWidth, top: center.y - halfHeight, bottom: center.y + halfHeight };
}

function overlapArea(first: Rectangle, second: Rectangle) {
  const width = Math.min(first.right, second.right) - Math.max(first.left, second.left);
  const height = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);
  return width > 0 && height > 0 ? width * height : 0;
}

/**
 * Places screen-space labels near their desired centers without moving scene objects.
 * Inputs use unique IDs and pixel dimensions; output values are actual label centers.
 * Topmost labels receive priority, with stable input ordering for equal coordinates.
 */
export function resolveSpatialLabels(
  input: SpatialLabelInput[],
  viewport: { width: number; height: number },
): Map<string, SpatialLabelPosition> {
  const positions = new Map<string, SpatialLabelPosition>();
  const occupied: Rectangle[] = [];
  const ordered = input.map((label, index) => ({ label, index })).sort(
    (first, second) => first.label.y - second.label.y || first.label.x - second.label.x || first.index - second.index,
  );

  for (const { label } of ordered) {
    let bestPosition = {
      x: clampCenter(label.x, label.width, viewport.width),
      y: clampCenter(label.y, label.height, viewport.height),
    };
    let bestScore = Infinity;
    const visited = new Set<string>();

    for (const dy of VERTICAL_OFFSETS) {
      for (const dx of HORIZONTAL_OFFSETS) {
        const candidate = {
          x: clampCenter(label.x + dx, label.width, viewport.width),
          y: clampCenter(label.y + dy, label.height, viewport.height),
        };
        const key = `${candidate.x}:${candidate.y}`;
        if (visited.has(key)) continue;
        visited.add(key);

        const bounds = rectangle(candidate, label);
        let score = (candidate.x - label.x) ** 2 + (candidate.y - label.y) ** 2;
        for (const other of occupied) {
          const area = overlapArea(bounds, other);
          // A clear position beats a nearby collision; impossible fits minimize overlap.
          if (area > 0) score += 1_000_000 + area * 10_000;
        }
        if (score < bestScore) {
          bestScore = score;
          bestPosition = candidate;
        }
      }
    }

    positions.set(label.id, bestPosition);
    occupied.push(rectangle(bestPosition, label));
  }

  return positions;
}
