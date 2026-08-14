export default function BackgroundConstellations() {
  const constellations = [
    {
      id: "constellation-1",
      nodes: [
        { x: 15, y: 15 },
        { x: 18, y: 12 },
        { x: 22, y: 14 },
        { x: 20, y: 18 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
    {
      id: "constellation-2",
      nodes: [
        { x: 85, y: 20 },
        { x: 88, y: 18 },
        { x: 90, y: 22 },
        { x: 87, y: 25 },
        { x: 84, y: 23 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },
    {
      id: "constellation-3",
      nodes: [
        { x: 10, y: 85 },
        { x: 13, y: 88 },
        { x: 16, y: 86 },
        { x: 14, y: 90 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [1, 3],
      ],
    },
    {
      id: "constellation-4",
      nodes: [
        { x: 88, y: 85 },
        { x: 85, y: 88 },
        { x: 90, y: 90 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [0, 2],
      ],
    },
    {
      id: "constellation-5",
      nodes: [
        { x: 5, y: 50 },
        { x: 8, y: 48 },
        { x: 10, y: 52 },
        { x: 7, y: 55 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
    {
      id: "constellation-6",
      nodes: [
        { x: 92, y: 50 },
        { x: 95, y: 48 },
        { x: 94, y: 53 },
      ],
      connections: [
        [0, 1],
        [1, 2],
      ],
    },
  ];

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-30"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {constellations.map((constellation) => (
        <g key={constellation.id} className="constellation-group">
          {constellation.connections.map(([startIdx, endIdx], idx) => {
            const start = constellation.nodes[startIdx];
            const end = constellation.nodes[endIdx];
            return (
              <line
                key={`${constellation.id}-line-${idx}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(148, 163, 184, 0.3)"
                strokeWidth="0.1"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {constellation.nodes.map((node, idx) => (
            <circle
              key={`${constellation.id}-node-${idx}`}
              cx={node.x}
              cy={node.y}
              r="0.3"
              fill="rgba(226, 232, 240, 0.6)"
              className="constellation-star"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
