import ConstellationBranch from "../ConstellationBranch/index";

type PortfolioNode = {
  title: string;
  x: number;
  y: number;
  color: string;
};

type ConstellationBranchesProps = {
  nodes: PortfolioNode[];
  activeTree: string | null;
};

export default function ConstellationBranches({
  nodes,
  activeTree,
}: ConstellationBranchesProps) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {nodes.map((node) => (
        <ConstellationBranch
          key={node.title}
          x={node.x}
          y={node.y}
          color={node.color}
          active={activeTree === node.title}
        />
      ))}
    </svg>
  );
}